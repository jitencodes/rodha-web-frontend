"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type { RecentPurchaseViewModel } from "@/lib/api/modules/recent-purchases/types";
import {
  PURCHASE_DISMISS_KEY,
  formatTimeAgo,
  rememberNow,
  wasStoredWithinDay,
} from "@/lib/site-prompts";

interface PurchaseToastProps {
  purchase: RecentPurchaseViewModel | null;
  durationMs: number;
}

export function PurchaseToast({ purchase, durationMs }: PurchaseToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!purchase || wasStoredWithinDay(PURCHASE_DISMISS_KEY)) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), durationMs);
    return () => window.clearTimeout(timer);
  }, [purchase, durationMs]);

  if (!visible || !purchase) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[60] w-[min(100%-2rem,340px)] overflow-hidden rounded-xl border border-white/10 bg-[#121212] text-white shadow-2xl">
      <div className="flex items-start gap-3 p-3 pr-2">
        <p className="flex-1 text-sm leading-snug">
          <span className="font-semibold">{purchase.studentName}</span> has just
          bought {purchase.itemName} {formatTimeAgo(purchase.purchasedAt)} ago
        </p>
        <button
          type="button"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Dismiss"
          onClick={() => {
            rememberNow(PURCHASE_DISMISS_KEY);
            setVisible(false);
          }}
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="h-1 bg-white/10">
        <div
          className="h-full bg-orange-500"
          style={{
            width: "100%",
            animation: `rodha-toast-shrink ${durationMs}ms linear forwards`,
          }}
        />
      </div>
      <style>{`@keyframes rodha-toast-shrink { from { width: 100%; } to { width: 0%; } }`}</style>
    </div>
  );
}
