"use client";

import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { AccountFieldShell } from "./AccountFieldShell";

type Option = { value: string; label: string };

type AccountSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function AccountSelect({
  id,
  label,
  value,
  onChange,
  options,
  required,
  error,
  helperText,
  placeholder = "Select",
  disabled,
}: AccountSelectProps) {
  return (
    <AccountFieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
    >
      <DropdownSelect
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        triggerWidth="full"
        variant="account"
        aria-label={label}
        triggerClassName={disabled ? "pointer-events-none opacity-60" : undefined}
      />
      <span className="sr-only" id={id} />
    </AccountFieldShell>
  );
}
