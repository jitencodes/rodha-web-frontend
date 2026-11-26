"use client";

import {
  accountInputClassName,
  accountLabelClassName,
} from "@/components/account/forms/accountFieldStyles";
import { cn } from "@/lib/utils";

export const OTP_LENGTH = 6;

type OtpFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
};

/** One-time code input (account theme). */
export function OtpField({
  id,
  value,
  onChange,
  disabled = false,
  invalid = false,
}: OtpFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={accountLabelClassName}>
        Verification code
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))
        }
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        placeholder="000000"
        disabled={disabled}
        aria-invalid={invalid}
        className={cn(
          accountInputClassName,
          "text-center font-mono !text-[20px] tracking-[0.5em]"
        )}
      />
    </div>
  );
}

type OtpResendProps = {
  onResend: () => void;
  resending: boolean;
  secondsLeft: number;
  disabled?: boolean;
};

/** "Didn't get it? Resend" line with the cooldown. */
export function OtpResend({
  onResend,
  resending,
  secondsLeft,
  disabled = false,
}: OtpResendProps) {
  return (
    <p className="text-center text-[12px] text-[var(--account-text-muted)]">
      Didn&apos;t get it?{" "}
      <button
        type="button"
        onClick={onResend}
        disabled={resending || secondsLeft > 0 || disabled}
        className="cursor-pointer font-semibold text-[var(--account-accent)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {resending
          ? "Sending…"
          : secondsLeft > 0
            ? `Resend in ${secondsLeft}s`
            : "Resend code"}
      </button>
    </p>
  );
}
