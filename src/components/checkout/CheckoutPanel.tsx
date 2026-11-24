"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { CouponAppliedOverlay } from "@/components/account/CouponAppliedOverlay";
import { DiscountRequestCta } from "@/components/account/discount-requests/DiscountRequestCta";
import { AddonPicker } from "@/components/checkout/AddonPicker";
import {
  CheckoutCoupon,
  CheckoutPriceRows,
  CheckoutProductCard,
  checkoutCardClass,
} from "@/components/checkout/CheckoutSections";
import { useCheckout } from "@/components/checkout/useCheckout";
import { usePayGate } from "@/components/checkout/usePayGate";
import { formatCartMoney } from "@/lib/account/cart-totals";
import { fireCouponConfetti } from "@/lib/checkout/coupon-confetti";
import type { CheckoutSession } from "@/lib/checkout/types";
import { cn } from "@/lib/utils";

type CheckoutPanelProps = {
  session: CheckoutSession;
  /** `page` = two columns · `drawer` = one scrolling column with a pay footer. */
  layout: "page" | "drawer";
  onPaid: () => void;
  /** State / mobile the buyer typed in the guest form. */
  knownStateName?: string | null;
  knownMobile?: string;
  /** Tells the drawer not to close mid-payment. */
  onBusyChange?: (busy: boolean) => void;
  /** Keeps the coupon celebration from replaying each time the drawer opens. */
  celebratedCodeRef?: RefObject<string | null>;
};

/** Checkout UI for a loaded session: add-ons, coupon, discount request, pay. */
export function CheckoutPanel({
  session: initialSession,
  layout,
  onPaid,
  knownStateName,
  knownMobile,
  onBusyChange,
  celebratedCodeRef,
}: CheckoutPanelProps) {
  const checkout = useCheckout({ initialSession, onPaid });
  const { session, paying, payError, unconfirmed, busy } = checkout;
  const { product, line, totals, packageOwned, user } = session;

  const ownCelebratedRef = useRef<string | null>(null);
  const celebratedRef = celebratedCodeRef ?? ownCelebratedRef;
  const [celebration, setCelebration] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);

  const appliedCode = line?.promocodeCode ?? null;
  const discountAmount = totals.discountAmount;

  useEffect(() => {
    if (!appliedCode) {
      celebratedRef.current = null;
      return;
    }
    if (celebratedRef.current === appliedCode) return;
    celebratedRef.current = appliedCode;
    setCelebration({ code: appliedCode, discountAmount });
    void fireCouponConfetti();
  }, [appliedCode, discountAmount, celebratedRef]);

  useEffect(() => {
    onBusyChange?.(paying);
  }, [paying, onBusyChange]);

  const { startPay, dialogs } = usePayGate({
    user,
    knownStateName,
    initialMobile: knownMobile,
    submit: checkout.submitPayment,
    setPending: checkout.setPaying,
    setError: checkout.setPayError,
    onUserUpdated: checkout.setUser,
  });

  if (!product) return null;

  const payLabel = paying
    ? "Processing…"
    : !line
      ? "Select an add-on to continue"
      : totals.payableAmount <= 0
        ? "Enrol for free"
        : "Continue to Pay";

  const payAlert = payError ? (
    <div className="text-[12px] text-red-500" role="alert">
      <p>{payError}</p>
      {unconfirmed ? (
        <Link
          href="/account/orders"
          className="mt-1 inline-block font-semibold text-[var(--account-accent)]"
        >
          Open My Orders →
        </Link>
      ) : null}
    </div>
  ) : null;

  const payButton = (
    <button
      type="button"
      onClick={startPay}
      disabled={busy || !line || unconfirmed}
      className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {payLabel}
    </button>
  );

  const productCard = (
    <CheckoutProductCard
      product={product}
      price={line?.packagePayableAmount ?? null}
      originalPrice={line?.listPrice}
      owned={packageOwned}
      showDetailsLink={layout === "page"}
    />
  );

  const addons = (
    <AddonPicker
      addons={session.addons}
      selectedIds={session.selectedAddonIds}
      onToggle={(addon) => void checkout.toggleAddon(addon)}
      pendingId={checkout.addonPendingId}
      disabled={busy || unconfirmed}
      error={checkout.addonError}
      title={packageOwned ? "Add-ons for your package" : "Add-ons"}
      description={
        packageOwned
          ? "Pick what you want to add to this package."
          : undefined
      }
    />
  );

  const coupon =
    line && !packageOwned ? <CheckoutCoupon checkout={checkout} /> : null;

  const discountCta =
    product.packageId != null && session.discountRequest && user && !packageOwned ? (
      <DiscountRequestCta
        className={cn(checkoutCardClass, "p-4")}
        packageId={product.packageId}
        packageTitle={product.title}
        websiteCategoryId={session.websiteCategoryId}
        isLoggedIn
        current={session.discountRequest}
        student={{ name: user.fullName, email: user.email, mobile: user.mobile }}
        loginHref="/login?next=/account/checkout"
        variant="account"
      />
    ) : null;

  const overlays = (
    <>
      {dialogs}
      {celebration ? (
        <CouponAppliedOverlay
          code={celebration.code}
          discountAmount={celebration.discountAmount}
          onClose={() => setCelebration(null)}
        />
      ) : null}
    </>
  );

  const nothingToBuy = packageOwned && session.addons.every((addon) => !addon.selectable);

  if (layout === "drawer") {
    return (
      <>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
          {productCard}
          {nothingToBuy ? (
            <p className={cn(checkoutCardClass, "p-4 text-[13px] text-[var(--account-text-secondary)]")}>
              You already own this package. Open it from My Courses to start learning.
            </p>
          ) : null}
          {addons}
          {coupon}
          {discountCta}
          {line ? (
            <div className={cn(checkoutCardClass, "p-4")}>
              <h3 className="mb-3 text-[14px] font-semibold text-[var(--account-text)]">
                Order Summary
              </h3>
              <CheckoutPriceRows session={session} />
            </div>
          ) : null}
        </div>
        <footer className="shrink-0 space-y-3 border-t border-[var(--account-border)] bg-[var(--account-surface)] px-4 py-4 sm:px-5">
          {payAlert}
          {nothingToBuy ? (
            <Link
              href={`/account/courses?tab=continue${product.packageId != null ? `&packageId=${product.packageId}` : ""}`}
              className="inline-flex h-11 w-full items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] px-4 text-[14px] font-semibold text-white"
            >
              View Course
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              {line ? (
                <div className="shrink-0">
                  <p className="text-[11px] text-[var(--account-text-muted)]">Total</p>
                  <p className="text-[17px] font-bold text-[var(--account-text)]" aria-live="polite">
                    {formatCartMoney(totals.payableAmount)}
                  </p>
                </div>
              ) : null}
              {payButton}
            </div>
          )}
        </footer>
        {overlays}
      </>
    );
  }

  return (
    <>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <header>
            <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
              Checkout
            </h1>
            <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
              Review your selected package and complete payment.
            </p>
          </header>
          {productCard}
          {addons}
        </div>

        <aside className="flex h-fit flex-col gap-4 lg:sticky lg:top-4">
          <div className={cn(checkoutCardClass, "p-5")}>
            <h3 className="mb-4 text-[15px] font-semibold text-[var(--account-text)]">
              Order Summary
            </h3>
            <CheckoutPriceRows session={session} />
            <div className="mt-5 space-y-3">
              {payAlert}
              {payButton}
            </div>
          </div>
          {coupon}
          {discountCta}
        </aside>
      </div>
      {overlays}
    </>
  );
}
