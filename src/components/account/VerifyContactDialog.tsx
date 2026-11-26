"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSetAtom } from "jotai";
import { Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { AccountThemedPortal } from "@/components/account/AccountThemedPortal";
import {
  accountInputClassName,
  accountLabelClassName,
} from "@/components/account/forms/accountFieldStyles";
import { OTP_LENGTH, OtpField, OtpResend } from "@/components/forms/OtpField";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useResendCooldown } from "@/hooks/useResendCooldown";
import type { AuthUserViewModel } from "@/lib/api/modules/auth/types";
import type { VerificationChannel } from "@/lib/api/modules/student/gate/types";
import { fetchAuthed } from "@/lib/auth/session-expired";
import {
  isBlockedPhoneKey,
  sanitizePhoneInput,
  validateIndianMobile,
} from "@/lib/form-validation";
import { userAtom } from "@/lib/store/user";
import { formatGateDeadline } from "@/lib/student-gate";

const COPY = {
  email: {
    title: "Verify your email",
    intro: "We will email a 6-digit code to the address on your account.",
    success: "Email verified",
  },
  mobile: {
    title: "Verify your mobile number",
    intro: "We will text a 6-digit code to this number. It cannot be changed once verified.",
    success: "Mobile number verified",
  },
} as const;

type VerifyContactDialogProps = {
  channel: VerificationChannel;
  /** Account email (read only). */
  email?: string;
  initialMobile?: string;
  /** Overdue: cannot be dismissed. */
  required?: boolean;
  deadlineAt?: string | null;
  onClose: () => void;
  /** `user` is null when the code was accepted but the profile reload failed. */
  onVerified: (result: { user: AuthUserViewModel | null; mobile: string }) => void;
};

type VerifyResponse = {
  ok?: boolean;
  error?: string;
  user?: AuthUserViewModel | null;
};

/**
 * Email / mobile OTP verification: send a code, then enter it. Mount it only
 * while open (each mount starts fresh).
 */
export function VerifyContactDialog({
  channel,
  email = "",
  initialMobile = "",
  required = false,
  deadlineAt = null,
  onClose,
  onVerified,
}: VerifyContactDialogProps) {
  const fieldId = useId();
  const router = useRouter();
  const setUser = useSetAtom(userAtom);
  const [mobile, setMobile] = useState(() => sanitizePhoneInput(initialMobile));
  const [otp, setOtp] = useState("");
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [pending, setPending] = useState<"send" | "verify" | "logout" | null>(null);
  const [error, setError] = useState("");
  const inFlightRef = useRef(false);
  const secondsLeft = useResendCooldown(sentAt);

  const copy = COPY[channel];
  const codeSent = sentAt != null;
  const contact = channel === "email" ? email : mobile;
  const deadline = required ? "" : formatGateDeadline(deadlineAt);
  const ContactIcon = channel === "email" ? Mail : Phone;

  async function run(
    kind: "send" | "verify",
    body: Record<string, string>,
    fallback: string
  ): Promise<VerifyResponse | null> {
    if (inFlightRef.current) return null;
    inFlightRef.current = true;
    setPending(kind);
    setError("");
    try {
      const res = await fetchAuthed(`/api/account/verification/${channel}/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => null)) as VerifyResponse | null;
      if (res.ok && data?.ok) return data;
      setError(data?.error || fallback);
      // Too many active codes: one sent earlier still works.
      if (kind === "send" && res.status === 429) setSentAt(Date.now());
      return null;
    } catch {
      setError("Something went wrong. Check your connection and try again.");
      return null;
    } finally {
      inFlightRef.current = false;
      setPending(null);
    }
  }

  async function sendCode() {
    if (channel === "mobile") {
      const mobileError = validateIndianMobile(mobile);
      if (mobileError) {
        setError(mobileError);
        return;
      }
    }
    const sent = await run(
      "send",
      channel === "mobile" ? { mobile } : {},
      "Unable to send the code right now."
    );
    if (!sent) return;
    setOtp("");
    setSentAt(Date.now());
  }

  async function verifyCode() {
    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code.`);
      return;
    }
    const verified = await run(
      "verify",
      channel === "mobile" ? { otp, mobile } : { otp },
      "Unable to verify the code right now."
    );
    if (!verified) return;
    const user = verified.user ?? null;
    if (user) setUser(user);
    toast.success(copy.success);
    onVerified({ user, mobile });
  }

  async function logout() {
    setPending("logout");
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.push("/login");
    router.refresh();
  }

  function submit() {
    if (pending) return;
    void (codeSent ? verifyCode() : sendCode());
  }

  return (
    <AccountThemedPortal>
      <ConfirmDialog
        open
        title={copy.title}
        description={
          codeSent
            ? `Enter the code sent to ${contact}.`
            : required
              ? `Verification is required to continue. ${copy.intro}`
              : copy.intro
        }
        confirmLabel={codeSent ? "Verify" : "Send code"}
        cancelLabel="Later"
        confirming={pending != null}
        hideCancel={required}
        disableDismiss={required || pending != null}
        onConfirm={submit}
        onCancel={onClose}
      >
        <form
          className="mt-4 space-y-4"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          {codeSent ? (
            <OtpField
              id={`${fieldId}-otp`}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setError("");
              }}
              disabled={pending === "verify"}
              invalid={Boolean(error)}
            />
          ) : channel === "mobile" ? (
            <div>
              <label htmlFor={`${fieldId}-mobile`} className={accountLabelClassName}>
                Mobile
              </label>
              <input
                id={`${fieldId}-mobile`}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                autoFocus
                value={mobile}
                maxLength={10}
                placeholder="9876543210"
                disabled={pending != null}
                aria-invalid={Boolean(error)}
                onChange={(event) => {
                  setMobile(sanitizePhoneInput(event.target.value));
                  setError("");
                }}
                onKeyDown={(event) => {
                  if (isBlockedPhoneKey(event.key)) event.preventDefault();
                }}
                className={accountInputClassName}
              />
            </div>
          ) : email ? (
            <p className="flex items-center gap-3 rounded-md border border-[var(--account-border)] bg-[var(--account-nav-hover)] px-3 py-2.5">
              <ContactIcon
                className="size-4 shrink-0 text-[var(--account-accent)]"
                aria-hidden
              />
              <span className="min-w-0 truncate text-[13px] font-medium text-[var(--account-text)]">
                {email}
              </span>
            </p>
          ) : null}

          {error ? (
            <p className="text-[12px] text-red-500" role="alert">
              {error}
            </p>
          ) : null}

          {codeSent ? (
            <OtpResend
              onResend={() => void sendCode()}
              resending={pending === "send"}
              secondsLeft={secondsLeft}
              disabled={pending != null}
            />
          ) : null}
          {codeSent && channel === "mobile" ? (
            <p className="text-center">
              <button
                type="button"
                disabled={pending != null}
                onClick={() => {
                  setSentAt(null);
                  setOtp("");
                  setError("");
                }}
                className="cursor-pointer text-[12px] font-semibold text-[var(--account-accent)] disabled:opacity-60"
              >
                Use a different number
              </button>
            </p>
          ) : null}
          {deadline ? (
            <p className="text-[12px] text-[var(--account-text-muted)]">
              Verify by {deadline} to keep using your account.
            </p>
          ) : null}
          {required ? (
            <p className="text-[12px] text-[var(--account-text-muted)]">
              Not your account?{" "}
              <button
                type="button"
                disabled={pending != null}
                onClick={() => void logout()}
                className="cursor-pointer font-semibold text-[var(--account-accent)] disabled:opacity-60"
              >
                Log out
              </button>
            </p>
          ) : null}
        </form>
      </ConfirmDialog>
    </AccountThemedPortal>
  );
}
