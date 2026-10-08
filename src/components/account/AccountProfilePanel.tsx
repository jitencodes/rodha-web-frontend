"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useAtomValue } from "jotai";
import { toast } from "sonner";
import { ProfileAvatarCropModal } from "@/components/account/ProfileAvatarCropModal";
import { UpdateStateDialog } from "@/components/account/UpdateStateDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { AccountProfile } from "@/lib/account/types";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { getInitials } from "@/lib/initials";
import { userAtom } from "@/lib/store/user";
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
  icon,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="w-full min-w-0">
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-1.5 text-body-sm font-medium text-[var(--account-text-secondary)]"
      >
        {icon}
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
  const router = useRouter();
  const formIds = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const authUser = useAtomValue(userAtom);
  const [profile, setProfile] = useState(initialProfile);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [stateDialogOpen, setStateDialogOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordPending, setPasswordPending] = useState(false);
  const [confirmPasswordOpen, setConfirmPasswordOpen] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fullName =
    profile.fullName ||
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim();

  const stateId = authUser?.stateId ?? profile.stateId ?? null;
  const stateName =
    authUser?.state?.name || profile.stateName || "";
  const stateCode =
    authUser?.state?.code || profile.stateCode || "";
  const stateLabel = stateName
    ? stateCode
      ? `${stateName} (${stateCode})`
      : stateName
    : "Not set";

  function onPickFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    setCropSrc(url);
  }

  async function uploadCropped(blob: Blob) {
    setUploadingAvatar(true);
    try {
      const form = new FormData();
      form.append("profilePicture", blob, "profile.jpg");
      const res = await fetchAuthed("/api/account/profile-picture", {
        method: "PATCH",
        body: form,
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Unable to update photo");
      }
      const preview = URL.createObjectURL(blob);
      setProfile((prev) => ({ ...prev, avatarUrl: preview }));
      toast.success("Profile photo updated");
      setCropSrc(null);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to update photo"
      );
    } finally {
      setUploadingAvatar(false);
    }
  }

  function validatePasswordForm(): boolean {
    const nextErrors: PasswordErrors = {
      currentPassword: validatePassword(currentPassword),
      newPassword: validatePassword(newPassword),
      confirmPassword: validatePasswordConfirm(newPassword, confirmPassword),
    };
    setPasswordErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  }

  async function submitPassword() {
    setPasswordSuccess(false);
    setPasswordError("");
    setPasswordPending(true);
    try {
      const res = await fetchAuthed("/api/account/password", {
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
      setConfirmPasswordOpen(false);
      toast.success("Password updated");
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Unable to update password"
      );
      setConfirmPasswordOpen(false);
    } finally {
      setPasswordPending(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <section className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-5 shadow-[var(--account-shadow)] sm:p-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploadingAvatar}
              className="group relative size-20 cursor-pointer overflow-hidden rounded-full bg-[var(--account-accent-soft)] ring-2 ring-[var(--account-accent)]/35 transition ring-offset-2 ring-offset-[var(--account-surface)] hover:ring-[var(--account-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--account-accent)] disabled:cursor-wait sm:size-24"
              aria-label="Update profile photo"
            >
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <span className="flex size-full items-center justify-center font-montserrat text-2xl font-bold text-[var(--account-accent)]">
                  {getInitials(fullName)}
                </span>
              )}
              <span
                className="pointer-events-none absolute inset-x-0 bottom-0 flex h-7 items-center justify-center bg-black/55 text-[10px] font-semibold uppercase tracking-wide text-white sm:h-8 sm:text-[11px]"
                aria-hidden
              >
                Edit
              </span>
              <span className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-black/55 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <Camera
                  className="size-7 text-white drop-shadow"
                  strokeWidth={1.75}
                />
              </span>
            </button>
            <span
              className="pointer-events-none absolute -right-0.5 -bottom-0.5 z-10 flex size-7 items-center justify-center rounded-full border-2 border-[var(--account-surface)] bg-[var(--account-accent)] text-white shadow-md sm:size-8"
              aria-hidden
            >
              <Camera className="size-3.5 sm:size-4" strokeWidth={2} />
            </span>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPickFile(e.target.files?.[0])}
          />
          <div className="min-w-0">
            <h2 className="truncate font-montserrat text-xl font-bold text-[var(--account-text)] sm:text-2xl">
              {fullName}
            </h2>
            <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
              {uploadingAvatar
                ? "Uploading photo…"
                : "Hover or tap the photo to update your avatar"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-5 shadow-[var(--account-shadow)] sm:p-6">
        <h2 className="font-montserrat text-lg font-bold text-[var(--account-text)]">
          Profile details
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <a
            href={profile.email ? `mailto:${profile.email}` : undefined}
            className={cn(
              "flex items-start gap-3 rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-bg)] px-3.5 py-3 transition-colors",
              profile.email &&
                "hover:border-[var(--account-accent)] hover:bg-[var(--account-nav-active-bg)]"
            )}
          >
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--account-accent-soft)] text-[var(--account-accent)]">
              <Mail className="size-4" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-caption font-medium text-[var(--account-text-muted)]">
                Email
              </span>
              <span className="mt-0.5 block truncate text-body font-medium text-[var(--account-text)]">
                {profile.email || "—"}
              </span>
            </span>
          </a>
          <a
            href={
              profile.phone
                ? `tel:${profile.phone.replace(/\s+/g, "")}`
                : undefined
            }
            className={cn(
              "flex items-start gap-3 rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-bg)] px-3.5 py-3 transition-colors",
              profile.phone &&
                "hover:border-[var(--account-accent)] hover:bg-[var(--account-nav-active-bg)]"
            )}
          >
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--account-accent-soft)] text-[var(--account-accent)]">
              <Phone className="size-4" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-caption font-medium text-[var(--account-text-muted)]">
                Phone
              </span>
              <span className="mt-0.5 block truncate text-body font-medium text-[var(--account-text)]">
                {profile.phone || "—"}
              </span>
            </span>
          </a>
          <div className="flex items-start gap-3 rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-bg)] px-3.5 py-3 sm:col-span-2">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--account-accent-soft)] text-[var(--account-accent)]">
              <MapPin className="size-4" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <span className="block text-caption font-medium text-[var(--account-text-muted)]">
                State
              </span>
              <span className="mt-0.5 block truncate text-body font-medium text-[var(--account-text)]">
                {stateLabel}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStateDialogOpen(true)}
              className="shrink-0 cursor-pointer rounded-lg border border-[var(--account-accent)] px-3 py-1.5 text-[13px] font-semibold text-[var(--account-accent)] transition-colors hover:bg-[var(--account-nav-active-bg)]"
            >
              Update State
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-5 shadow-[var(--account-shadow)] sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--account-accent-soft)] text-[var(--account-accent)]">
            <ShieldCheck className="size-5" strokeWidth={1.75} aria-hidden />
          </span>
          <div>
            <h2 className="font-montserrat text-lg font-bold text-[var(--account-text)]">
              {ACCOUNT_PROFILE_PAGE_COPY.changePasswordTitle}
            </h2>
            <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
              Use a strong password you don&apos;t reuse elsewhere.
            </p>
          </div>
        </div>

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
          onSubmit={(e) => {
            e.preventDefault();
            if (!validatePasswordForm()) return;
            setConfirmPasswordOpen(true);
          }}
          className="mt-5 flex flex-col gap-4"
          noValidate
        >
          <AccountField
            id={`${formIds}-current`}
            label="Current password"
            error={passwordErrors.currentPassword}
            icon={<KeyRound className="size-3.5" strokeWidth={1.75} aria-hidden />}
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
                className="absolute inset-y-0 right-0 cursor-pointer px-3 text-[var(--account-text-muted)] hover:text-[var(--account-text)]"
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
            icon={<Lock className="size-3.5" strokeWidth={1.75} aria-hidden />}
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
                className="absolute inset-y-0 right-0 cursor-pointer px-3 text-[var(--account-text-muted)] hover:text-[var(--account-text)]"
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
            icon={<Lock className="size-3.5" strokeWidth={1.75} aria-hidden />}
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
                className="absolute inset-y-0 right-0 cursor-pointer px-3 text-[var(--account-text-muted)] hover:text-[var(--account-text)]"
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
              "inline-flex w-fit cursor-pointer items-center justify-center gap-2 rounded-[var(--account-radius)] px-4 py-2.5 text-body-sm font-semibold",
              "bg-[var(--account-accent)] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            )}
          >
            <ShieldCheck className="size-4" strokeWidth={1.75} aria-hidden />
            Update password
          </button>
        </form>
      </section>

      {cropSrc ? (
        <ProfileAvatarCropModal
          open
          imageSrc={cropSrc}
          uploading={uploadingAvatar}
          onCancel={() => {
            URL.revokeObjectURL(cropSrc);
            setCropSrc(null);
          }}
          onCropped={(blob) => void uploadCropped(blob)}
        />
      ) : null}

      <ConfirmDialog
        open={confirmPasswordOpen}
        title="Update password?"
        description="You will use the new password the next time you log in."
        confirmLabel="Update password"
        cancelLabel="Cancel"
        confirming={passwordPending}
        onCancel={() => setConfirmPasswordOpen(false)}
        onConfirm={() => void submitPassword()}
      />

      <UpdateStateDialog
        open={stateDialogOpen}
        initialStateId={stateId}
        title="Update State"
        description="Choose the state linked to your Rodha account."
        onClose={() => setStateDialogOpen(false)}
        onUpdated={(user) => {
          setProfile((prev) => ({
            ...prev,
            stateId: user.stateId,
            stateName: user.state?.name || "",
            stateCode: user.state?.code || "",
          }));
          router.refresh();
        }}
      />
    </div>
  );
}
