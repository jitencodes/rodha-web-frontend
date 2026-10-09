"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthBannerSlider } from "@/components/auth/AuthBannerSlider";
import { GoogleContinueButton } from "@/components/auth/GoogleContinueButton";
import { StateSelectField } from "@/components/forms/StateSelectField";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { SESSION_EXPIRED_QUERY } from "@/lib/auth/session-expired";
import {
  isBlockedPhoneKey,
  NAME_MAX_LENGTH,
  PHONE_LENGTH,
  sanitizeNameInput,
  sanitizePhoneInput,
  getPasswordRules,
  getPasswordStrength,
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
  validatePhone,
} from "@/lib/form-validation";
import { cn } from "@/lib/utils";

interface AuthScreenProps {
  mode: "login" | "signup";
}

function safeNextPath(raw: string | null): string {
  if (!raw) return "/account/dashboard";
  if (!raw.startsWith("/") || raw.startsWith("//")) {
    return "/account/dashboard";
  }
  return raw;
}

/**
 * Full page navigation after auth so Set-Cookie is applied and Route Handlers
 * like `/api/checkout/buy` run (client router.push soft-nav cannot).
 */
function navigateAfterAuth(path: string) {
  window.location.assign(path);
}

interface FieldErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  state?: string;
  password?: string;
  confirmPassword?: string;
}

interface AuthApiResponse {
  ok: boolean;
  error?: string;
}

export function AuthScreen({ mode }: AuthScreenProps) {
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const isSignup = mode === "signup";

  useEffect(() => {
    if (searchParams.get("reason") === SESSION_EXPIRED_QUERY) {
      toast.error("Session expired", {
        description: "Please log in again to continue.",
      });
    }
  }, [searchParams]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [stateId, setStateId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitAuth(
    path: string,
    body: Record<string, string | number>
  ) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    let payload: AuthApiResponse = { ok: false };
    try {
      payload = (await response.json()) as AuthApiResponse;
    } catch {
      payload = { ok: false, error: "Unexpected response from the server." };
    }

    if (!response.ok || !payload.ok) {
      throw new Error(
        payload.error || "Something went wrong. Please try again."
      );
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const nextErrors: FieldErrors = {
      email: validateEmail(email),
      password: validatePassword(password, { strict: isSignup }),
    };
    if (isSignup) {
      nextErrors.fullName = validateName(fullName);
      nextErrors.phone = validatePhone(phone);
      nextErrors.confirmPassword = validatePasswordConfirm(
        password,
        confirmPassword
      );
      const parsedStateId = Number(stateId);
      if (!stateId || !Number.isFinite(parsedStateId) || parsedStateId <= 0) {
        nextErrors.state = "Please select your state.";
      }
    }
    setFieldErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    try {
      if (isSignup) {
        await submitAuth("/api/auth/signup", {
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          phoneNumber: phone,
          stateId: Number(stateId),
        });
        setSuccessMessage("Account created. Redirecting…");
      } else {
        await submitAuth("/api/auth/login", {
          email: email.trim(),
          password,
        });
        setSuccessMessage("Logged in. Redirecting…");
      }
      navigateAfterAuth(nextPath);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle(idToken: string) {
    if (loading) return;
    setFormError("");
    setSuccessMessage("");
    setLoading(true);
    try {
      await submitAuth("/api/auth/google", { idToken });
      setSuccessMessage("Signed in with Google. Redirecting…");
      navigateAfterAuth(nextPath);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to continue with Google right now."
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
            {isSignup ? (
              <>
                Create Your <span className="text-orange-500">Account</span>
              </>
            ) : (
              <>
                Welcome <span className="text-orange-500">Back</span>
              </>
            )}
          </h1>
          <p className="mt-2 text-body text-neutral-500">
            {isSignup
              ? "Join Rodha and take the next step towards your success."
              : "Log in to continue your exam preparation with Rodha."}
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            {isSignup ? (
              <Input
                variant="light"
                label="Full Name *"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => {
                  setFullName(sanitizeNameInput(e.target.value));
                  setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                prefixIcon={<Icon src="/assets/icons/user.svg" size={16} />}
                maxLength={NAME_MAX_LENGTH}
                autoComplete="name"
                aria-required
                error={fieldErrors.fullName}
              />
            ) : null}

            <Input
              variant="light"
              label={isSignup ? "Email Address *" : "Email Address"}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              prefixIcon={<Icon src="/assets/icons/email.svg" size={16} />}
              autoComplete="email"
              aria-required
              error={fieldErrors.email}
            />

            {isSignup ? (
              <div className="w-full">
                <label
                  htmlFor="auth-phone"
                  className="mb-1.5 block text-body-sm font-medium text-neutral-700"
                >
                  Mobile Number *
                </label>
                <div
                  className={cn(
                    "input-base relative flex items-center gap-2.5 px-3 !bg-white !text-neutral-900 !border-neutral-200",
                    phoneFocused &&
                      "border-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,0.15)]",
                    fieldErrors.phone && "border-accent-red"
                  )}
                >
                  <span className="text-neutral-400">
                    <Icon src="/assets/icons/phone.svg" size={16} />
                  </span>
                  <span className="shrink-0 select-none text-body-sm text-neutral-500">
                    +91
                  </span>
                  <span className="shrink-0 text-neutral-300" aria-hidden>
                    |
                  </span>
                  <input
                    id="auth-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="Enter your mobile number"
                    value={phone}
                    maxLength={PHONE_LENGTH}
                    onChange={(e) => {
                      setPhone(sanitizePhoneInput(e.target.value));
                      setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                    }}
                    onKeyDown={(e) => {
                      if (isBlockedPhoneKey(e.key)) e.preventDefault();
                    }}
                    onFocus={() => setPhoneFocused(true)}
                    onBlur={() => setPhoneFocused(false)}
                    className="min-w-0 flex-1 border-0 bg-transparent p-0 text-body text-neutral-900 outline-none placeholder:text-neutral-400"
                    aria-required
                    aria-invalid={Boolean(fieldErrors.phone)}
                    disabled={loading}
                  />
                </div>
                {fieldErrors.phone ? (
                  <p className="mt-1 text-caption text-accent-red">
                    {fieldErrors.phone}
                  </p>
                ) : null}
              </div>
            ) : null}

            {isSignup ? (
              <StateSelectField
                value={stateId}
                onChange={(next) => {
                  setStateId(next);
                  setFieldErrors((prev) => ({ ...prev, state: undefined }));
                }}
                error={fieldErrors.state}
                disabled={loading}
                required
                variant="light"
                className="w-full"
              />
            ) : null}

            <Input
              variant="light"
              label={isSignup ? "Password *" : "Password"}
              type={showPassword ? "text" : "password"}
              placeholder={isSignup ? "Create a password" : "Enter your password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }}
              prefixIcon={<LockIcon />}
              suffixIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-neutral-400 hover:text-neutral-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              }
              autoComplete={isSignup ? "new-password" : "current-password"}
              aria-required
              error={isSignup ? undefined : fieldErrors.password}
            />

            {isSignup ? (
              <PasswordRequirements
                password={password}
                showError={Boolean(fieldErrors.password)}
              />
            ) : null}

            {!isSignup ? (
              <div className="-mt-2 flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-caption font-semibold text-orange-500 hover:text-orange-600"
                >
                  Forgot password
                </Link>
              </div>
            ) : null}

            {isSignup ? (
              <Input
                variant="light"
                label="Confirm Password *"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                }}
                prefixIcon={<LockIcon />}
                suffixIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((value) => !value)}
                    className="text-neutral-400 hover:text-neutral-600"
                    aria-label={
                      showConfirm ? "Hide confirm password" : "Show confirm password"
                    }
                    tabIndex={-1}
                  >
                    <EyeIcon open={showConfirm} />
                  </button>
                }
                autoComplete="new-password"
                aria-required
                error={fieldErrors.confirmPassword}
              />
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
              {isSignup ? "Create Account" : "Login"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-neutral-200" />
            <span className="text-caption font-semibold uppercase tracking-wider text-neutral-400">
              OR
            </span>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          <div className="relative z-10 overflow-visible">
            <GoogleContinueButton
              disabled={loading}
              onCredential={handleGoogle}
              onError={setFormError}
            />
          </div>

          <p className="mt-5 text-center text-caption text-neutral-500">
            By continuing, you agree to our{" "}
            <Link
              href="/privacy-policy"
              className="font-medium text-orange-500 hover:text-orange-600"
            >
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
              href="/terms-and-conditions"
              className="font-medium text-orange-500 hover:text-orange-600"
            >
              Terms of Use
            </Link>
            .
          </p>

          <p className="mt-4 text-center text-body-sm text-neutral-600">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-orange-500 hover:text-orange-600"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                New to Rodha?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-orange-500 hover:text-orange-600"
                >
                  Create Account
                </Link>
              </>
            )}
          </p>
          </div>
        </div>
      </div>
    </div>
  );
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

function PasswordRequirements({
  password,
  showError,
}: {
  password: string;
  showError: boolean;
}) {
  const rules = getPasswordRules(password);
  const strength = getPasswordStrength(password);
  const allMet = rules.every((rule) => rule.met);
  if (!password && !showError) return null;

  const strengthClass =
    strength === "strong"
      ? "bg-emerald-500"
      : strength === "medium"
        ? "bg-amber-500"
        : "bg-red-500";
  const strengthWidth =
    strength === "strong" ? "w-full" : strength === "medium" ? "w-2/3" : "w-1/3";

  return (
    <div className="-mt-2 space-y-2" aria-live="polite">
      {strength ? (
        <div className="flex items-center gap-2">
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200">
            <span className={cn("block h-full rounded-full", strengthWidth, strengthClass)} />
          </span>
          <span
            className={cn(
              "text-caption font-semibold capitalize",
              strength === "strong"
                ? "text-emerald-600"
                : strength === "medium"
                  ? "text-amber-600"
                  : "text-red-500"
            )}
          >
            {strength}
          </span>
        </div>
      ) : null}
      <ul className="flex items-center flex-wrap gap-x-1 gap-y-1">
        {rules.map((rule) => (
          <li
            key={rule.id}
            className={cn(
              "shrink-0 !text-body-sm text-accent-red",
              rule.met
                ? "text-emerald-600"
                : showError
                  ? "text-accent-red"
                  : "text-neutral-500"
            )}
          >
            {rule.met ? "✓" : "•"} {rule.label}
          </li>
        ))}
      </ul>
      {allMet ? (
        <p className="text-caption font-semibold text-emerald-600">
          All requirements met
        </p>
      ) : null}
    </div>
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
