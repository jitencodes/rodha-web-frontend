"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthBannerSlider } from "@/components/auth/AuthBannerSlider";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
} from "@/lib/form-validation";

interface AuthPasswordScreenProps {
  mode: "forgot" | "reset";
}

interface AuthApiResponse {
  ok: boolean;
  error?: string;
  message?: string;
}

function LockIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228L3 3m0 0l18 18"
        />
      </svg>
    );
  }

  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

export function AuthPasswordScreen({ mode }: AuthPasswordScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isForgot = mode === "forgot";

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [tokenError, setTokenError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmError, setConfirmError] = useState<string | undefined>();
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const nextEmailError = validateEmail(email);
    setEmailError(nextEmailError);

    if (isForgot) {
      if (nextEmailError) return;
      setLoading(true);
      try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email: email.trim() }),
        });
        let payload: AuthApiResponse = { ok: false };
        try {
          payload = (await response.json()) as AuthApiResponse;
        } catch {
          payload = { ok: false, error: "Unexpected response from the server." };
        }
        if (!response.ok || !payload.ok) {
          throw new Error(
            payload.error || "Unable to send reset link. Please try again."
          );
        }
        setSuccessMessage(
          payload.message ||
            "Password reset link has been sent. Check your email."
        );
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : "Unable to send reset link. Please try again."
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    const nextTokenError = token.trim() ? undefined : "Reset token is required.";
    const nextPasswordError = validatePassword(newPassword);
    const nextConfirmError = validatePasswordConfirm(
      newPassword,
      confirmPassword
    );
    setTokenError(nextTokenError);
    setPasswordError(nextPasswordError);
    setConfirmError(nextConfirmError);
    if (
      nextEmailError ||
      nextTokenError ||
      nextPasswordError ||
      nextConfirmError
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          token: token.trim(),
          newPassword,
          confirmPassword,
        }),
      });
      let payload: AuthApiResponse = { ok: false };
      try {
        payload = (await response.json()) as AuthApiResponse;
      } catch {
        payload = { ok: false, error: "Unexpected response from the server." };
      }
      if (!response.ok || !payload.ok) {
        throw new Error(
          payload.error || "Unable to reset password. Please try again."
        );
      }
      setSuccessMessage(
        payload.message || "Password updated. You can log in now."
      );
      window.setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1200);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-4 sm:p-6 lg:h-full lg:min-h-0 lg:overflow-hidden">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] lg:h-full lg:grid-cols-2">
        <AuthBannerSlider />

        <div className="min-h-0 overflow-y-auto">
          <div className="flex min-h-full flex-col justify-center px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
            <h1 className="font-montserrat text-[28px] font-bold leading-tight tracking-tight text-neutral-900 sm:text-[32px]">
              {isForgot ? (
                <>
                  Forgot <span className="text-orange-500">Password</span>
                </>
              ) : (
                <>
                  Reset <span className="text-orange-500">Password</span>
                </>
              )}
            </h1>
            <p className="mt-2 text-body text-neutral-500">
              {isForgot
                ? "Enter your email and we’ll send a password reset link."
                : "Choose a new password for your Rodha account."}
            </p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
              <Input
                variant="light"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(undefined);
                }}
                prefixIcon={<Icon src="/assets/icons/email.svg" size={16} />}
                autoComplete="email"
                aria-required
                error={emailError}
              />

              {!isForgot ? (
                <>

                  <Input
                    variant="light"
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError(undefined);
                    }}
                    prefixIcon={<LockIcon />}
                    suffixIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="text-neutral-400 hover:text-neutral-600"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        tabIndex={-1}
                      >
                        <EyeIcon open={showPassword} />
                      </button>
                    }
                    autoComplete="new-password"
                    aria-required
                    error={passwordError}
                  />

                  <Input
                    variant="light"
                    label="Confirm Password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmError(undefined);
                    }}
                    prefixIcon={<LockIcon />}
                    suffixIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirm((value) => !value)}
                        className="text-neutral-400 hover:text-neutral-600"
                        aria-label={
                          showConfirm
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        tabIndex={-1}
                      >
                        <EyeIcon open={showConfirm} />
                      </button>
                    }
                    autoComplete="new-password"
                    aria-required
                    error={confirmError}
                  />
                </>
              ) : null}

              {formError ? (
                <p className="text-body-sm text-accent-red" role="alert">
                  {formError}
                </p>
              ) : null}
              {successMessage ? (
                <p className="text-body-sm text-green-600" role="status">
                  {successMessage}
                </p>
              ) : null}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                className="!rounded-full"
              >
                {isForgot ? "Send Reset Link" : "Update Password"}
              </Button>
            </form>

            <p className="mt-6 text-center text-body-sm text-neutral-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-orange-500 hover:text-orange-600"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
