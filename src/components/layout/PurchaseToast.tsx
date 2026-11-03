"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import type { RecentPurchaseViewModel } from "@/lib/api/modules/recent-purchases/types";
import {
  PURCHASE_DISMISS_KEY,
  formatTimeAgo,
  rememberNow,
  wasStoredWithinDay,
} from "@/lib/site-prompts";

interface PurchaseToastProps {
  purchases: RecentPurchaseViewModel[];
  /** How long each toast stays open. */
  durationMs: number;
  /** Pause between one toast closing and the next opening. */
  gapMs: number;
}

/**
 * Shows recent purchases one at a time, bottom-left. Cycles through the list
 * (a single purchase is shown once). Dismissing hides it for a day.
 */
export function PurchaseToast({ purchases, durationMs, gapMs }: PurchaseToastProps) {
  const [index, setIndex] = useState(0);
  /** Bumps on every show so the progress bar animation restarts. */
  const [showCount, setShowCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed || purchases.length === 0) return;
    if (wasStoredWithinDay(PURCHASE_DISMISS_KEY)) return;

    const loop = purchases.length > 1;
    let next = 0;
    let timer = 0;

    const show = () => {
      setIndex(next);
      setShowCount((n) => n + 1);
      setVisible(true);
      timer = window.setTimeout(hide, durationMs);
    };
    const hide = () => {
      setVisible(false);
      next = (next + 1) % purchases.length;
      if (!loop) return;
      timer = window.setTimeout(show, gapMs);
    };

    show();
    return () => window.clearTimeout(timer);
  }, [purchases, durationMs, gapMs, dismissed]);

  const purchase = purchases[index];
  if (dismissed || !visible || !purchase) return null;

  return (
    <div
      key={showCount}
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-[60] w-[min(100%-2rem,340px)] overflow-hidden rounded-xl border border-white/10 bg-[#121212] text-white shadow-2xl"
    >
      <div className="flex items-start gap-3 p-3 pr-2">
        <p className="flex-1 text-sm leading-snug">
          <span className="font-semibold">{purchase.studentName}</span> has just
          bought{" "}
          {purchase.itemHref ? (
            <Link
              href={purchase.itemHref}
              className="font-medium text-orange-400 underline-offset-2 hover:underline"
            >
              {purchase.itemName}
            </Link>
          ) : (
            purchase.itemName
          )}{" "}
          {formatTimeAgo(purchase.purchasedAt)} ago
        </p>
        <button
          type="button"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Dismiss"
          onClick={() => {
            rememberNow(PURCHASE_DISMISS_KEY);
            setDismissed(true);
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
