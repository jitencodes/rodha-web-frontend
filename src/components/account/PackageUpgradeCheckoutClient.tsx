"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import {
  ArrowRight,
  ArrowRightLeft,
  BadgePercent,
  CircleDollarSign,
  PackagePlus,
  Receipt,
  Tag,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { AddonPicker } from "@/components/checkout/AddonPicker";
import { usePayGate } from "@/components/checkout/usePayGate";
import { formatCartMoney } from "@/lib/account/cart-totals";
import type { AddonViewModel } from "@/lib/api/modules/addons/types";
import type { UpgradeQuoteViewModel } from "@/lib/api/modules/student/package-upgrades/types";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { openRazorpay } from "@/lib/checkout/razorpay";
import type {
  CheckoutPayResponse,
  CheckoutVerifyResponse,
} from "@/lib/checkout/types";
import { userAtom } from "@/lib/store/user";
import { storePendingPurchase } from "@/lib/tracking/purchase";
import { readStoredUtm } from "@/lib/tracking/utm";
import { cn } from "@/lib/utils";
import Image from "next/image";

type PackageUpgradeCheckoutClientProps = {
  quote: UpgradeQuoteViewModel;
};

function SummaryRow({
  icon,
  label,
  value,
  emphasize,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--account-accent-soft)] text-[var(--account-accent)]"
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium uppercase tracking-wide text-[var(--account-text-muted)]">
          {label}
        </p>
        <p
          className={cn(
            "mt-0.5 text-[15px] font-semibold text-[var(--account-text)]",
            emphasize && "text-[var(--account-accent)]"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export function PackageUpgradeCheckoutClient({
  quote,
}: PackageUpgradeCheckoutClientProps) {
  const router = useRouter();
  const authUser = useAtomValue(userAtom);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  /** Razorpay took the payment but verification failed: block a second payment. */
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const payStartedRef = useRef(false);

  // After a refresh an add-on may be owned or withdrawn: only sellable ones count.
  const selectedAddons = quote.addons.filter(
    (addon) => addon.selectable && selectedIds.includes(addon.id)
  );
  const addonAmount = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
  // The quote excludes add-ons.
  const upgradeAmount = quote.isFree ? 0 : Math.max(0, quote.payableAmount);
  const payableNow = upgradeAmount + addonAmount;

  function toggleAddon(addon: AddonViewModel) {
    setError(null);
    setSelectedIds((prev) =>
      prev.includes(addon.id)
        ? prev.filter((id) => id !== addon.id)
        : [...prev, addon.id]
    );
  }

  function releasePay() {
    payStartedRef.current = false;
    setPending(false);
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
      value: verified?.payableAmount ?? checkout.payableAmount ?? payableNow,
      currency: checkout.currency || "INR",
    });
    router.push("/account/checkout/success");
    router.refresh();
  }

  async function submitPayment(stateName: string | null) {
    if (payStartedRef.current || unconfirmed) return;
    payStartedRef.current = true;
    setPending(true);
    setError(null);
    const category =
      quote.websiteCategoryId != null
        ? { websiteCategoryId: quote.websiteCategoryId }
        : {};
    try {
      const res = await fetchAuthed("/api/account/packages/upgrades/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceEnrollmentId: quote.sourceEnrollmentId,
          targetPackageId: quote.targetPackageId,
          addonIds: selectedAddons.map((addon) => addon.id),
          ...readStoredUtm(),
          ...(stateName ? { stateName } : {}),
          ...category,
        }),
      });
      const data = (await res.json().catch(() => null)) as CheckoutPayResponse | null;
      if (!res.ok || !data?.ok) {
        setError(data?.error || "Upgrade checkout failed");
        releasePay();
        // 400 / 409: the target, an add-on or the enrollment changed meanwhile.
        if (res.status === 400 || res.status === 409) router.refresh();
        return;
      }

      // Top-level payable includes add-ons, so a free upgrade can still be paid.
      if (data.mode === "free" || (data.payableAmount ?? payableNow) <= 0) {
        finishPurchase(data);
        return;
      }

      const payment = await openRazorpay({
        ...data,
        description: `Upgrade to ${quote.targetTitle}`,
      });
      if (!payment) {
        // The order is now a pending upgrade: show Complete payment / Cancel.
        releasePay();
        toast.info("Payment not completed. You can resume or cancel this upgrade.");
        router.replace(
          `/account/packages/upgrade?enrollmentId=${quote.sourceEnrollmentId}`
        );
        router.refresh();
        return;
      }

      let verified: CheckoutVerifyResponse | null = null;
      try {
        const verifyRes = await fetchAuthed("/api/account/packages/upgrades/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payment, ...category }),
        });
        verified = (await verifyRes.json().catch(() => null)) as CheckoutVerifyResponse | null;
      } catch {
        verified = null;
      }
      if (!verified?.ok) {
        setUnconfirmed(true);
        setError(
          "We could not confirm your payment yet. If money was debited, check My Orders before paying again."
        );
        releasePay();
        return;
      }
      finishPurchase(data, verified);
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Something went wrong. Check your connection and try again."
          : err instanceof Error
            ? err.message
            : "Upgrade checkout failed"
      );
      releasePay();
    }
  }

  const { startPay, dialogs } = usePayGate({
    user: authUser,
    submit: submitPayment,
    setPending,
    setError,
  });

  const payLabel = payableNow <= 0 ? "Complete upgrade" : "Continue to Pay";

  return (
    <>
      <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-5 shadow-[var(--account-shadow)] sm:p-6">
        
        <div className="flex items-center gap-2 text-[13px] text-[var(--account-text-muted)]">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative aspect-video w-24 max-w-full shrink-0 overflow-hidden rounded-[var(--account-radius)] bg-[var(--account-border)]">
              <Image
                src={quote.sourceImageUrl}
                alt={quote.sourceTitle}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <span className="font-semibold text-[var(--account-accent)]">
              {quote.sourceTitle}
            </span>
          </div>
          <ArrowRight className="size-4 flex-shrink-0 text-[var(--account-accent)]" />
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative aspect-video w-24 max-w-full shrink-0 overflow-hidden rounded-[var(--account-radius)] bg-[var(--account-border)]">
              <Image
                src={quote.targetImageUrl}
                alt={quote.targetTitle}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          <span className="font-semibold text-[var(--account-accent)]">
            {quote.targetTitle}
          </span>
          </div>
        </div>

        <AddonPicker
          className="mt-4 shadow-none"
          addons={quote.addons}
          selectedIds={selectedAddons.map((addon) => addon.id)}
          onToggle={toggleAddon}
          disabled={pending || unconfirmed}
          description="Add extras to your upgraded package. Offers and credit apply to the package only."
        />

        <div className="mt-4 divide-y divide-[var(--account-border)]">
          <SummaryRow
            icon={<Tag className="size-4" strokeWidth={1.75} />}
            label="List price"
            value={formatCartMoney(quote.listPrice)}
          />
          <SummaryRow
            icon={<CircleDollarSign className="size-4" strokeWidth={1.75} />}
            label="Sale price"
            value={formatCartMoney(quote.salePrice)}
          />
          {quote.promoDiscount > 0 || quote.promoCode ? (
            <SummaryRow
              icon={<BadgePercent className="size-4" strokeWidth={1.75} />}
              label={
                quote.promoCode
                  ? `Promo · ${quote.promoCode}`
                  : "Promo discount"
              }
              value={`−${formatCartMoney(quote.promoDiscount)}`}
            />
          ) : null}
          {quote.oldPaidCredit > 0 ? (
            <SummaryRow
              icon={<Wallet className="size-4" strokeWidth={1.75} />}
              label={
                quote.creditSource
                  ? `Credit from previous purchase (${quote.creditSource})`
                  : "Credit from previous purchase"
              }
              value={`−${formatCartMoney(quote.oldPaidCredit)}`}
            />
          ) : null}
          {selectedAddons.length > 0 ? (
            <>
              <SummaryRow
                icon={<ArrowRightLeft className="size-4" strokeWidth={1.75} />}
                label="Upgrade amount"
                value={upgradeAmount > 0 ? formatCartMoney(upgradeAmount) : "FREE"}
              />
              <SummaryRow
                icon={<PackagePlus className="size-4" strokeWidth={1.75} />}
                label={`Add-ons (${selectedAddons.length})`}
                value={formatCartMoney(addonAmount)}
              />
            </>
          ) : null}
          <SummaryRow
            icon={<Receipt className="size-4" strokeWidth={1.75} />}
            label="Payable now"
            value={payableNow > 0 ? formatCartMoney(payableNow) : "FREE"}
            emphasize
          />
        </div>

        {error ? (
          <div className="mt-4 text-[13px] text-red-500" role="alert">
            <p>{error}</p>
            {unconfirmed ? (
              <Link
                href="/account/orders"
                className="mt-1 inline-block font-semibold text-[var(--account-accent)]"
              >
                Open My Orders →
              </Link>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={startPay}
            disabled={pending || unconfirmed}
            className="block h-11 w-full cursor-pointer sm:flex-1 items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Processing…" : payLabel}
          </button>
          <Link
            href={`/account/packages/upgrade?enrollmentId=${quote.sourceEnrollmentId}`}
            className="inline-flex h-11 items-center justify-center rounded-[var(--account-radius)] border border-[var(--account-border-strong)] px-4 text-[13px] font-semibold text-[var(--account-text-secondary)] hover:bg-[var(--account-nav-hover)]"
          >
            Change plan
          </Link>
        </div>
      </div>

      {dialogs}
    </>
  );
}
