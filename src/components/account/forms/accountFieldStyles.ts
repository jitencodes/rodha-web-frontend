import { cn } from "@/lib/utils";

export const accountInputClassName = cn(
  "w-full rounded-[var(--account-radius)] border border-[var(--account-input-border)] bg-[var(--account-input-bg)] px-3.5 py-2.5 text-body text-[var(--account-text)]",
  "placeholder:text-[var(--account-text-muted)]",
  "focus:border-[var(--account-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--account-accent)]/20",
  "disabled:cursor-not-allowed disabled:opacity-60"
);

/**
 * Form-only override for DropdownSelect `variant="account"` triggers.
 * Matches `accountInputClassName` height/type; do not use on filter toolbars.
 */
export const accountFormSelectTriggerClassName = cn(
  "!h-auto rounded-[var(--account-radius)] px-3.5 py-2.5 text-body font-normal",
  "hover:border-[var(--account-accent)]/60"
);

export const accountLabelClassName =
  "mb-1.5 block text-body-sm font-medium text-[var(--account-text-secondary)]";
