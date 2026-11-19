"use client";

import { useState } from "react";
import { BadgePercent } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import type { CheckoutPromocodeOption } from "@/lib/api/modules/student/cart/types";
import { formatDiscountDate } from "@/lib/api/modules/student/discount-requests/mapper";
import { formatCartMoney } from "@/lib/account/cart-totals";
import { cn, formatPrice } from "@/lib/utils";

type PackagePromocodeOffersProps = {
  offers: CheckoutPromocodeOption[];
  /** Code already reflected on price / cart (shown as Applied in the dialog). */
  appliedCode?: string | null;
  className?: string;
  /** `website` = light course card · `account` = checkout tokens + Apply. */
  variant?: "website" | "account";
  /** Checkout: apply a listed offer from the dialog. */
  onApply?: (option: CheckoutPromocodeOption) => void | Promise<void>;
  applyPending?: boolean;
};

/**
 * Compact CTA that opens Available offers in a dialog.
 * Website is display-only; account checkout can Apply from the list.
 */
export function PackagePromocodeOffers({
  offers,
  appliedCode,
  className,
  variant = "website",
  onApply,
  applyPending = false,
}: PackagePromocodeOffersProps) {
  const [open, setOpen] = useState(false);
  const isAccount = variant === "account";

  if (offers.length === 0) return null;

  const applied = appliedCode?.trim().toUpperCase() || null;
  const count = offers.length;

  async function handleApply(option: CheckoutPromocodeOption) {
    if (!onApply || applyPending) return;
    await onApply(option);
    setOpen(false);
  }

  const ctaClass = isAccount
    ? "inline-flex w-full items-center justify-center gap-2 rounded-[var(--account-radius)] border border-dashed border-[var(--account-accent)] bg-[var(--account-accent-soft)] px-3 py-2 text-[13px] font-semibold text-[var(--account-accent)] transition-colors hover:bg-[var(--account-nav-active-bg)]"
    : "inline-flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-orange-400 bg-orange-50/60 px-3 py-2 text-body-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50";

  const modalClass = isAccount
    ? cn(
        "max-w-md border-[var(--account-border)] bg-[var(--account-surface)] text-[var(--account-text)] shadow-xl",
        "[&_h2]:text-[var(--account-text)]",
        "[&>div:first-of-type]:border-[var(--account-border)]",
        "[&_button[aria-label='Close modal']]:text-[var(--account-text-muted)]",
        "[&_button[aria-label='Close modal']:hover]:text-[var(--account-text)]"
      )
    : cn(
        "max-w-md border-section-beige bg-white text-neutral-900 shadow-xl",
        "[&_h2]:text-neutral-900",
        "[&>div:first-of-type]:border-section-beige",
        "[&_button[aria-label='Close modal']]:text-neutral-500",
        "[&_button[aria-label='Close modal']:hover]:text-neutral-900"
      );

  return (
    <div className={className}>
      <button type="button" onClick={() => setOpen(true)} className={ctaClass}>
        <BadgePercent className="size-4 shrink-0" aria-hidden />
        View available offers ({count})
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Available offers"
        className={modalClass}
      >
        <ul className="max-h-[min(60vh,28rem)] space-y-2 overflow-y-auto">
          {offers.map((option) => {
            const isApplied =
              applied != null && option.code.toUpperCase() === applied;
            const till = formatDiscountDate(option.validTill);
            const saving =
              option.estimatedDiscount > 0
                ? isAccount
                  ? ` · Save ${formatCartMoney(option.estimatedDiscount)}`
                  : ` · Save ${formatPrice(option.estimatedDiscount)}`
                : "";

            return (
              <li
                key={option.id}
                className={
                  isAccount
                    ? cn(
                        "rounded-md border px-3 py-2.5",
                        isApplied || option.isBest
                          ? "border-[var(--account-accent)] bg-[var(--account-nav-active-bg)]"
                          : "border-dashed border-[var(--account-border-strong)]"
                      )
                    : isApplied || option.isBest
                      ? "rounded-md border border-orange-300 bg-orange-50/70 px-3 py-2.5"
                      : "rounded-md border border-dashed border-section-beige px-3 py-2.5"
                }
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          "font-mono text-[13px] font-bold tracking-wide",
                          isAccount
                            ? "text-[var(--account-accent)]"
                            : "text-orange-600"
                        )}
                      >
                        {option.code}
                      </span>
                      {option.isBest ? (
                        <span
                          className={
                            isAccount
                              ? "rounded-full bg-[var(--account-status-active-bg)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--account-status-active-text)]"
                              : "rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700"
                          }
                        >
                          Best offer
                        </span>
                      ) : null}
                      {isApplied ? (
                        <span
                          className={cn(
                            "text-[11px] font-semibold",
                            isAccount
                              ? "text-[var(--account-accent)]"
                              : "text-orange-600"
                          )}
                        >
                          Applied
                        </span>
                      ) : null}
                    </div>
                    {option.offerLabel ? (
                      <p
                        className={cn(
                          "mt-0.5 text-[12px]",
                          isAccount
                            ? "text-[var(--account-text)]"
                            : "text-neutral-700"
                        )}
                      >
                        {option.offerLabel}
                        {saving}
                      </p>
                    ) : null}
                    {option.description || till ? (
                      <p
                        className={cn(
                          "mt-0.5 text-[11px]",
                          isAccount
                            ? "text-[var(--account-text-muted)]"
                            : "text-neutral-500"
                        )}
                      >
                        {[option.description, till ? `Valid till ${till}` : ""]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    ) : null}
                    {!isAccount && !option.autoApply && !isApplied ? (
                      <p className="mt-0.5 text-caption text-neutral-500">
                        Apply at checkout
                      </p>
                    ) : null}
                  </div>
                  {isAccount ? (
                    isApplied ? (
                      <span className="shrink-0 text-[12px] font-semibold text-[var(--account-accent)]">
                        Applied
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void handleApply(option)}
                        disabled={applyPending}
                        className="shrink-0 cursor-pointer text-[12px] font-semibold text-[var(--account-accent)] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Apply
                      </button>
                    )
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>

        <div
          className={cn(
            "mt-4 flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center sm:justify-between",
            isAccount ? "border-[var(--account-border)]" : "border-section-beige"
          )}
        >
          <p
            className={cn(
              "text-[12px]",
              isAccount
                ? "text-[var(--account-text-muted)]"
                : "text-caption text-neutral-500"
            )}
          >
            {isAccount
              ? "Pick an offer or type a code on checkout."
              : "Coupons are applied at checkout."}
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className={
              isAccount
                ? "inline-flex h-10 shrink-0 items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] px-4 text-[13px] font-semibold text-white transition-colors hover:opacity-90"
                : "inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-orange-500 px-4 text-body-sm font-semibold text-white transition-colors hover:bg-orange-600"
            }
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
