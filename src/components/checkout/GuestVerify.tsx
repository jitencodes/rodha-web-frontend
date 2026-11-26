"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { GoogleContinueButton } from "@/components/auth/GoogleContinueButton";
import {
  accountInputClassName,
  accountLabelClassName,
} from "@/components/account/forms/accountFieldStyles";
import { OTP_LENGTH, OtpField, OtpResend } from "@/components/forms/OtpField";
import { useResendCooldown } from "@/hooks/useResendCooldown";
import type {
  AuthUserViewModel,
  PurchaseAuthOption,
  PurchaseIdentifyViewModel,
} from "@/lib/api/modules/auth/types";
import { validatePassword } from "@/lib/form-validation";
import { cn } from "@/lib/utils";

type GuestVerifyProps = {
  identity: PurchaseIdentifyViewModel;
  email: string;
  disabled?: boolean;
  /** When the last code was emailed in this journey (null = not yet). */
  otpSentAt: number | null;
  onOtpSent: () => void;
  /** Owned by the drawer: closing and reopening must not email a second code. */
  autoSendStartedRef: RefObject<boolean>;
  onEditDetails: () => void;
  onSignedIn: (user: AuthUserViewModel | null) => void;
};

type AuthResponse = { ok?: boolean; error?: string; user?: AuthUserViewModel };

const PRIMARY_BUTTON =
  "inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60";

// Plain `fetch`: a 401 here means wrong credentials, not an expired session.
async function postAuth(url: string, body: unknown, fallback: string): Promise<AuthResponse> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Something went wrong. Check your connection and try again.");
  }
  const data = (await res.json().catch(() => null)) as AuthResponse | null;
  if (!res.ok || !data?.ok) throw new Error(data?.error || fallback);
  return data;
}

/** Guest checkout step 2: sign in with the methods the API allows. */
export function GuestVerify({
  identity,
  email,
  disabled = false,
  otpSentAt,
  onOtpSent,
  autoSendStartedRef,
  onEditDetails,
  onSignedIn,
}: GuestVerifyProps) {
  const { options, journeyId, isNewUser } = identity;
  const [method, setMethod] = useState<PurchaseAuthOption>(identity.next);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [resending, setResending] = useState(false);
  const otpSent = otpSentAt != null;
  const secondsLeft = useResendCooldown(otpSentAt);
  const inFlightRef = useRef(false);
  const locked = disabled || pending;

  // `identify` does not email a code: send the first one when OTP is the method.
  useEffect(() => {
    if (method !== "EMAIL_OTP" || otpSent || autoSendStartedRef.current) return;
    autoSendStartedRef.current = true;
    void sendCode();
    // Once per journey; a failed send can be retried from the button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, otpSent]);

  async function signIn(run: () => Promise<AuthResponse>) {
    if (inFlightRef.current || disabled) return;
    inFlightRef.current = true;
    setPending(true);
    setError("");
    setNotice("");
    try {
      const data = await run();
      onSignedIn(data.user ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in right now.");
    } finally {
      inFlightRef.current = false;
      setPending(false);
    }
  }

  function submitOtp(event: React.FormEvent) {
    event.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit code sent to your email.`);
      return;
    }
    void signIn(() =>
      postAuth(
        "/api/auth/purchase/otp/verify",
        { journeyId, email, otp },
        "Unable to verify the code right now."
      )
    );
  }

  function submitPassword(event: React.FormEvent) {
    event.preventDefault();
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    void signIn(() =>
      postAuth("/api/auth/login", { email, password }, "Unable to log in right now.")
    );
  }

  async function sendCode() {
    if (resending || secondsLeft > 0 || locked) return;
    setResending(true);
    setError("");
    setNotice("");
    try {
      await postAuth(
        "/api/auth/purchase/otp/resend",
        { journeyId, email },
        "Unable to send the code right now."
      );
      onOtpSent();
      setOtp("");
      if (otpSent) setNotice("We sent a new code to your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send the code right now.");
    } finally {
      setResending(false);
    }
  }

  function switchMethod(next: PurchaseAuthOption) {
    setMethod(next);
    setError("");
    setNotice("");
  }

  const hasGoogle = options.includes("GOOGLE");
  const formOptions = options.filter((option) => option !== "GOOGLE");
  // Google has its own button, so a Google-first account still shows a form.
  const formMethod =
    method !== "GOOGLE" && formOptions.includes(method)
      ? method
      : (formOptions[0] ?? null);
  const alternative = formOptions.find((option) => option !== formMethod) ?? null;
  const googleFirst = identity.next === "GOOGLE";

  const google = hasGoogle ? (
    <div className="relative z-10">
      <GoogleContinueButton
        disabled={locked}
        onCredential={(idToken) =>
          void signIn(() =>
            postAuth(
              "/api/auth/google",
              { idToken },
              "Unable to continue with Google right now."
            )
          )
        }
        onError={setError}
      />
    </div>
  ) : null;

  const divider =
    hasGoogle && formMethod ? (
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-[var(--account-border)]" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--account-text-muted)]">
          or
        </span>
        <span className="h-px flex-1 bg-[var(--account-border)]" />
      </div>
    ) : null;

  const form =
    formMethod === "EMAIL_OTP" ? (
      <form onSubmit={submitOtp} noValidate className="space-y-3">
        {otpSent ? (
          <>
            <OtpField
              id="guest-otp"
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setError("");
              }}
              disabled={locked}
              invalid={Boolean(error)}
            />
            <button
              type="submit"
              disabled={locked || otp.length !== OTP_LENGTH}
              className={PRIMARY_BUTTON}
            >
              {pending ? "Verifying…" : "Verify and continue"}
            </button>
            <OtpResend
              onResend={() => void sendCode()}
              resending={resending}
              secondsLeft={secondsLeft}
              disabled={locked}
            />
          </>
        ) : (
          <button
            type="button"
            onClick={() => void sendCode()}
            disabled={resending || locked}
            className={PRIMARY_BUTTON}
          >
            {resending ? "Sending code…" : "Email me a code"}
          </button>
        )}
      </form>
    ) : formMethod === "PASSWORD" ? (
      <form onSubmit={submitPassword} noValidate className="space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="guest-password" className={accountLabelClassName}>
              Password
            </label>
            <a
              href="/forgot-password"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1.5 text-[12px] font-semibold text-[var(--account-accent)]"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="guest-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={locked}
              aria-invalid={Boolean(error)}
              className={cn(accountInputClassName, "!pr-11")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--account-text-muted)]"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden />
              ) : (
                <Eye className="size-4" aria-hidden />
              )}
            </button>
          </div>
        </div>
        <button type="submit" disabled={locked || !password} className={PRIMARY_BUTTON}>
          {pending ? "Signing in…" : "Login and continue"}
        </button>
      </form>
    ) : null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[14px] font-semibold text-[var(--account-text)]">
          {isNewUser ? "Verify your email" : "Welcome back"}
        </h3>
        <p className="mt-0.5 text-[12px] text-[var(--account-text-muted)]">
          {formMethod === "EMAIL_OTP" && (otpSent || isNewUser)
            ? otpSent
              ? "Enter the code we sent to your email."
              : "We will email you a code to continue."
            : "This email already has a Rodha account. Sign in to continue."}
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-md border border-[var(--account-border)] bg-[var(--account-nav-hover)] px-3 py-2.5">
        <Mail className="size-4 shrink-0 text-[var(--account-accent)]" aria-hidden />
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[var(--account-text)]">
          {email}
        </span>
        <button
          type="button"
          onClick={onEditDetails}
          disabled={locked}
          className="shrink-0 cursor-pointer text-[12px] font-semibold text-[var(--account-accent)] disabled:opacity-60"
        >
          Change
        </button>
      </div>

      {googleFirst ? (
        <>
          {google}
          {divider}
          {form}
        </>
      ) : (
        <>
          {form}
          {divider}
          {google}
        </>
      )}

      {alternative ? (
        <button
          type="button"
          onClick={() => switchMethod(alternative)}
          disabled={locked}
          className="w-full cursor-pointer text-center text-[12px] font-semibold text-[var(--account-accent)] disabled:opacity-60"
        >
          {alternative === "EMAIL_OTP"
            ? "Use an email code instead"
            : "Use your password instead"}
        </button>
      ) : null}

      {error ? (
        <p className="text-[12px] text-red-500" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="text-[12px] text-[var(--account-status-active-text)]" role="status">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
