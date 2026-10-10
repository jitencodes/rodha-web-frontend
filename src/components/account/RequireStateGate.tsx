"use client";

import { useAtomValue } from "jotai";
import { missingAccountProfileFields } from "@/lib/api/modules/auth/mapper";
import { userAtom } from "@/lib/store/user";
import { UpdateStateDialog } from "@/components/account/UpdateStateDialog";

/** Opens a blocking dialog for whichever of mobile and state is still missing. */
export function RequireStateGate() {
  const user = useAtomValue(userAtom);
  const missing = missingAccountProfileFields(user);

  if (!user || missing.length === 0) return null;

  return (
    <UpdateStateDialog
      open
      required
      fields={missing}
      initialStateId={user.stateId}
      initialMobile={user.mobile}
      onClose={() => {
        /* required — unmounts once the saved user has both fields */
      }}
    />
  );
}
