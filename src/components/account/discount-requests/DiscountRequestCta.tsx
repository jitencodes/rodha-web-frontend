"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgePercent, Clock3 } from "lucide-react";
import {
  DiscountRequestDialog,
  type DiscountStudentInfo,
} from "@/components/account/discount-requests/DiscountRequestDialog";
import { DiscountValidityCountdown } from "@/components/account/discount-requests/DiscountValidityCountdown";
import {
  DISCOUNT_STATUS_LABEL,
  discountPromocodeLabel,
  discountStatusMessage,
  formatDiscountDate,
} from "@/lib/api/modules/student/discount-requests/mapper";
import type {
  DiscountCurrentViewModel,
  DiscountRequestApi,
} from "@/lib/api/modules/student/discount-requests/types";
import { cn } from "@/lib/utils";

type DiscountRequestCtaProps = {
  packageId: number;
  packageTitle: string;
  websiteCategoryId: number | null;
  isLoggedIn: boolean;
  /** `GET /student/discount-requests/current` result; `null` = unavailable (hidden). */
  current: DiscountCurrentViewModel | null;
  student: DiscountStudentInfo | null;
  /** Where "Request Discount" sends a logged-out student. */
  loginHref: string;
  /** `website` = light course purchase card · `account` = account-themed checkout. */
  variant?: "website" | "account";
  className?: string;
};

/**
 * Request Discount button / status for one package (B2 button-state table).
 * Opens the discount form; refreshes the server data after a submit.
 */
export function DiscountRequestCta({
  packageId,
  packageTitle,
  websiteCategoryId,
  isLoggedIn,
  current: initialCurrent,
  student,
  loginHref,
  variant = "website",
  className,
}: DiscountRequestCtaProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(initialCurrent);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [syncedFrom, setSyncedFrom] = useState(initialCurrent);

  // Take fresh server data after router.refresh().
  if (syncedFrom !== initialCurrent) {
    setSyncedFrom(initialCurrent);
    setCurrent(initialCurrent);
  }

  const isWebsite = variant === "website";
  const buttonClass = isWebsite
    ? "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-orange-500 bg-white px-4 text-body-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50"
    : "inline-flex h-10 w-full items-center justify-center gap-2 rounded-[var(--account-radius)] border border-[var(--account-accent)] bg-transparent px-4 text-[13px] font-semibold text-[var(--account-accent)] transition-colors hover:bg-[var(--account-accent-soft)]";
  const mutedText = isWebsite
    ? "text-neutral-500"
    : "text-[var(--account-text-muted)]";

  if (!isLoggedIn) {
    return (
      <div className={className}>
        <button
          type="button"
          onClick={() => window.location.assign(loginHref)}
          className={buttonClass}
        >
          <BadgePercent className="size-4" aria-hidden />
          Request Discount
        </button>
      </div>
    );
  }

  if (!current || !student) return null;

  const request = current.request;

  function handleSubmitted(next: DiscountRequestApi | null) {
    if (next) {
      setCurrent({ canRequest: false, canResubmit: false, request: next });
    }
    router.refresh();
  }

  const dialog = dialogOpen ? (
    <DiscountRequestDialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      packageId={packageId}
      packageTitle={packageTitle}
      websiteCategoryId={websiteCategoryId}
      student={student}
      resubmitRequest={current.canResubmit ? request : null}
      onSubmitted={handleSubmitted}
    />
  ) : null;

  let body: React.ReactNode = null;

  if (current.canResubmit && request) {
    body = (
      <>
        <p className="text-caption text-red-600">
          Discount request rejected
          {request.rejectReason ? `: ${request.rejectReason}` : ""}
        </p>
        <button type="button" onClick={() => setDialogOpen(true)} className={buttonClass}>
          <BadgePercent className="size-4" aria-hidden />
          Resubmit
        </button>
      </>
    );
  } else if (current.canRequest) {
    const previous =
      request && (request.status === "EXPIRED" || request.status === "REVOKED")
        ? DISCOUNT_STATUS_LABEL[request.status].toLowerCase()
        : null;
    body = (
      <>
        <button type="button" onClick={() => setDialogOpen(true)} className={buttonClass}>
          <BadgePercent className="size-4" aria-hidden />
          Request Discount
        </button>
        {previous ? (
          <p className={cn("text-center text-caption", mutedText)}>
            Your previous request was {previous}.
          </p>
        ) : null}
      </>
    );
  } else if (request?.status === "PENDING") {
    body = (
      <p
        className={cn(
          "flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-body-sm font-medium",
          isWebsite
            ? "bg-orange-50 text-orange-700"
            : "bg-[var(--account-status-pending-bg)] text-[var(--account-status-pending-text)]"
        )}
      >
        <Clock3 className="size-4 shrink-0" aria-hidden />
        {discountStatusMessage(request)}
      </p>
    );
  } else if (request?.status === "APPROVED") {
    const label = discountPromocodeLabel(request);
    const till = formatDiscountDate(request.validTill);
    body = (
      <div
        className={cn(
          "rounded-md px-3 py-2.5 text-body-sm",
          isWebsite
            ? "bg-emerald-50 text-emerald-700"
            : "bg-[var(--account-status-active-bg)] text-[var(--account-status-active-text)]"
        )}
      >
        <p className="font-semibold">
          Your discount{label ? ` ${label}` : ""} is applied at checkout
          {till ? ` — valid till ${till}` : ""}
        </p>
        {request.validTill ? (
          <DiscountValidityCountdown
            validTill={request.validTill}
            className="mt-0.5 block text-caption opacity-80"
          />
        ) : null}
      </div>
    );
  } else if (request?.status === "USED") {
    body = (
      <p className={cn("text-center text-caption", mutedText)}>Discount used</p>
    );
  }

  if (!body) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {body}
      {dialog}
    </div>
  );
}
