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
  Receipt,
  Tag,
  Wallet,
} from "lucide-react";
import { CheckoutLocationDialog } from "@/components/account/CheckoutLocationDialog";
import { UpdateStateDialog } from "@/components/account/UpdateStateDialog";
import { formatCartMoney } from "@/lib/account/cart-totals";
import type { UpgradeQuoteViewModel } from "@/lib/api/modules/student/package-upgrades/types";
import { userHasMobile } from "@/lib/api/modules/auth/mapper";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { resolveCheckoutState } from "@/lib/geo/detect-current-state";
import { userAtom } from "@/lib/store/user";
import { storePendingPurchase } from "@/lib/tracking/purchase";
import { readStoredUtm } from "@/lib/tracking/utm";
import { cn } from "@/lib/utils";
import Image from "next/image";

type PackageUpgradeCheckoutClientProps = {
  quote: UpgradeQuoteViewModel;
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
  const payStartedRef = useRef(false);
  const [mobileDialogOpen, setMobileDialogOpen] = useState(false);
  const [resumePayAfterMobile, setResumePayAfterMobile] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] =
    useState(false);

  function releasePay() {
    payStartedRef.current = false;
    setPending(false);
  }

  async function submitPayment(stateName: string | null) {
    if (payStartedRef.current) return;
    payStartedRef.current = true;
    setPending(true);
    setError(null);
    try {
      const res = await fetchAuthed("/api/account/packages/upgrades/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceEnrollmentId: quote.sourceEnrollmentId,
          targetPackageId: quote.targetPackageId,
          ...readStoredUtm(),
          ...(stateName ? { stateName } : {}),
          ...(quote.websiteCategoryId != null
            ? { websiteCategoryId: quote.websiteCategoryId }
            : {}),
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        mode?: string;
        keyId?: string;
        razorpayOrderId?: string;
        amountPaise?: number;
        currency?: string;
        orderId?: number;
        orderNumber?: string;
        payableAmount?: number;
        prefill?: { name?: string; email?: string; contact?: string };
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Upgrade checkout failed");
      }

      const payable =
        typeof data.payableAmount === "number"
          ? data.payableAmount
          : quote.payableAmount;
      const isFree =
        data.mode === "free" || quote.isFree || payable <= 0;

      if (isFree) {
        storePendingPurchase({
          transaction_id:
            data.orderNumber ||
            (typeof data.orderId === "number" ? String(data.orderId) : ""),
          value: payable > 0 ? payable : 0,
          currency: data.currency || "INR",
        });
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
        description: `Upgrade to ${quote.targetTitle}`,
        order_id: data.razorpayOrderId,
        prefill: data.prefill,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetchAuthed(
            "/api/account/packages/upgrades/verify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                ...(quote.websiteCategoryId != null
                  ? { websiteCategoryId: quote.websiteCategoryId }
                  : {}),
              }),
            }
          );
          const verifyData = (await verifyRes.json()) as {
            ok: boolean;
            error?: string;
            orderId?: number;
            orderNumber?: string;
            payableAmount?: number;
          };
          if (!verifyRes.ok || !verifyData.ok) {
            setError(verifyData.error || "Payment verification failed");
            releasePay();
            return;
          }
          storePendingPurchase({
            transaction_id:
              verifyData.orderNumber ||
              data.orderNumber ||
              (typeof verifyData.orderId === "number"
                ? String(verifyData.orderId)
                : typeof data.orderId === "number"
                  ? String(data.orderId)
                  : ""),
            value:
              typeof verifyData.payableAmount === "number"
                ? verifyData.payableAmount
                : payable,
            currency: data.currency || "INR",
          });
          router.push("/account/checkout/success");
          router.refresh();
        },
        modal: {
          ondismiss: () => {
            setError("Payment cancelled");
            releasePay();
          },
        },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upgrade checkout failed");
      releasePay();
    }
  }

  async function handlePay(options?: {
    skipMobileCheck?: boolean;
    stateName?: string | null;
  }) {
    if (authUser && !options?.skipMobileCheck && !userHasMobile(authUser)) {
      setResumePayAfterMobile(true);
      setMobileDialogOpen(true);
      setError("Please add your mobile number before continuing to pay.");
      return;
    }

    if (options?.stateName !== undefined) {
      await submitPayment(options.stateName);
      return;
    }

    setPending(true);
    setError(null);
    const resolution = await resolveCheckoutState();
    if (resolution.status !== "resolved") {
      setPending(false);
      setLocationPermissionDenied(resolution.status === "permission_denied");
      setLocationDialogOpen(true);
      return;
    }
    await submitPayment(resolution.stateName);
  }

  async function retryCheckoutLocation() {
    const resolution = await resolveCheckoutState();
    setLocationPermissionDenied(resolution.status === "permission_denied");
    if (resolution.status === "resolved") {
      setLocationDialogOpen(false);
      await submitPayment(resolution.stateName);
    }
    return resolution;
  }

  const payLabel =
    quote.isFree || quote.payableAmount <= 0
      ? "Complete upgrade"
      : "Continue to Pay";

  return (
    <>
      <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-5 shadow-[var(--account-shadow)] sm:p-6">
        
        <div className="flex items-center gap-2 text-[13px] text-[var(--account-text-muted)]">
          <div className="flex items-center gap-2">
            <Image
              src={quote.sourceImageUrl}
              alt={quote.sourceTitle}
              width={100}
              height={100}
              className="rounded-[var(--account-radius)]"
            />
            <span className="font-semibold text-[var(--account-accent)]">
              {quote.sourceTitle}
            </span>
          </div>
          <ArrowRight className="size-4 flex-shrink-0 text-[var(--account-accent)]" />
          <div className="flex items-center gap-2">
            <Image
            src={quote.targetImageUrl}
            alt={quote.targetTitle}
            width={100}
            height={100}
            className="rounded-[var(--account-radius)]"
          />
          <span className="font-semibold text-[var(--account-accent)]">
            {quote.targetTitle}
          </span>
          </div>
        </div>

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
          <SummaryRow
            icon={<Receipt className="size-4" strokeWidth={1.75} />}
            label="Payable now"
            value={
              quote.isFree || quote.payableAmount <= 0
                ? "FREE"
                : formatCartMoney(quote.payableAmount)
            }
            emphasize
          />
        </div>

        {error ? (
          <p className="mt-4 text-[13px] text-red-500" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => void handlePay()}
            disabled={pending}
            className="block h-11 md:flex-1 cursor-pointer items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
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

      <UpdateStateDialog
        open={mobileDialogOpen}
        required={resumePayAfterMobile}
        fields={["mobile"]}
        initialMobile={authUser?.mobile}
        onClose={() => {
          setMobileDialogOpen(false);
          setResumePayAfterMobile(false);
        }}
        onUpdated={() => {
          setMobileDialogOpen(false);
          setError(null);
          if (resumePayAfterMobile) {
            setResumePayAfterMobile(false);
            void handlePay({ skipMobileCheck: true });
          }
        }}
      />

      <CheckoutLocationDialog
        open={locationDialogOpen}
        permissionDenied={locationPermissionDenied}
        onUseCurrentLocation={retryCheckoutLocation}
        onConfirm={(stateName) => {
          setLocationDialogOpen(false);
          void handlePay({ stateName });
        }}
        onSkip={() => {
          setLocationDialogOpen(false);
          void handlePay({ stateName: null });
        }}
      />
    </>
  );
}
