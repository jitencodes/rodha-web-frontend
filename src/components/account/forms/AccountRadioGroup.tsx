"use client";

import { cn } from "@/lib/utils";
import { AccountFieldShell } from "./AccountFieldShell";

export type AccountRadioOption = { value: string; label: string };

type AccountRadioGroupProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: AccountRadioOption[];
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
};

export function AccountRadioGroup({
  id,
  label,
  value,
  onChange,
  options,
  required,
  error,
  disabled,
  className,
}: AccountRadioGroupProps) {
  return (
    <AccountFieldShell id={id} label={label} required={required} error={error}>
      <div
        role="radiogroup"
        aria-labelledby={id}
        className={cn("flex flex-wrap gap-3", className)}
      >
        {options.map((option) => {
          const optionId = `${id}-${option.value}`;
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                "inline-flex cursor-pointer items-center gap-2 rounded-[var(--account-radius)] border px-3 py-2 text-body-sm transition-colors",
                selected
                  ? "border-[var(--account-accent)] bg-[var(--account-accent)]/10 text-[var(--account-text)]"
                  : "border-[var(--account-input-border)] bg-[var(--account-input-bg)] text-[var(--account-text-secondary)]",
                disabled && "cursor-not-allowed opacity-60"
              )}
            >
              <span className="relative inline-flex h-4 w-4 shrink-0">
                <input
                  id={optionId}
                  type="radio"
                  name={id}
                  value={option.value}
                  checked={selected}
                  disabled={disabled}
                  onChange={() => onChange(option.value)}
                  className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
                />
                <span
                  className={cn(
                    "pointer-events-none flex h-4 w-4 items-center justify-center rounded-full border border-[var(--account-input-border)]",
                    "peer-checked:border-[var(--account-accent)]"
                  )}
                  aria-hidden
                >
                  {selected ? (
                    <span className="h-2 w-2 rounded-full bg-[var(--account-accent)]" />
                  ) : null}
                </span>
              </span>
              {option.label}
            </label>
          );
        })}
      </div>
    </AccountFieldShell>
  );
}
