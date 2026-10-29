"use client";

import { useEffect, useState } from "react";
import { LocateFixed, MapPin } from "lucide-react";
import { StateSelectField } from "@/components/forms/StateSelectField";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { CheckoutStateResolution } from "@/lib/geo/detect-current-state";

type CheckoutLocationDialogProps = {
  open: boolean;
  permissionDenied: boolean;
  onUseCurrentLocation: () => Promise<CheckoutStateResolution>;
  onConfirm: (stateName: string) => void;
  onSkip: () => void;
};

/** Checkout-only state picker. Never writes the student profile. */
export function CheckoutLocationDialog({
  open,
  permissionDenied,
  onUseCurrentLocation,
  onConfirm,
  onSkip,
}: CheckoutLocationDialogProps) {
  const [stateValue, setStateValue] = useState("");
  const [stateName, setStateName] = useState("");
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStateValue("");
    setStateName("");
    setError("");
    setLocating(false);
  }, [open]);

  async function useCurrentLocation() {
    setLocating(true);
    setError("");
    try {
      await onUseCurrentLocation();
    } finally {
      setLocating(false);
    }
  }

  function confirm() {
    const next = stateName.trim();
    if (!next) {
      setError("Select your current location, or continue without a state.");
      return;
    }
    onConfirm(next);
  }

  return (
    <ConfirmDialog
      open={open}
      title="Select your current location"
      description={
        permissionDenied
          ? "Location access is blocked. Allow it in your browser, then try again, or choose a state below. This is used only for checkout."
          : "Choose the state you are in. This is used only for checkout and does not update your profile."
      }
      confirmLabel="Use this state"
      cancelLabel="Continue without state"
      onConfirm={confirm}
      onCancel={onSkip}
    >
      <div className="mt-4 space-y-3">
        {permissionDenied ? (
          <button
            type="button"
            disabled={locating}
            onClick={() => void useCurrentLocation()}
            className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--account-radius)] border border-[var(--account-border)] text-[13px] font-semibold text-[var(--account-accent)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LocateFixed className="size-4" strokeWidth={1.75} />
            {locating ? "Requesting location…" : "Allow location access"}
          </button>
        ) : (
          <button
            type="button"
            disabled={locating}
            onClick={() => void useCurrentLocation()}
            className="inline-flex items-center gap-2 text-body-sm font-medium text-[var(--account-accent)] disabled:opacity-60"
          >
            <LocateFixed className="size-4" strokeWidth={1.75} />
            {locating ? "Finding your location…" : "Use current location"}
          </button>
        )}
        <div className="flex items-center gap-2 text-body-sm text-[var(--account-text-muted)]">
          <MapPin className="size-4 text-[var(--account-accent)]" strokeWidth={1.75} />
          Select your current location
        </div>
        <StateSelectField
          value={stateValue}
          onChange={(next) => {
            setStateValue(next);
            setError("");
          }}
          onSelect={(option) => {
            setStateName(option?.name || option?.code || "");
          }}
          disabled={locating}
          variant="account"
          label="State"
          placeholder="Select your current location"
        />
        {error ? <p className="text-caption text-accent-red">{error}</p> : null}
      </div>
    </ConfirmDialog>
  );
}
