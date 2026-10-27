"use client";

import { AccountFieldShell } from "./AccountFieldShell";
import { accountInputClassName } from "./accountFieldStyles";
import { cn } from "@/lib/utils";

type AccountTextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  helperText?: string;
  type?: "text" | "email" | "tel" | "url" | "number";
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
};

export function AccountTextField({
  id,
  label,
  value,
  onChange,
  required,
  error,
  helperText,
  type = "text",
  placeholder,
  disabled,
  readOnly,
  maxLength,
  inputMode,
  onKeyDown,
  className,
}: AccountTextFieldProps) {
  return (
    <AccountFieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
    >
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength}
        inputMode={inputMode}
        className={cn(
          accountInputClassName,
          readOnly && "bg-[var(--account-bg)]",
          className
        )}
        aria-invalid={Boolean(error)}
      />
    </AccountFieldShell>
  );
}
