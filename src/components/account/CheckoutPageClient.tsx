"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { UpdateStateDialog } from "@/components/account/UpdateStateDialog";
import { formatCartMoney } from "@/lib/account/cart-totals";
import { userHasState } from "@/lib/api/modules/auth/mapper";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { userAtom } from "@/lib/store/user";

type CheckoutItem = {
  cartItemId: string;
  packageId: number | null;
  title: string;
  thumbnail: string;
  listPrice: number;
  salePrice: number;
  discountAmount: number;
  payableAmount: number;
  promocodeCode: string | null;
  detailsHref: string;
};

type CheckoutPageClientProps = {
  item: CheckoutItem | null;
  subtotalAmount: number;
  discountAmount: number;
  payableAmount: number;
  promocodeOptions: Array<{ id: string; code: string; title: string }>;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: () => void) => void;
    };
  }
}

async function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutPageClient({
  item,
  subtotalAmount,
  discountAmount,
  payableAmount,
  promocodeOptions,
}: CheckoutPageClientProps) {
  const router = useRouter();
  const authUser = useAtomValue(userAtom);
  const [couponInput, setCouponInput] = useState(item?.promocodeCode || "");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [subtotal, setSubtotal] = useState(subtotalAmount);
  const [discount, setDiscount] = useState(discountAmount);
  const [payable, setPayable] = useState(payableAmount);
  const [appliedCode, setAppliedCode] = useState(item?.promocodeCode || null);
  const [stateDialogOpen, setStateDialogOpen] = useState(false);
  const [resumePayAfterState, setResumePayAfterState] = useState(false);

  async function applyCoupon() {
    if (!item || !couponInput.trim()) return;
    const match = promocodeOptions.find(
      (opt) => opt.code.toUpperCase() === couponInput.trim().toUpperCase()
    );
    if (!match) {
      setError("Invalid coupon code");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetchAuthed("/api/checkout/promocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItemId: item.cartItemId,
          promocodeId: match.id,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        totals?: {
          subtotalAmount: number;
          discountAmount: number;
          payableAmount: number;
        };
        code?: string | null;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unable to apply coupon");
      }
      if (data.totals) {
        setSubtotal(data.totals.subtotalAmount);
        setDiscount(data.totals.discountAmount);
        setPayable(data.totals.payableAmount);
      }
      setAppliedCode(data.code ?? match.code);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to apply coupon");
    } finally {
      setPending(false);
    }
  }

  async function removeCoupon() {
    if (!item) return;
    setPending(true);
    setError(null);
    try {
      const res = await fetchAuthed("/api/checkout/promocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItemId: item.cartItemId,
          promocodeId: null,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        totals?: {
          subtotalAmount: number;
          discountAmount: number;
          payableAmount: number;
        };
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unable to remove coupon");
      }
      if (data.totals) {
        setSubtotal(data.totals.subtotalAmount);
        setDiscount(data.totals.discountAmount);
        setPayable(data.totals.payableAmount);
      }
      setAppliedCode(null);
      setCouponInput("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove coupon");
    } finally {
      setPending(false);
    }
  }

  async function handlePay(options?: { skipStateCheck?: boolean }) {
    if (!item) return;
    if (!options?.skipStateCheck && !userHasState(authUser)) {
      setResumePayAfterState(true);
      setStateDialogOpen(true);
      setError("Please select your state before continuing to pay.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetchAuthed("/api/checkout/pay", { method: "POST" });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        mode?: string;
        keyId?: string;
        razorpayOrderId?: string;
        amountPaise?: number;
        currency?: string;
        orderNumber?: string;
        payableAmount?: number;
        prefill?: { name?: string; email?: string; contact?: string };
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.mode === "free") {
        router.push("/account/checkout/success");
        router.refresh();
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) {
        throw new Error("Unable to load Razorpay");
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amountPaise,
        currency: data.currency || "INR",
        name: "Rodha",
        description: item.title,
        order_id: data.razorpayOrderId,
        prefill: data.prefill,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetchAuthed("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = (await verifyRes.json()) as {
            ok: boolean;
            error?: string;
          };
          if (!verifyRes.ok || !verifyData.ok) {
            setError(verifyData.error || "Payment verification failed");
            setPending(false);
            return;
          }
          router.push("/account/checkout/success");
          router.refresh();
        },
        modal: {
          ondismiss: () => {
            setPending(false);
            setError("Payment cancelled");
          },
        },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setPending(false);
    }
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-8 text-center">
        <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
          Checkout
        </h1>
        <p className="mt-2 text-body-sm text-[var(--account-text-muted)]">
          No package selected. Choose a course and click Buy Now to continue.
        </p>
        <Link
          href="/account/courses?tab=buy"
          className="mt-5 inline-flex text-[14px] font-semibold text-[var(--account-accent)]"
        >
          Browse courses →
        </Link>
      </div>
    );
  }

  const stateDialog = (
    <UpdateStateDialog
      open={stateDialogOpen}
      required={resumePayAfterState}
      initialStateId={authUser?.stateId}
      title="Select your state to continue"
      description="State is required before you can complete checkout."
      onClose={() => {
        setStateDialogOpen(false);
        setResumePayAfterState(false);
      }}
      onUpdated={() => {
        setStateDialogOpen(false);
        setError(null);
        if (resumePayAfterState) {
          setResumePayAfterState(false);
          void handlePay({ skipStateCheck: true });
        }
      }}
    />
  );

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

        <article className="flex gap-4 rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-md bg-[var(--account-border)]">
            <Image
              src={item.thumbnail}
              alt=""
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-montserrat text-[15px] font-semibold text-[var(--account-text)]">
              {item.title}
            </h2>
            <p className="mt-2 text-[14px] font-semibold text-[var(--account-text)]">
              {formatCartMoney(item.payableAmount)}
            </p>
            <Link
              href={item.detailsHref}
              className="mt-2 inline-block text-[13px] font-medium text-[var(--account-accent)]"
            >
              View details
            </Link>
          </div>
        </article>
      </div>

      <aside className="flex h-fit flex-col gap-4 lg:sticky lg:top-4">
        <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-5 shadow-[var(--account-shadow)]">
          <h3 className="text-[15px] font-semibold text-[var(--account-text)]">
            Order Summary
          </h3>
          <dl className="mt-4 space-y-2 text-[13px]">
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--account-text-muted)]">Subtotal</dt>
              <dd>{formatCartMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--account-text-muted)]">Discount</dt>
              <dd>-{formatCartMoney(discount)}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-[var(--account-border)] pt-2 text-[15px] font-semibold">
              <dt>Total</dt>
              <dd>{formatCartMoney(payable)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => void handlePay()}
            disabled={pending}
            className="mt-5 inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Processing…" : "Continue to Pay"}
          </button>
        </div>

        <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4 shadow-[var(--account-shadow)]">
          <p className="text-[14px] font-semibold text-[var(--account-text)]">
            Have a coupon?
          </p>
          <div className="mt-3 space-y-2">
            {appliedCode ? (
              <div className="flex items-center justify-between rounded-md bg-[var(--account-nav-active-bg)] px-3 py-2.5 text-[13px]">
                <span className="font-medium text-[var(--account-accent)]">
                  {appliedCode}
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  disabled={pending}
                  className="cursor-pointer font-semibold text-[var(--account-text-muted)] hover:text-[var(--account-text)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Remove Coupon
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter coupon code"
                  className="min-w-0 flex-1 rounded-[var(--account-radius)] border border-[var(--account-input-border)] bg-[var(--account-input-bg)] px-3 py-2 text-[13px]"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={pending}
                  className="cursor-pointer rounded-[var(--account-radius)] bg-[var(--account-accent)] px-3 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
          {error ? (
            <p className="mt-3 text-[12px] text-red-500" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </aside>
    </div>
    {stateDialog}
    </>
  );
}
