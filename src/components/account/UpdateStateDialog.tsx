"use client";

import { useEffect, useId, useState } from "react";
import { useSetAtom } from "jotai";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { StateSelectField } from "@/components/forms/StateSelectField";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { AuthUserViewModel } from "@/lib/api/modules/auth/types";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { userAtom } from "@/lib/store/user";

type UpdateStateDialogProps = {
  open: boolean;
  /** When true, cancel is hidden / dismissed only after success. */
  required?: boolean;
  initialStateId?: number | null;
  title?: string;
  description?: string;
  onClose: () => void;
  onUpdated?: (user: AuthUserViewModel) => void;
};

export function UpdateStateDialog({
  open,
  required = false,
  initialStateId = null,
  title = "Select your state",
  description = "We need your state to continue with enrollment and support.",
  onClose,
  onUpdated,
}: UpdateStateDialogProps) {
  const setUser = useSetAtom(userAtom);
  const formId = useId();
  const [stateValue, setStateValue] = useState(
    initialStateId != null ? String(initialStateId) : ""
  );
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStateValue(initialStateId != null ? String(initialStateId) : "");
    setError("");
  }, [open, initialStateId]);

  async function submit() {
    const stateId = Number(stateValue);
    if (!stateValue || !Number.isFinite(stateId) || stateId <= 0) {
      setError("Please select your state.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const res = await fetchAuthed("/api/account/state", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stateId }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        user?: AuthUserViewModel;
      };
      if (!res.ok || !data.ok || !data.user) {
        throw new Error(data.error || "Unable to update state");
      }
      setUser(data.user);
      toast.success("State updated");
      onUpdated?.(data.user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update state");
    } finally {
      setPending(false);
    }
  }

  return (
    <ConfirmDialog
      open={open}
      title={title}
      description={description}
      confirmLabel={pending ? "Saving…" : "Save state"}
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
      <div className="mt-4 space-y-3">
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
          error={error}
          disabled={pending}
          required
          variant="light"
          label="State"
        />
        <span id={formId} className="sr-only">
          State selection
        </span>
      </div>
    </ConfirmDialog>
  );
}
