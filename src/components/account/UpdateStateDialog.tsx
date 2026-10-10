"use client";

import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { StateSelectField } from "@/components/forms/StateSelectField";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { AccountProfileField } from "@/lib/api/modules/auth/mapper";
import type { AuthUserViewModel } from "@/lib/api/modules/auth/types";
import { fetchAuthed } from "@/lib/auth/session-expired";
import {
  isBlockedPhoneKey,
  sanitizePhoneInput,
  validatePhone,
} from "@/lib/form-validation";
import { userAtom } from "@/lib/store/user";

type UpdateStateDialogProps = {
  open: boolean;
  /** When true, cancel is hidden and the dialog closes only after success. */
  required?: boolean;
  /** Fields to show and submit. Omit any field that is already saved. */
  fields: AccountProfileField[];
  initialStateId?: number | null;
  initialMobile?: string;
  title?: string;
  description?: string;
  onClose: () => void;
  onUpdated?: (user: AuthUserViewModel) => void;
};

function dialogCopy(fields: AccountProfileField[]) {
  const asksState = fields.includes("state");
  const asksMobile = fields.includes("mobile");
  if (asksState && asksMobile) {
    return {
      title: "Complete your profile",
      description: "Add your mobile number and state to continue using your Rodha account.",
      confirm: "Save",
      success: "Profile updated",
    };
  }
  if (asksMobile) {
    return {
      title: "Update your mobile",
      description: "Add the mobile number linked to your Rodha account.",
      confirm: "Save mobile",
      success: "Mobile number updated",
    };
  }
  return {
    title: "Update your state",
    description: "Choose the state linked to your Rodha account.",
    confirm: "Save state",
    success: "State updated",
  };
}

export function UpdateStateDialog({
  open,
  required = false,
  fields,
  initialStateId = null,
  initialMobile = "",
  title,
  description,
  onClose,
  onUpdated,
}: UpdateStateDialogProps) {
  const setUser = useSetAtom(userAtom);
  const asksState = fields.includes("state");
  const asksMobile = fields.includes("mobile");
  const copy = dialogCopy(fields);
  const [stateValue, setStateValue] = useState(
    initialStateId != null ? String(initialStateId) : ""
  );
  const [mobileValue, setMobileValue] = useState(sanitizePhoneInput(initialMobile));
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStateValue(initialStateId != null ? String(initialStateId) : "");
    setMobileValue(sanitizePhoneInput(initialMobile));
    setError("");
  }, [open, initialStateId, initialMobile]);

  async function submit() {
    const payload: { stateId?: number; mobile?: string } = {};

    if (asksState) {
      const stateId = Number(stateValue);
      if (!stateValue || !Number.isFinite(stateId) || stateId <= 0) {
        setError("Please select your state.");
        return;
      }
      payload.stateId = stateId;
    }

    if (asksMobile) {
      const mobileError = validatePhone(mobileValue);
      if (mobileError) {
        setError(mobileError);
        return;
      }
      payload.mobile = mobileValue;
    }

    if (!payload.stateId && !payload.mobile) return;

    setPending(true);
    setError("");
    try {
      const res = await fetchAuthed("/api/account/state", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        user?: AuthUserViewModel;
      };
      if (!res.ok || !data.ok || !data.user) {
        throw new Error(data.error || "Unable to update your profile");
      }
      setUser(data.user);
      toast.success(copy.success);
      onUpdated?.(data.user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update your profile");
    } finally {
      setPending(false);
    }
  }

  if (fields.length === 0) return null;

  return (
    <ConfirmDialog
      open={open}
      title={title || copy.title}
      description={description || copy.description}
      confirmLabel={pending ? "Saving…" : copy.confirm}
      cancelLabel="Cancel"
      confirming={pending}
      hideCancel={required}
      disableDismiss={required}
      onConfirm={() => void submit()}
      onCancel={() => {
        if (required || pending) return;
        onClose();
      }}
    >
      <div className="mt-4 space-y-4">
        {asksMobile ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-body-sm text-[var(--account-text-muted)]">
              <Phone className="size-4 text-[var(--account-accent)]" strokeWidth={1.75} />
              Enter a 10-digit mobile number.
            </div>
            <label className="block text-body-sm font-medium text-[var(--account-text)]">
              Mobile
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={mobileValue}
                disabled={pending}
                maxLength={10}
                placeholder="9876543210"
                onChange={(event) => {
                  setMobileValue(sanitizePhoneInput(event.target.value));
                  setError("");
                }}
                onKeyDown={(event) => {
                  if (isBlockedPhoneKey(event.key)) event.preventDefault();
                }}
                className="mt-1.5 w-full rounded-[var(--account-radius)] border border-[var(--account-input-border)] bg-[var(--account-input-bg)] px-3.5 py-2.5 text-body text-[var(--account-text)] outline-none focus:border-[var(--account-accent)]"
              />
            </label>
          </div>
        ) : null}
        {asksState ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-body-sm text-[var(--account-text-muted)]">
              <MapPin className="size-4 text-[var(--account-accent)]" strokeWidth={1.75} />
              Choose the state you currently live in.
            </div>
            <StateSelectField
              value={stateValue}
              onChange={(next) => {
                setStateValue(next);
                setError("");
              }}
              disabled={pending}
              required
              variant="account"
              label="State"
            />
          </div>
        ) : null}
        {error ? <p className="text-caption text-accent-red">{error}</p> : null}
      </div>
    </ConfirmDialog>
  );
}
