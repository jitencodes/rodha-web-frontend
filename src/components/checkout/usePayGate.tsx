"use client";

import { useState, type ReactNode } from "react";
import { CheckoutLocationDialog } from "@/components/account/CheckoutLocationDialog";
import { UpdateStateDialog } from "@/components/account/UpdateStateDialog";
import { userHasMobile } from "@/lib/api/modules/auth/mapper";
import type { AuthUserViewModel } from "@/lib/api/modules/auth/types";
import { resolveCheckoutState } from "@/lib/geo/detect-current-state";

type PayGateOptions = {
  user: AuthUserViewModel | null;
  /** State the buyer already gave (guest form); skips the location step. */
  knownStateName?: string | null;
  initialMobile?: string;
  submit: (stateName: string | null) => Promise<void>;
  setPending: (pending: boolean) => void;
  setError: (error: string | null) => void;
  onUserUpdated?: (user: AuthUserViewModel) => void;
};

/**
 * Steps before payment, shared by checkout and package upgrade: a mobile
 * number is required, then the buyer's state (GPS, else picked or skipped).
 */
export function usePayGate({
  user,
  knownStateName,
  initialMobile,
  submit,
  setPending,
  setError,
  onUserUpdated,
}: PayGateOptions): { startPay: () => void; dialogs: ReactNode } {
  const [mobileDialogOpen, setMobileDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  async function resolveStateAndSubmit() {
    if (knownStateName) {
      await submit(knownStateName);
      return;
    }
    setPending(true);
    setError(null);
    const resolution = await resolveCheckoutState();
    if (resolution.status !== "resolved") {
      setPending(false);
      setPermissionDenied(resolution.status === "permission_denied");
      setLocationDialogOpen(true);
      return;
    }
    await submit(resolution.stateName);
  }

  function startPay() {
    if (user && !userHasMobile(user)) {
      setMobileDialogOpen(true);
      setError("Please add your mobile number before continuing to pay.");
      return;
    }
    void resolveStateAndSubmit();
  }

  async function retryLocation() {
    const resolution = await resolveCheckoutState();
    setPermissionDenied(resolution.status === "permission_denied");
    if (resolution.status === "resolved") {
      setLocationDialogOpen(false);
      await submit(resolution.stateName);
    }
    return resolution;
  }

  function submitFromDialog(stateName: string | null) {
    setLocationDialogOpen(false);
    void submit(stateName);
  }

  const dialogs = (
    <>
      <UpdateStateDialog
        open={mobileDialogOpen}
        required
        fields={["mobile"]}
        initialMobile={user?.mobile || initialMobile}
        onClose={() => setMobileDialogOpen(false)}
        onUpdated={(updated) => {
          setMobileDialogOpen(false);
          setError(null);
          onUserUpdated?.(updated);
          void resolveStateAndSubmit();
        }}
      />
      <CheckoutLocationDialog
        open={locationDialogOpen}
        permissionDenied={permissionDenied}
        onUseCurrentLocation={retryLocation}
        onConfirm={submitFromDialog}
        onSkip={() => submitFromDialog(null)}
      />
    </>
  );

  return { startPay, dialogs };
}
