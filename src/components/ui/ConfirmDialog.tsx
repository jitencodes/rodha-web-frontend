"use client";

import { useEffect, useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
  /** Use destructive styling for logout-style actions */
  variant?: "default" | "danger";
  /** Hide cancel button (e.g. mandatory state selection). */
  hideCancel?: boolean;
  /** Prevent backdrop / Escape dismiss. */
  disableDismiss?: boolean;
};

/** Lightweight confirm modal matching account / site token styling. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirming = false,
  onConfirm,
  onCancel,
  children,
  variant = "default",
  hideCancel = false,
  disableDismiss = false,
}: ConfirmDialogProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !disableDismiss) onCancel();
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onCancel, disableDismiss]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Dismiss"
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          if (!disableDismiss) onCancel();
        }}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-[var(--account-radius,8px)] border border-[var(--account-border,#e5e5e5)] bg-[var(--account-surface,#fff)] p-5 shadow-xl"
      >
        <h2
          id={titleId}
          className="font-montserrat text-lg font-bold text-[var(--account-text,#171717)]"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-body-sm text-[var(--account-text-muted,#737373)]">
            {description}
          </p>
        ) : null}
        {children}
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          {!hideCancel ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={confirming}
              className="inline-flex items-center justify-center rounded-[var(--account-radius,8px)] border border-[var(--account-border-strong,#d4d4d4)] px-4 py-2 text-[13px] font-semibold text-[var(--account-text-secondary,#525252)] hover:bg-[var(--account-nav-hover,#f5f5f5)] disabled:opacity-60"
            >
              {cancelLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming}
            className={cn(
              "inline-flex items-center justify-center rounded-[var(--account-radius,8px)] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60",
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[var(--account-accent,#f97316)] hover:opacity-90"
            )}
          >
            {confirming ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
