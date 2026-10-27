"use client";

import { CalendarDays } from "lucide-react";
import { AccountFieldShell } from "./AccountFieldShell";
import { accountInputClassName } from "./accountFieldStyles";
import { cn } from "@/lib/utils";

type AccountDateFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
};

export function AccountDateField({
  id,
  label,
  value,
  onChange,
  required,
  error,
  helperText,
  disabled,
  min,
  max,
}: AccountDateFieldProps) {
  return (
    <AccountFieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
    >
      <div className="relative">
        <CalendarDays
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--account-text-muted)]"
          aria-hidden
        />
        <input
          id={id}
          type="date"
          value={value}
          min={min}
          max={max}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={cn(accountInputClassName, "pl-10")}
          aria-invalid={Boolean(error)}
        />
      </div>
    </AccountFieldShell>
  );
}
