"use client";

import { useId, useState, type ReactNode } from "react";
import Image from "next/image";
import { CheckCircle2, Eye, EyeOff, Pencil } from "lucide-react";
import type { AccountProfile } from "@/lib/account/types";
import { getInitials } from "@/lib/initials";
import { cn } from "@/lib/utils";
import {
  sanitizeNameInput,
  validateName,
  validatePassword,
  validatePasswordConfirm,
} from "@/lib/form-validation";
import { ACCOUNT_PROFILE_PAGE_COPY } from "@/data/account/profile";

type AccountProfilePanelProps = {
  initialProfile: AccountProfile;
};

type NameErrors = {
  firstName?: string;
  lastName?: string;
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
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);

  const [firstName, setFirstName] = useState(initialProfile.firstName);
  const [lastName, setLastName] = useState(initialProfile.lastName);
  const [nameErrors, setNameErrors] = useState<NameErrors>({});
  const [nameSuccess, setNameSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameSuccess(false);

    const nextErrors: NameErrors = {
      firstName: validateName(firstName),
      lastName: validateName(lastName),
    };
    setNameErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setProfile((prev) => ({
      ...prev,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    }));
    setNameSuccess(true);
    setEditing(false);
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordSuccess(false);

    const nextErrors: PasswordErrors = {
      currentPassword: validatePassword(currentPassword),
      newPassword: validatePassword(newPassword),
      confirmPassword: validatePasswordConfirm(newPassword, confirmPassword),
    };
    setPasswordErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSuccess(true);
  }

  function cancelEdit() {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setNameErrors({});
    setEditing(false);
  }

  return (
    <div className="flex w-full flex-col gap-5">
      {/* Summary card */}
      <section className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-5 shadow-[var(--account-shadow)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setNameSuccess(false);
            }}
            className={cn(
              "inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--account-radius)] px-4 py-2.5 text-body-sm font-semibold",
              "bg-[var(--account-accent)] text-white transition-opacity hover:opacity-90",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--account-accent)]/40"
            )}
          >
            <Pencil className="size-4" strokeWidth={1.75} aria-hidden />
            {ACCOUNT_PROFILE_PAGE_COPY.editLabel}
          </button>
        </div>
      </section>

      {/* Update name */}
      <section className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-5 shadow-[var(--account-shadow)] sm:p-6">
        <h2 className="font-montserrat text-lg font-bold text-[var(--account-text)]">
          {ACCOUNT_PROFILE_PAGE_COPY.updateNameTitle}
        </h2>
        <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
          Changes are saved locally in this session only.
        </p>

        {nameSuccess ? (
          <p
            className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-500/10 px-3 py-2.5 text-body-sm text-emerald-600"
            role="status"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
            {ACCOUNT_PROFILE_PAGE_COPY.successName}
          </p>
        ) : null}

        <form
          onSubmit={handleNameSubmit}
          className="mt-5 flex flex-col gap-4"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <AccountField
              id={`${formIds}-first-name`}
              label="First name"
              error={nameErrors.firstName}
            >
              <input
                id={`${formIds}-first-name`}
                className={inputClassName}
                value={firstName}
                disabled={!editing}
                autoComplete="given-name"
                onChange={(e) => {
                  setFirstName(sanitizeNameInput(e.target.value));
                  setNameErrors((prev) => ({ ...prev, firstName: undefined }));
                  setNameSuccess(false);
                }}
              />
            </AccountField>
            <AccountField
              id={`${formIds}-last-name`}
              label="Last name"
              error={nameErrors.lastName}
            >
              <input
                id={`${formIds}-last-name`}
                className={inputClassName}
                value={lastName}
                disabled={!editing}
                autoComplete="family-name"
                onChange={(e) => {
                  setLastName(sanitizeNameInput(e.target.value));
                  setNameErrors((prev) => ({ ...prev, lastName: undefined }));
                  setNameSuccess(false);
                }}
              />
            </AccountField>
          </div>

          {editing ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className={cn(
                  "inline-flex items-center justify-center rounded-[var(--account-radius)] px-4 py-2.5 text-body-sm font-semibold",
                  "bg-[var(--account-accent)] text-white transition-opacity hover:opacity-90",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--account-accent)]/40"
                )}
              >
                Save name
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className={cn(
                  "inline-flex items-center justify-center rounded-[var(--account-radius)] border border-[var(--account-border-strong)] px-4 py-2.5 text-body-sm font-semibold text-[var(--account-text-secondary)]",
                  "transition-colors hover:bg-[var(--account-nav-hover)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--account-accent)]/40"
                )}
              >
                Cancel
              </button>
            </div>
          ) : null}
        </form>
      </section>

      {/* Change password */}
      <section className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-5 shadow-[var(--account-shadow)] sm:p-6">
        <h2 className="font-montserrat text-lg font-bold text-[var(--account-text)]">
          {ACCOUNT_PROFILE_PAGE_COPY.changePasswordTitle}
        </h2>
        <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
          Demo validation only — passwords are not sent to a server.
        </p>

        {passwordSuccess ? (
          <p
            className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-500/10 px-3 py-2.5 text-body-sm text-emerald-600"
            role="status"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
            {ACCOUNT_PROFILE_PAGE_COPY.successPassword}
          </p>
        ) : null}

        <form
          onSubmit={handlePasswordSubmit}
          className="mt-5 flex flex-col gap-4"
          noValidate
        >
          <PasswordField
            id={`${formIds}-current-password`}
            label="Current password"
            value={currentPassword}
            show={showCurrent}
            onToggleShow={() => setShowCurrent((v) => !v)}
            error={passwordErrors.currentPassword}
            autoComplete="current-password"
            onChange={(value) => {
              setCurrentPassword(value);
              setPasswordErrors((prev) => ({
                ...prev,
                currentPassword: undefined,
              }));
              setPasswordSuccess(false);
            }}
          />
          <PasswordField
            id={`${formIds}-new-password`}
            label="New password"
            value={newPassword}
            show={showNew}
            onToggleShow={() => setShowNew((v) => !v)}
            error={passwordErrors.newPassword}
            autoComplete="new-password"
            onChange={(value) => {
              setNewPassword(value);
              setPasswordErrors((prev) => ({
                ...prev,
                newPassword: undefined,
              }));
              setPasswordSuccess(false);
            }}
          />
          <PasswordField
            id={`${formIds}-confirm-password`}
            label="Confirm new password"
            value={confirmPassword}
            show={showConfirm}
            onToggleShow={() => setShowConfirm((v) => !v)}
            error={passwordErrors.confirmPassword}
            autoComplete="new-password"
            onChange={(value) => {
              setConfirmPassword(value);
              setPasswordErrors((prev) => ({
                ...prev,
                confirmPassword: undefined,
              }));
              setPasswordSuccess(false);
            }}
          />

          <div>
            <button
              type="submit"
              className={cn(
                "inline-flex items-center justify-center rounded-[var(--account-radius)] px-4 py-2.5 text-body-sm font-semibold",
                "bg-[var(--account-accent)] text-white transition-opacity hover:opacity-90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--account-accent)]/40"
              )}
            >
              Update password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  show,
  onToggleShow,
  onChange,
  error,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  show: boolean;
  onToggleShow: () => void;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: string;
}) {
  return (
    <AccountField id={id} label={label} error={error}>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className={cn(inputClassName, "pr-11")}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--account-text-muted)] transition-colors hover:text-[var(--account-text)]"
          aria-label={show ? `Hide ${label}` : `Show ${label}`}
        >
          {show ? (
            <EyeOff className="size-4" strokeWidth={1.75} />
          ) : (
            <Eye className="size-4" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </AccountField>
  );
}
