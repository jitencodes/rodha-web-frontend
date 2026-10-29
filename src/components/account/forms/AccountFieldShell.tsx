import type { ReactNode } from "react";
import { accountLabelClassName } from "./accountFieldStyles";

export function AccountRequiredMark() {
  return <span className="text-red-500">*</span>;
}

export function AccountFieldShell({
  id,
  label,
  required,
  error,
  helperText,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full min-w-0">
      <label htmlFor={id} className={accountLabelClassName}>
        {label} {required ? <AccountRequiredMark /> : null}
      </label>
      {children}
      {helperText && !error ? (
        <p className="mt-1.5 text-caption text-[var(--account-text-muted)]">
          {helperText}
        </p>
      ) : null}
      {error ? (
        <p className="mt-1.5 text-caption text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
