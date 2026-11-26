"use client";

import { useAtomValue } from "jotai";
import { userHasState } from "@/lib/api/modules/auth/mapper";
import { userAtom } from "@/lib/store/user";
import { UpdateStateDialog } from "@/components/account/UpdateStateDialog";

/** Blocking dialog while the state is missing (mobile: `StudentGateProvider`). */
export function RequireStateGate() {
  const user = useAtomValue(userAtom);

  if (!user || userHasState(user)) return null;

  return (
    <UpdateStateDialog
      open
      required
      initialStateId={user.stateId}
      onClose={() => {
        /* required — unmounts once the saved user has a state */
      }}
    />
  );
}
