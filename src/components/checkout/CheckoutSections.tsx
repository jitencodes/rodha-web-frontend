"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PackagePromocodeOffers } from "@/components/cards/PackagePromocodeOffers";
import type { CheckoutController } from "@/components/checkout/useCheckout";
import { formatCartMoney } from "@/lib/account/cart-totals";
import type { CheckoutProduct, CheckoutSession } from "@/lib/checkout/types";
import { cn } from "@/lib/utils";

/** Account-token card shared by every checkout block. */
export const checkoutCardClass =
  "rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] shadow-[var(--account-shadow)]";

export function CheckoutProductCard({
  product,
  price,
  originalPrice,
  owned = false,
  showDetailsLink = true,
}: {
  product: CheckoutProduct;
  price: number | null;
  originalPrice?: number | null;
  owned?: boolean;
  showDetailsLink?: boolean;
}) {
  return (
    <article className={cn(checkoutCardClass, "flex gap-4 p-4")}>
      <div className="relative aspect-video w-24 shrink-0 self-start overflow-hidden rounded-md bg-[var(--account-border)] sm:w-36">
        <Image
          src={product.thumbnail}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 96px, 144px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="font-montserrat text-[15px] font-semibold text-[var(--account-text)]">
          {product.title}
        </h2>
        {owned ? (
          <p className="mt-2 inline-flex rounded-full bg-[var(--account-status-active-bg)] px-2 py-0.5 text-[11px] font-semibold text-[var(--account-status-active-text)]">
            In your account
          </p>
        ) : price != null ? (
          <p className="mt-2 flex flex-wrap items-baseline gap-2 text-[14px] font-semibold text-[var(--account-text)]">
            {price > 0 ? formatCartMoney(price) : "FREE"}
            {originalPrice != null && originalPrice > price ? (
              <span className="text-[12px] font-normal text-[var(--account-text-muted)] line-through">
                {formatCartMoney(originalPrice)}
              </span>
            ) : null}
          </p>
        ) : null}
        {showDetailsLink ? (
          <Link
            href={product.detailsHref}
            className="mt-2 inline-block text-[13px] font-medium text-[var(--account-accent)]"
          >
            View details
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex justify-between gap-3",
        strong &&
          "border-t border-[var(--account-border)] pt-2 text-[15px] font-semibold"
      )}
    >
      <dt className={strong ? undefined : "text-[var(--account-text-muted)]"}>
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}

export function CheckoutPriceRows({ session }: { session: CheckoutSession }) {
  const { line, totals, packageOwned, selectedAddonIds } = session;
  const addonAmount = line?.addonAmount ?? 0;
  const hasAddons = selectedAddonIds.length > 0;

  return (
    <dl className="space-y-2 text-[13px] text-[var(--account-text)]">
      {!packageOwned && hasAddons ? (
        <SummaryRow
          label="Package"
          value={formatCartMoney(line?.salePrice ?? 0)}
        />
      ) : null}
      {hasAddons ? (
        <SummaryRow
          label={`Add-ons (${selectedAddonIds.length})`}
          value={formatCartMoney(addonAmount)}
        />
      ) : null}
      <SummaryRow label="Subtotal" value={formatCartMoney(totals.subtotalAmount)} />
      {!packageOwned ? (
        <SummaryRow
          label={
            line?.promocodeCode ? `Discount · ${line.promocodeCode}` : "Discount"
          }
          value={`-${formatCartMoney(totals.discountAmount)}`}
        />
      ) : null}
      <SummaryRow
        label="Total"
        value={formatCartMoney(totals.payableAmount)}
        strong
      />
    </dl>
  );
}

export function CheckoutCoupon({
  checkout,
}: {
  checkout: CheckoutController;
}) {
  const { session, couponPending, couponError, busy } = checkout;
  const [couponInput, setCouponInput] = useState("");
  const appliedCode = session.line?.promocodeCode ?? null;

  async function applyTyped() {
    const code = couponInput.trim();
    if (!code) return;
    if (await checkout.applyCode(code)) setCouponInput("");
  }

  return (
    <div className={cn(checkoutCardClass, "p-4")}>
      <p className="text-[14px] font-semibold text-[var(--account-text)]">
        {appliedCode ? `Coupon applied · ${appliedCode}` : "Have a coupon?"}
      </p>
      <div className="mt-3 space-y-2">
        {appliedCode ? (
          <div className="flex items-center justify-between gap-3 rounded-md bg-[var(--account-nav-active-bg)] px-3 py-2.5 text-[13px]">
            <span className="min-w-0 truncate font-medium text-[var(--account-accent)]">
              {appliedCode}
            </span>
            <button
              type="button"
              onClick={() => void checkout.removeCoupon()}
              disabled={busy}
              className="shrink-0 cursor-pointer font-semibold text-[var(--account-text-muted)] hover:text-[var(--account-text)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Remove Coupon
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => {
                setCouponInput(e.target.value);
                if (couponError) checkout.clearCouponError();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void applyTyped();
                }
              }}
              placeholder="Enter coupon code"
              aria-label="Coupon code"
              autoCapitalize="characters"
              maxLength={100}
              className="min-w-0 flex-1 rounded-[var(--account-radius)] border border-[var(--account-input-border)] bg-[var(--account-input-bg)] px-3 py-2 text-[13px] uppercase text-[var(--account-text)] placeholder:normal-case"
            />
            <button
              type="button"
              onClick={() => void applyTyped()}
              disabled={busy || !couponInput.trim()}
              className="cursor-pointer rounded-[var(--account-radius)] bg-[var(--account-accent)] px-3 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {couponPending ? "Applying…" : "Apply"}
            </button>
          </div>
        )}
      </div>
      {couponError ? (
        <p className="mt-3 text-[12px] text-red-500" role="alert">
          {couponError}
        </p>
      ) : null}

      {session.promocodeOptions.length > 0 ? (
        <PackagePromocodeOffers
          className="mt-4"
          variant="account"
          offers={session.promocodeOptions}
          appliedCode={appliedCode}
          onApply={async (offer) => {
            if (await checkout.applyOffer(offer)) setCouponInput("");
          }}
          applyPending={busy}
        />
      ) : null}
    </div>
  );
}
