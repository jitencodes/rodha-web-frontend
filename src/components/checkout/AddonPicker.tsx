"use client";

import {
  BookOpen,
  Check,
  GraduationCap,
  Loader2,
  MessageCircleQuestion,
  Package,
  PackagePlus,
  Plus,
  X,
} from "lucide-react";
import { formatCartMoney } from "@/lib/account/cart-totals";
import type {
  AddonType,
  AddonViewModel,
} from "@/lib/api/modules/addons/types";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<AddonType, typeof BookOpen> = {
  GRAPHY_COURSE: GraduationCap,
  BUDDY_PACKAGE: MessageCircleQuestion,
  BOOK: BookOpen,
  WEBSITE_PACKAGE: Package,
};

type AddonPickerProps = {
  addons: AddonViewModel[];
  selectedIds: number[];
  onToggle: (addon: AddonViewModel) => void;
  /** Add-on being saved. */
  pendingId?: number | null;
  disabled?: boolean;
  error?: string | null;
  title?: string;
  description?: string;
  className?: string;
};

/** Selectable add-on rows for checkout and package upgrade. */
export function AddonPicker({
  addons,
  selectedIds,
  onToggle,
  pendingId = null,
  disabled = false,
  error,
  title = "Add-ons",
  description = "Get more from your package. Coupons apply to the package only.",
  className,
}: AddonPickerProps) {
  if (addons.length === 0) return null;
  const selected = new Set(selectedIds);

  return (
    <section
      aria-label={title}
      className={cn(
        "rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4 shadow-[var(--account-shadow)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[14px] font-semibold text-[var(--account-text)]">
            {title}
          </h3>
          <p className="mt-0.5 text-[12px] text-[var(--account-text-muted)]">
            {description}
          </p>
        </div>
        {selectedIds.length > 0 ? (
          <span className="shrink-0 rounded-full bg-[var(--account-nav-active-bg)] px-2 py-0.5 text-[11px] font-semibold text-[var(--account-accent)]">
            {selectedIds.length} added
          </span>
        ) : null}
      </div>

      <ul className="mt-3 space-y-2">
        {addons.map((addon) => {
          const Icon = addon.type ? TYPE_ICON[addon.type] : PackagePlus;
          const isSelected = selected.has(addon.id);
          const saving = pendingId === addon.id;
          // A selected add-on can always be removed, even if it became unavailable.
          const locked = !addon.selectable && !isSelected;
          const note =
            addon.owned
              ? "Already in your account"
              : !addon.selectable
                ? "No longer available"
                : "";

          return (
            <li key={addon.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                aria-busy={saving}
                disabled={locked || disabled || pendingId != null}
                onClick={() => onToggle(addon)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--account-accent)]/40",
                  isSelected
                    ? "border-[var(--account-accent)] bg-[var(--account-nav-active-bg)]"
                    : "border-[var(--account-border-strong)]",
                  locked
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer enabled:hover:border-[var(--account-accent)] disabled:cursor-wait"
                )}
              >
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--account-nav-active-bg)] text-[var(--account-accent)]"
                >
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-[var(--account-text)]">
                    {addon.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[var(--account-text-muted)]">
                    {[addon.typeLabel, addon.detail].filter(Boolean).join(" · ")}
                  </span>
                  {note ? (
                    <span
                      className={cn(
                        "mt-0.5 block text-[11px] font-medium",
                        addon.owned && !isSelected
                          ? "text-[var(--account-status-active-text)]"
                          : "text-red-500"
                      )}
                    >
                      {isSelected ? `${note}. Remove it to continue.` : note}
                    </span>
                  ) : null}
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-[13px] font-semibold text-[var(--account-text)]">
                    {addon.price > 0 ? formatCartMoney(addon.price) : "FREE"}
                  </span>
                  {locked ? null : (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        isSelected
                          ? "bg-[var(--account-accent)] text-white"
                          : "border border-[var(--account-accent)] text-[var(--account-accent)]"
                      )}
                    >
                      {saving ? (
                        <Loader2 className="size-3 animate-spin" aria-hidden />
                      ) : isSelected ? (
                        addon.selectable ? (
                          <Check className="size-3" aria-hidden />
                        ) : (
                          <X className="size-3" aria-hidden />
                        )
                      ) : (
                        <Plus className="size-3" aria-hidden />
                      )}
                      {isSelected ? (addon.selectable ? "Added" : "Remove") : "Add"}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {error ? (
        <p className="mt-3 text-[12px] text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
