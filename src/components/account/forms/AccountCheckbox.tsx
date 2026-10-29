"use client";

import { cn } from "@/lib/utils";
import { AccountRequiredMark } from "./AccountFieldShell";

type AccountCheckboxProps = {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
};

export function AccountCheckbox({
  id,
  label,
  checked,
  onChange,
  required,
  error,
  disabled,
  className,
}: AccountCheckboxProps) {
  return (
    <div className={cn("w-full min-w-0", className)}>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-2.5 text-body-sm text-[var(--account-text)]"
      >
        <span className="relative mt-0.5 inline-flex h-4 w-4 shrink-0">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
            aria-invalid={Boolean(error)}
          />
          <span
            className={cn(
              "pointer-events-none flex h-4 w-4 items-center justify-center rounded border border-[var(--account-input-border)] bg-[var(--account-input-bg)]",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--account-accent)]/30",
              "peer-checked:border-[var(--account-accent)] peer-checked:bg-[var(--account-accent)]",
              disabled && "opacity-60"
            )}
            aria-hidden
          >
            {checked ? (
              <svg
                viewBox="0 0 12 12"
                className="h-2.5 w-2.5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 6l3 3 5-5" />
              </svg>
            ) : null}
          </span>
        </span>
        <span>
          {label}
          {required ? (
            <>
              {" "}
              <AccountRequiredMark />
            </>
          ) : null}
        </span>
      </label>
      {error ? (
        <p className="mt-1.5 text-caption text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
