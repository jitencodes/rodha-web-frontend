"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { OFFER_END_DATE } from "@/lib/constants";

interface PromotionalBannerProps {
  className?: string;
}

export function PromotionalBanner({ className }: PromotionalBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const { days, hours, minutes, seconds, isExpired } = useCountdown(OFFER_END_DATE);

  if (dismissed || isExpired) return null;

  const units = [
    { value: days, label: "d" },
    { value: hours, label: "h" },
    { value: minutes, label: "m" },
    { value: seconds, label: "s" },
  ];

  return (
    <div
      className={cn(
        "relative z-50 text-text-primary py-2.5 min-h-[40px]",
        "bg-[#170901]",
        className
      )}
    >
      <div className="container-rodha flex items-center justify-center gap-3 sm:gap-5 relative min-h-[24px] lg: justify-end">
      <p className="text-caption sm:text-body-sm text-center text-text-secondary flex-1 min-w-0 leading-snug lg:absolute lg:left-1/2 lg:-translate-x-1/2">
  <span aria-hidden="true">🔥 </span>
  <span>110 days to CAT 2026. Rodha&apos;s Accelerator batch is now open </span>
  <Link
    href="/cat"
    className="font-semibold text-orange-500 hover:text-orange-400 underline underline-offset-2 sm:no-underline transition-colors"
  >
    Enroll Now
  </Link>
</p>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {units.map((unit, i) => (
            <div key={unit.label} className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center min-w-[34px] h-6 px-1.5 rounded-[4px] bg-[#1B130D] text-[11px] font-bold tabular-nums text-text-primary">
                {String(unit.value).padStart(2, "0")}
                <span className="text-text-dimmed font-medium ml-0.5 text-[10px]">
                  {unit.label}
                </span>
              </span>
              {i < units.length - 1 && (
                <span className="text-white text-[10px] font-bold">:</span>
              )}
            </div>
          ))}
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-0 sm:static flex items-center justify-center w-6 h-6 text-text-dimmed hover:text-text-primary transition-colors shrink-0"
          aria-label="Dismiss banner"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        </div>

      </div>
    </div>
  );
}
