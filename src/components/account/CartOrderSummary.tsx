"use client";

import { useId, useState } from "react";
import {
  ChevronDown,
  Gift,
  Info,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatCartMoney,
  type CartTotals,
} from "@/lib/account/cart-totals";
import type { CartCoupon, CartSummaryConfig } from "@/lib/account/types";

type CartOrderSummaryProps = {
  totals: CartTotals;
  config: CartSummaryConfig;
  coupon: CartCoupon;
  couponApplied: boolean;
  couponInput: string;
  couponError: string | null;
  onCouponInputChange: (value: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  continueCtaPrefix: string;
  className?: string;
};

export function CartOrderSummary({
  totals,
  config,
  coupon,
  couponApplied,
  couponInput,
  couponError,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
  continueCtaPrefix,
  className,
}: CartOrderSummaryProps) {
  const [discountOpen, setDiscountOpen] = useState(true);
  const discountPanelId = useId();
  const empty = totals.itemCount === 0;
  const savingsMessage = config.savingsBannerTemplate.replace(
    "{amount}",
    formatCartMoney(totals.totalSavings)
  );

  return (
    <aside
      className={cn(
        "rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-5 shadow-[var(--account-shadow)] lg:sticky lg:top-4",
        className
      )}
    >
      <h2 className="font-montserrat text-base font-bold text-[var(--account-text)]">
        Order Summary
      </h2>

      <dl className="mt-4 space-y-3 text-[14px]">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-[var(--account-text-secondary)]">
            Subtotal ({totals.itemCount}{" "}
            {totals.itemCount === 1 ? "item" : "items"})
          </dt>
          <dd className="font-medium text-[var(--account-text)]">
            {formatCartMoney(totals.subtotal)}
          </dd>
        </div>

        {totals.productDiscount > 0 ? (
          <div>
            <button
              type="button"
              aria-expanded={discountOpen}
              aria-controls={discountPanelId}
              onClick={() => setDiscountOpen((open) => !open)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <span className="inline-flex items-center gap-1 text-[var(--account-text-secondary)]">
                Discount
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    discountOpen && "rotate-180"
                  )}
                  aria-hidden
                />
              </span>
              <span className="font-medium text-emerald-600">
                − {formatCartMoney(totals.productDiscount)}
              </span>
            </button>
            {discountOpen ? (
              <ul
                id={discountPanelId}
                className="mt-2 space-y-1.5 border-l-2 border-[var(--account-border)] pl-3 text-[12px] text-[var(--account-text-muted)]"
              >
                {totals.lineDiscounts.map((line) => (
                  <li
                    key={line.id}
                    className="flex items-start justify-between gap-2"
                  >
                    <span className="min-w-0 truncate">{line.label}</span>
                    <span className="shrink-0 text-emerald-600">
                      − {formatCartMoney(line.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <dt className="inline-flex items-center gap-1 text-[var(--account-text-secondary)]">
            GST ({Math.round(config.gstRate * 100)}%)
            <span
              title="Goods and Services Tax applied on the amount after coupon"
              className="inline-flex text-[var(--account-text-muted)]"
            >
              <Info className="size-3.5" aria-hidden />
              <span className="sr-only">
                Goods and Services Tax applied on the amount after coupon
              </span>
            </span>
          </dt>
          <dd className="font-medium text-[var(--account-text)]">
            {formatCartMoney(totals.gst)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--account-border)] pt-3">
          <dt className="font-semibold text-[var(--account-text)]">
            Total Amount
          </dt>
          <dd className="text-xl font-bold text-[var(--account-accent)]">
            {formatCartMoney(totals.total)}
          </dd>
        </div>
      </dl>

      <div className="mt-5 space-y-3">
        {couponApplied ? (
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-[13px]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-emerald-700">
                  {coupon.appliedLabel}
                </p>
                <p className="mt-0.5 text-emerald-700/80">
                  You saved {formatCartMoney(totals.couponDiscount)} (
                  {coupon.percentOff}%)
                </p>
              </div>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="shrink-0 text-[13px] font-semibold text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => onCouponInputChange(e.target.value)}
                placeholder="Enter coupon code"
                aria-label="Coupon code"
                disabled={empty}
                className="min-w-0 flex-1 rounded-lg border border-[var(--account-input-border)] bg-[var(--account-input-bg)] px-3 py-2.5 text-[14px] text-[var(--account-text)] outline-none placeholder:text-[var(--account-text-muted)] focus:border-[var(--account-accent)] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={onApplyCoupon}
                disabled={empty || !couponInput.trim()}
                className="shrink-0 rounded-lg bg-[var(--account-accent)] px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply
              </button>
            </div>
            {couponError ? (
              <p className="text-[12px] text-red-500" role="alert">
                {couponError}
              </p>
            ) : null}
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={empty}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--account-accent)] px-4 py-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {continueCtaPrefix} {formatCartMoney(totals.total)}
        <span aria-hidden>→</span>
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-[var(--account-text-muted)]">
        <ShieldCheck
          className="size-3.5 text-emerald-600"
          aria-hidden
        />
        {config.secureCheckoutLabel}
      </p>

      {!empty && totals.totalSavings > 0 ? (
        <p className="mt-4 flex items-start gap-2 rounded-lg bg-[var(--account-accent-soft)] px-3 py-2.5 text-[12px] leading-snug text-[var(--account-text-secondary)]">
          <Gift
            className="mt-0.5 size-4 shrink-0 text-[var(--account-accent)]"
            aria-hidden
          />
          <span>{savingsMessage}</span>
        </p>
      ) : null}
    </aside>
  );
}
