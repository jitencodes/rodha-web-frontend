"use client";

import { useEffect, useRef, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { LocateFixed, MapPin } from "lucide-react";
import { toast } from "sonner";
import { StateSelectField } from "@/components/forms/StateSelectField";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { AuthUserViewModel } from "@/lib/api/modules/auth/types";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { detectCurrentState } from "@/lib/geo/detect-current-state";
import { getGoogleMapsApiKey } from "@/lib/constants";
import { detectedLocationAtom, userAtom } from "@/lib/store/user";

type UpdateStateDialogProps = {
  open: boolean;
  /** When true, cancel is hidden and the dialog closes only after success. */
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
  title = "Update your state",
  description = "Choose the state linked to your Rodha account.",
  onClose,
  onUpdated,
}: UpdateStateDialogProps) {
  const setUser = useSetAtom(userAtom);
  const detected = useAtomValue(detectedLocationAtom);
  const setDetected = useSetAtom(detectedLocationAtom);
  const mapsEnabled = Boolean(getGoogleMapsApiKey());
  const userTouchedState = useRef(false);
  const [stateValue, setStateValue] = useState(
    initialStateId != null ? String(initialStateId) : ""
  );
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!open) {
      userTouchedState.current = false;
      return;
    }
    userTouchedState.current = false;
    setStateValue(initialStateId != null ? String(initialStateId) : "");
    setError("");
  }, [open, initialStateId]);

  useEffect(() => {
    if (!open) return;
    if (initialStateId != null) return;
    if (userTouchedState.current) return;
    if (detected?.stateId == null) return;
    setStateValue(String(detected.stateId));
  }, [open, initialStateId, detected]);

  async function useCurrentLocation() {
    setLocating(true);
    try {
      const location = await detectCurrentState();
      if (!location?.stateId) return;
      setDetected(location);
      userTouchedState.current = true;
      setStateValue(String(location.stateId));
      setError("");
    } finally {
      setLocating(false);
    }
  }

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
        throw new Error(data.error || "Unable to update your profile");
      }
      const { user } = data;
      // The save response may leave out the verification flags.
      setUser((prev) => ({
        ...user,
        emailVerified: user.emailVerified ?? prev?.emailVerified,
        mobileVerified: user.mobileVerified ?? prev?.mobileVerified,
      }));
      toast.success("State updated");
      onUpdated?.(user);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update your profile");
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
      <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-body-sm text-[var(--account-text-muted)]">
              <MapPin className="size-4 text-[var(--account-accent)]" strokeWidth={1.75} />
              Choose the state you currently live in.
              {mapsEnabled ? (
                <button
                  type="button"
                  aria-label="Use current location"
                  disabled={pending || locating}
                  onClick={() => void useCurrentLocation()}
                  className="ml-auto inline-flex size-8 items-center justify-center rounded-full text-[var(--account-accent)] disabled:opacity-50"
                >
                  <LocateFixed className="size-4" strokeWidth={1.75} />
                </button>
              ) : null}
            </div>
            <StateSelectField
              value={stateValue}
              onChange={(next) => {
                userTouchedState.current = true;
                setStateValue(next);
                setError("");
              }}
              disabled={pending}
              required
              variant="account"
              label="State"
            />
          </div>
        {error ? <p className="text-caption text-accent-red">{error}</p> : null}
      </div>
    </ConfirmDialog>
  );
}
