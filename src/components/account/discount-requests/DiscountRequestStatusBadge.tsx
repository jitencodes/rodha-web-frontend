import { DISCOUNT_STATUS_LABEL } from "@/lib/api/modules/student/discount-requests/mapper";
import type { DiscountRequestStatus } from "@/lib/api/modules/student/discount-requests/types";
import { cn } from "@/lib/utils";

/** Same status tokens as the orders badges (`--account-status-*`). */
const STATUS_CLASS: Record<DiscountRequestStatus, string> = {
  PENDING:
    "bg-[var(--account-status-pending-bg)] text-[var(--account-status-pending-text)]",
  APPROVED:
    "bg-[var(--account-status-active-bg)] text-[var(--account-status-active-text)]",
  USED:
    "bg-[var(--account-status-completed-bg)] text-[var(--account-status-completed-text)]",
  REJECTED:
    "bg-[var(--account-status-refunded-bg)] text-[var(--account-status-refunded-text)]",
  REVOKED:
    "bg-[var(--account-status-refunded-bg)] text-[var(--account-status-refunded-text)]",
  EXPIRED:
    "bg-[var(--account-status-expired-bg)] text-[var(--account-status-expired-text)]",
};

export function DiscountRequestStatusBadge({
  status,
  className,
}: {
  status: DiscountRequestStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        STATUS_CLASS[status] ?? STATUS_CLASS.EXPIRED,
        className
      )}
    >
      {DISCOUNT_STATUS_LABEL[status] ?? status}
    </span>
  );
}
