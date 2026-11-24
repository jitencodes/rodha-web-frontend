"use client";

import { useRef, useState } from "react";
import type { AddonViewModel } from "@/lib/api/modules/addons/types";
import type { AuthUserViewModel } from "@/lib/api/modules/auth/types";
import type { CheckoutPromocodeOption } from "@/lib/api/modules/student/cart/types";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { openRazorpay } from "@/lib/checkout/razorpay";
import type {
  CheckoutCart,
  CheckoutCartResponse,
  CheckoutPayResponse,
  CheckoutSession,
  CheckoutSessionResponse,
  CheckoutVerifyResponse,
} from "@/lib/checkout/types";
import { storePendingPurchase } from "@/lib/tracking/purchase";
import { readStoredUtm } from "@/lib/tracking/utm";

type UseCheckoutOptions = {
  initialSession: CheckoutSession;
  /** Runs after a confirmed (or free) purchase. */
  onPaid: () => void;
};

const NETWORK_ERROR = "Something went wrong. Check your connection and try again.";

const PAYMENT_UNCONFIRMED =
  "We could not confirm your payment yet. If money was debited, check My Orders before paying again.";

async function postJson<T>(url: string, body: unknown): Promise<{ status: number; data: T | null }> {
  const res = await fetchAuthed(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => null)) as T | null;
  return { status: res.status, data };
}

/** Cart state and actions shared by the checkout page and the sidebar. */
export function useCheckout({ initialSession, onPaid }: UseCheckoutOptions) {
  const [session, setSession] = useState(initialSession);
  const [syncedFrom, setSyncedFrom] = useState(initialSession);
  const [couponPending, setCouponPending] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [addonPendingId, setAddonPendingId] = useState<number | null>(null);
  const [addonError, setAddonError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  /** Razorpay took the payment but verification failed: block a second payment. */
  const [unconfirmed, setUnconfirmed] = useState(false);
  const payStartedRef = useRef(false);

  // Take fresh server data after router.refresh().
  if (syncedFrom !== initialSession) {
    setSyncedFrom(initialSession);
    setSession(initialSession);
  }

  const { product, line, websiteCategoryId } = session;

  /** An emptied cart carries no product; keep what is on screen. */
  function applyCart(cart: CheckoutCart) {
    setSession((prev) => ({
      ...prev,
      ...cart,
      product: cart.product ?? prev.product,
      addons: cart.line ? cart.addons : prev.addons,
    }));
  }

  /** Re-read the cart after the API refused it (stale add-on, coupon, price). */
  async function reload(): Promise<void> {
    const params = new URLSearchParams();
    if (product?.packageId != null) params.set("packageId", String(product.packageId));
    if (product?.slug) params.set("slug", product.slug);
    try {
      const res = await fetchAuthed(`/api/checkout/session?${params.toString()}`, {
        cache: "no-store",
      });
      const data = (await res.json().catch(() => null)) as CheckoutSessionResponse | null;
      if (data?.ok && data.session) setSession(data.session);
    } catch {
      // Keep the current view; the original error is already shown.
    }
  }

  async function updateCoupon(
    update: { code: string } | { promocodeId: string | null },
    fallbackError: string
  ): Promise<boolean> {
    if (!line || couponPending || paying) return false;
    setCouponPending(true);
    setCouponError(null);
    try {
      const { data } = await postJson<CheckoutCartResponse>("/api/checkout/promocode", {
        cartItemId: line.cartItemId,
        websiteCategoryId,
        ...update,
      });
      if (!data?.ok || !data.cart) {
        // 400 → invalid / expired / not eligible; 409 → usage limit reached.
        setCouponError(data?.error || fallbackError);
        return false;
      }
      applyCart(data.cart);
      return true;
    } catch {
      setCouponError(NETWORK_ERROR);
      return false;
    } finally {
      setCouponPending(false);
    }
  }

  const applyCode = (code: string) =>
    updateCoupon({ code: code.trim() }, "Unable to apply coupon");
  const applyOffer = (offer: CheckoutPromocodeOption) =>
    updateCoupon({ promocodeId: offer.id }, "Unable to apply coupon");
  const removeCoupon = () =>
    updateCoupon({ promocodeId: null }, "Unable to remove coupon");

  async function toggleAddon(addon: AddonViewModel): Promise<void> {
    if (addonPendingId != null || paying || unconfirmed) return;
    const isSelected = session.selectedAddonIds.includes(addon.id);
    const addonIds = isSelected
      ? session.selectedAddonIds.filter((id) => id !== addon.id)
      : [...session.selectedAddonIds, addon.id];

    setAddonPendingId(addon.id);
    setAddonError(null);
    setPayError(null);
    try {
      const { status, data } = await postJson<CheckoutCartResponse>("/api/checkout/addons", {
        cartItemId: line?.cartItemId ?? null,
        packageId: product?.packageId ?? null,
        packageOwned: session.packageOwned,
        addonIds,
        websiteCategoryId,
      });
      if (!data?.ok || !data.cart) {
        setAddonError(data?.error || "Unable to update add-ons");
        // 400 withdrawn · 404 line gone · 409 owned / on another line.
        if (status === 400 || status === 404 || status === 409) await reload();
        return;
      }
      applyCart(data.cart);
    } catch {
      setAddonError(NETWORK_ERROR);
    } finally {
      setAddonPendingId(null);
    }
  }

  function releasePay() {
    payStartedRef.current = false;
    setPaying(false);
  }

  function finishPurchase(
    checkout: CheckoutPayResponse,
    verified?: CheckoutVerifyResponse
  ) {
    const orderId = verified?.orderId ?? checkout.orderId;
    storePendingPurchase({
      transaction_id:
        verified?.orderNumber ||
        checkout.orderNumber ||
        (typeof orderId === "number" ? String(orderId) : ""),
      value: verified?.payableAmount ?? checkout.payableAmount ?? 0,
      currency: checkout.currency || "INR",
    });
    onPaid();
  }

  async function submitPayment(stateName: string | null): Promise<void> {
    if (!line || unconfirmed || payStartedRef.current) return;
    payStartedRef.current = true;
    setPaying(true);
    setPayError(null);

    const category = websiteCategoryId != null ? { websiteCategoryId } : {};
    try {
      const { status, data: checkout } = await postJson<CheckoutPayResponse>(
        "/api/checkout/pay",
        { ...readStoredUtm(), ...(stateName ? { stateName } : {}), ...category }
      );
      if (!checkout?.ok) {
        setPayError(checkout?.error || "Checkout failed");
        releasePay();
        // 400 cart empty / add-on withdrawn · 409 coupon refused / add-on owned.
        if (status === 400 || status === 409) await reload();
        return;
      }

      if (checkout.mode === "free") {
        finishPurchase(checkout);
        return;
      }

      const payment = await openRazorpay({
        ...checkout,
        description: product?.title ?? "Rodha",
      });
      if (!payment) {
        setPayError("Payment cancelled");
        releasePay();
        return;
      }

      let verified: CheckoutVerifyResponse | null = null;
      try {
        ({ data: verified } = await postJson<CheckoutVerifyResponse>(
          "/api/checkout/verify",
          { ...payment, ...category }
        ));
      } catch {
        verified = null;
      }
      if (!verified?.ok) {
        setUnconfirmed(true);
        setPayError(PAYMENT_UNCONFIRMED);
        releasePay();
        return;
      }
      finishPurchase(checkout, verified);
    } catch (error) {
      setPayError(
        error instanceof TypeError
          ? NETWORK_ERROR
          : error instanceof Error
            ? error.message
            : "Checkout failed"
      );
      releasePay();
    }
  }

  function setUser(user: AuthUserViewModel) {
    setSession((prev) => ({ ...prev, user }));
  }

  return {
    session,
    couponPending,
    couponError,
    clearCouponError: () => setCouponError(null),
    applyCode,
    applyOffer,
    removeCoupon,
    addonPendingId,
    addonError,
    toggleAddon,
    paying,
    setPaying,
    payError,
    setPayError,
    unconfirmed,
    submitPayment,
    setUser,
    /** Any cart change in flight: payment must wait for it. */
    busy: couponPending || addonPendingId != null || paying,
  };
}

export type CheckoutController = ReturnType<typeof useCheckout>;
