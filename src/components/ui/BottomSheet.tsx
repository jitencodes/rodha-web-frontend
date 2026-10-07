"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Mobile-friendly panel that slides up from the bottom. Portaled to `document.body`
 * so ancestor transforms / stacking contexts cannot trap it under page content.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
      <button
        type="button"
        aria-label="Dismiss filters"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn(
          "relative z-10 flex max-h-[85dvh] w-full flex-col rounded-t-2xl border border-neutral-200 bg-white shadow-xl",
          "animate-[slide-up_220ms_var(--ease-premium)]",
          className
        )}
      >
        <div className="flex shrink-0 justify-center pt-3 pb-1" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-neutral-300" />
        </div>
        {title ? (
          <div className="flex items-center justify-between gap-3 border-b border-neutral-100 px-5 pb-3 pt-1">
            <h2
              id={titleId}
              className="text-h4 font-semibold text-neutral-900"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : null}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
