"use client";

import { useId, useState, type ReactNode } from "react";
import Image from "next/image";
import { CheckCircle2, Eye, EyeOff } from "lucide-react";
import type { AccountProfile } from "@/lib/account/types";
import { getInitials } from "@/lib/initials";
import { cn } from "@/lib/utils";
import {
  validatePassword,
  validatePasswordConfirm,
} from "@/lib/form-validation";
import { ACCOUNT_PROFILE_PAGE_COPY } from "@/data/account/profile";

type AccountProfilePanelProps = {
  initialProfile: AccountProfile;
};

type PasswordErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

function AccountField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 block text-body-sm font-medium text-[var(--account-text-secondary)]"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-caption text-red-500" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const inputClassName = cn(
  "w-full rounded-[var(--account-radius)] border border-[var(--account-input-border)] bg-[var(--account-input-bg)] px-3.5 py-2.5 text-body text-[var(--account-text)]",
  "placeholder:text-[var(--account-text-muted)]",
  "focus:border-[var(--account-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--account-accent)]/20",
  "disabled:cursor-not-allowed disabled:opacity-60"
);

export function AccountProfilePanel({
  initialProfile,
}: AccountProfilePanelProps) {
  const formIds = useId();
  const [profile] = useState(initialProfile);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordPending, setPasswordPending] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fullName =
    profile.fullName ||
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim();

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordSuccess(false);
    setPasswordError("");

    const nextErrors: PasswordErrors = {
      currentPassword: validatePassword(currentPassword),
      newPassword: validatePassword(newPassword),
      confirmPassword: validatePasswordConfirm(newPassword, confirmPassword),
    };
    setPasswordErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setPasswordPending(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unable to update password");
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(true);
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Unable to update password"
      );
    } finally {
      setPasswordPending(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <section className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-5 shadow-[var(--account-shadow)] sm:p-6">
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-[var(--account-accent-soft)] sm:size-20">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <span className="flex size-full items-center justify-center font-montserrat text-xl font-bold text-[var(--account-accent)]">
                {getInitials(fullName)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="truncate font-montserrat text-xl font-bold text-[var(--account-text)] sm:text-2xl">
              {fullName}
            </h2>
            <p className="mt-1 truncate text-body-sm text-[var(--account-text-muted)]">
              {profile.email}
            </p>
            <p className="mt-0.5 truncate text-body-sm text-[var(--account-text-muted)]">
              {profile.phone}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-5 shadow-[var(--account-shadow)] sm:p-6">
        <h2 className="font-montserrat text-lg font-bold text-[var(--account-text)]">
          Profile details
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-body-sm text-[var(--account-text-muted)]">
              Full name
            </dt>
            <dd className="mt-1 text-body font-medium text-[var(--account-text)]">
              {fullName || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-body-sm text-[var(--account-text-muted)]">
              Email
            </dt>
            <dd className="mt-1 text-body font-medium text-[var(--account-text)]">
              {profile.email || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-body-sm text-[var(--account-text-muted)]">
              Phone
            </dt>
            <dd className="mt-1 text-body font-medium text-[var(--account-text)]">
              {profile.phone || "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-5 shadow-[var(--account-shadow)] sm:p-6">
        <h2 className="font-montserrat text-lg font-bold text-[var(--account-text)]">
          {ACCOUNT_PROFILE_PAGE_COPY.changePasswordTitle}
        </h2>

        {passwordSuccess ? (
          <p
            className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-500/10 px-3 py-2.5 text-body-sm text-emerald-600"
            role="status"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
            Password updated successfully.
          </p>
        ) : null}
        {passwordError ? (
          <p className="mt-4 text-body-sm text-red-500" role="alert">
            {passwordError}
          </p>
        ) : null}

        <form
          onSubmit={handlePasswordSubmit}
          className="mt-5 flex flex-col gap-4"
          noValidate
        >
          <AccountField
            id={`${formIds}-current`}
            label="Current password"
            error={passwordErrors.currentPassword}
          >
            <div className="relative">
              <input
                id={`${formIds}-current`}
                type={showCurrent ? "text" : "password"}
                className={cn(inputClassName, "pr-11")}
                value={currentPassword}
                autoComplete="current-password"
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setPasswordErrors((prev) => ({
                    ...prev,
                    currentPassword: undefined,
                  }));
                }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 text-[var(--account-text-muted)]"
                onClick={() => setShowCurrent((v) => !v)}
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </AccountField>

          <AccountField
            id={`${formIds}-new`}
            label="New password"
            error={passwordErrors.newPassword}
          >
            <div className="relative">
              <input
                id={`${formIds}-new`}
                type={showNew ? "text" : "password"}
                className={cn(inputClassName, "pr-11")}
                value={newPassword}
                autoComplete="new-password"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordErrors((prev) => ({
                    ...prev,
                    newPassword: undefined,
                  }));
                }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 text-[var(--account-text-muted)]"
                onClick={() => setShowNew((v) => !v)}
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </AccountField>

          <AccountField
            id={`${formIds}-confirm`}
            label="Confirm new password"
            error={passwordErrors.confirmPassword}
          >
            <div className="relative">
              <input
                id={`${formIds}-confirm`}
                type={showConfirm ? "text" : "password"}
                className={cn(inputClassName, "pr-11")}
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 text-[var(--account-text-muted)]"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </AccountField>

          <button
            type="submit"
            disabled={passwordPending}
            className={cn(
              "inline-flex w-fit items-center justify-center rounded-[var(--account-radius)] px-4 py-2.5 text-body-sm font-semibold",
              "bg-[var(--account-accent)] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            )}
          >
            {passwordPending ? "Updating…" : "Update password"}
          </button>
        </form>
      </section>
    </div>
  );
}
