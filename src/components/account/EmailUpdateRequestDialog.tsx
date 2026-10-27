"use client";

import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { validateEmail } from "@/lib/form-validation";
import { cn } from "@/lib/utils";

type EmailUpdateRequestDialogProps = {
  open: boolean;
  currentEmail: string;
  onClose: () => void;
};

const inputClassName = cn(
  "w-full rounded-[var(--account-radius)] border border-[var(--account-input-border)] bg-[var(--account-input-bg)] px-3.5 py-2.5 text-body text-[var(--account-text)]",
  "placeholder:text-[var(--account-text-muted)]",
  "focus:border-[var(--account-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--account-accent)]/20"
);

export function EmailUpdateRequestDialog({
  open,
  currentEmail,
  onClose,
}: EmailUpdateRequestDialogProps) {
  const fieldId = useId();
  const [requestedEmail, setRequestedEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setRequestedEmail("");
    setError(undefined);
    setSubmitting(false);
  }, [open]);

  async function submit() {
    const nextError = validateEmail(requestedEmail);
    if (nextError) {
      setError(nextError);
      return;
    }
    const trimmed = requestedEmail.trim();
    if (
      currentEmail.trim() &&
      trimmed.toLowerCase() === currentEmail.trim().toLowerCase()
    ) {
      setError("Enter a different email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetchAuthed("/api/account/email-update-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestedEmail: trimmed }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        message?: string;
      } | null;
      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.error || "Unable to submit email update request."
        );
      }
      toast.success(data.message || "Email update request submitted.");
      onClose();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to submit email update request.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      title="Request email update"
      description="Submit the email address you want associated with your account. Our team will process the request."
      confirmLabel="Submit request"
      cancelLabel="Cancel"
      confirming={submitting}
      onCancel={onClose}
      onConfirm={() => void submit()}
    >
      <div className="mt-4">
        {currentEmail ? (
          <p className="mb-3 text-caption text-[var(--account-text-muted)]">
            Current email:{" "}
            <span className="font-medium text-[var(--account-text)]">
              {currentEmail}
            </span>
          </p>
        ) : null}
        <label
          htmlFor={fieldId}
          className="mb-1.5 block text-body-sm font-medium text-[var(--account-text-secondary)]"
        >
          New email <span className="text-red-500">*</span>
        </label>
        <input
          id={fieldId}
          type="email"
          autoComplete="email"
          className={inputClassName}
          value={requestedEmail}
          onChange={(e) => {
            setRequestedEmail(e.target.value);
            setError(undefined);
          }}
          placeholder="you@example.com"
        />
        {error ? (
          <p className="mt-1.5 text-caption text-red-500" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </ConfirmDialog>
  );
}
