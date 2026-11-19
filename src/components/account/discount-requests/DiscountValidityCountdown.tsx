"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { discountValidTillEnd } from "@/lib/api/modules/student/discount-requests/mapper";
import { cn } from "@/lib/utils";

/** "Expires in 3d 4h 12m" until the end of `validTill` (inclusive IST date). */
export function DiscountValidityCountdown({
  validTill,
  className,
}: {
  validTill: string;
  className?: string;
}) {
  const { days, hours, minutes, seconds, isExpired, ready } = useCountdown(
    discountValidTillEnd(validTill)
  );
  if (!ready || isExpired) return null;

  const parts =
    days > 0
      ? `${days}d ${hours}h ${minutes}m`
      : `${hours}h ${minutes}m ${String(seconds).padStart(2, "0")}s`;

  return (
    <span className={cn("tabular-nums", className)} aria-live="off">
      Expires in {parts}
    </span>
  );
}
