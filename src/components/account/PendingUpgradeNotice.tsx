"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { formatCartMoney } from "@/lib/account/cart-totals";
import type { PendingUpgradeViewModel } from "@/lib/api/modules/student/package-upgrades/types";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { openRazorpay } from "@/lib/checkout/razorpay";
import type {
  CheckoutPayResponse,
  CheckoutVerifyResponse,
} from "@/lib/checkout/types";
import { storePendingPurchase } from "@/lib/tracking/purchase";
import { cn } from "@/lib/utils";

type PendingUpgradeNoticeProps = {
  pending: PendingUpgradeViewModel;
  /** Source package, used when the API omits the target title. */
  sourceTitle: string;
  websiteCategoryId?: number | null;
  /** Card footer on Manage Packages; full panel on the upgrade page. */
  compact?: boolean;
  className?: string;
};

type Busy = "resume" | "cancel" | null;

/**
 * An upgrade checkout whose Razorpay window was closed before paying. The API
 * hides the upgrade options until it is paid (resume) or cancelled.
 */
export function PendingUpgradeNotice({
  pending,
  sourceTitle,
  websiteCategoryId,
  compact,
  className,
}: PendingUpgradeNoticeProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState<string | null>(null);
  /** Resume impossible (409): only Cancel is offered. */
  const [sessionMissing, setSessionMissing] = useState(false);
  /** Razorpay took the money but verify failed: no second payment. */
  const [unconfirmed, setUnconfirmed] = useState(false);
  const startedRef = useRef(false);

  const targetLabel = pending.targetTitle || "your upgrade";
  const canResume = pending.canResume && !sessionMissing && !unconfirmed;
  const category =
    websiteCategoryId != null ? { websiteCategoryId } : {};

  function release() {
    startedRef.current = false;
    setBusy(null);
  }

  async function resume() {
    if (startedRef.current || !canResume) return;
    startedRef.current = true;
    setBusy("resume");
    setError(null);
    try {
      const res = await fetchAuthed("/api/account/packages/upgrades/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: pending.orderId }),
      });
      const data = (await res.json().catch(() => null)) as
        | (CheckoutPayResponse & { targetPackageTitle?: string })
        | null;
      if (!res.ok || !data?.ok) {
        if (res.status === 409) setSessionMissing(true);
        // 404: already paid or cancelled elsewhere — reload the real state.
        if (res.status === 404) router.refresh();
        setError(data?.error || "Unable to resume this payment right now.");
        release();
        return;
      }

      const payment = await openRazorpay({
        ...data,
        description: `Upgrade to ${data.targetPackageTitle || targetLabel}`,
      });
      if (!payment) {
        setError("Payment not completed. You can resume or cancel it anytime.");
        release();
        return;
      }

      let verified: CheckoutVerifyResponse | null = null;
      try {
        const verifyRes = await fetchAuthed(
          "/api/account/packages/upgrades/verify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payment, ...category }),
          }
        );
        verified = (await verifyRes.json().catch(() => null)) as CheckoutVerifyResponse | null;
      } catch {
        verified = null;
      }
      if (!verified?.ok) {
        setUnconfirmed(true);
        setError(
          "We could not confirm your payment yet. If money was debited, check My Orders before paying again."
        );
        release();
        return;
      }

      storePendingPurchase({
        transaction_id:
          verified.orderNumber || data.orderNumber || String(pending.orderId),
        value: verified.payableAmount ?? data.payableAmount ?? pending.payableAmount,
        currency: data.currency || pending.currency,
      });
      router.push("/account/checkout/success");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Something went wrong. Check your connection and try again."
          : err instanceof Error
            ? err.message
            : "Unable to resume this payment right now."
      );
      release();
    }
  }

  async function cancel() {
    if (startedRef.current || !pending.canCancel) return;
    startedRef.current = true;
    setBusy("cancel");
    setError(null);
    try {
      const res = await fetchAuthed("/api/account/packages/upgrades/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: pending.orderId }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (!res.ok || !data?.ok) {
        if (res.status === 404) router.refresh();
        setError(data?.error || "Unable to cancel this upgrade right now.");
        release();
        return;
      }
      toast.success("Pending upgrade cancelled. Upgrade options are available again.");
      release();
      router.refresh();
    } catch {
      setError("Something went wrong. Check your connection and try again.");
      release();
    }
  }

  const primaryBtn =
    "inline-flex h-9 cursor-pointer items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] px-3.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60";
  const secondaryBtn =
    "inline-flex h-9 cursor-pointer items-center justify-center rounded-[var(--account-radius)] border border-[var(--account-border-strong)] px-3.5 text-[13px] font-semibold text-[var(--account-text-secondary)] hover:bg-[var(--account-nav-hover)] disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div
      role="status"
      className={cn(
        "rounded-[var(--account-radius)] border border-amber-500/40 bg-[var(--account-status-pending-bg)]",
        compact ? "p-3" : "p-4 sm:p-5",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {!compact ? (
          <span className="relative hidden aspect-video w-28 shrink-0 overflow-hidden rounded-[var(--account-radius)] bg-[var(--account-border)] sm:block">
            <Image
              src={pending.targetImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="112px"
            />
          </span>
        ) : (
          <AlertTriangle
            className="mt-0.5 size-4 shrink-0 text-[var(--account-status-pending-text)]"
            aria-hidden
          />
        )}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "font-semibold text-[var(--account-status-pending-text)]",
              compact ? "text-[13px]" : "text-[15px]"
            )}
          >
            Payment incomplete for {targetLabel}
          </p>
          <p className="mt-0.5 text-[12px] text-[var(--account-text-muted)]">
            {pending.targetTitle ? `Upgrade from ${sourceTitle}` : sourceTitle}
            {pending.payableAmount > 0
              ? ` · ${formatCartMoney(pending.payableAmount)}`
              : ""}
            {compact ? "" : ` · Order ${pending.orderNumber}`}
          </p>
          {!compact ? (
            <p className="mt-1.5 text-[13px] text-[var(--account-text-secondary)]">
              Complete the payment to finish this upgrade, or cancel it to see
              all upgrade options again.
            </p>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="mt-2 text-[12px] text-red-500" role="alert">
          <p>{error}</p>
          {unconfirmed ? (
            <Link
              href="/account/orders"
              className="mt-0.5 inline-block font-semibold text-[var(--account-accent)]"
            >
              Open My Orders →
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {pending.canResume ? (
          <button
            type="button"
            onClick={() => void resume()}
            disabled={busy != null || !canResume}
            className={primaryBtn}
          >
            {busy === "resume" ? "Opening payment…" : "Complete payment"}
          </button>
        ) : null}
        {pending.canCancel ? (
          <button
            type="button"
            onClick={() => void cancel()}
            disabled={busy != null || unconfirmed}
            className={secondaryBtn}
          >
            {busy === "cancel" ? "Cancelling…" : "Cancel upgrade"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
