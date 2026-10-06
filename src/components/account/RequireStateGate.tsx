"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { userHasState } from "@/lib/api/modules/auth/mapper";
import { userAtom } from "@/lib/store/user";
import { UpdateStateDialog } from "@/components/account/UpdateStateDialog";

/** Opens a blocking Update State dialog when `/auth/me` has `state: null`. */
export function RequireStateGate() {
  const user = useAtomValue(userAtom);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && !userHasState(user)) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [user]);

  if (!user) return null;

  return (
    <UpdateStateDialog
      open={open}
      required
      initialStateId={user.stateId}
      title="Update your state"
      description="Please select your state to continue using your Rodha account."
      onClose={() => {
        /* required — only closes after successful update via atom refresh */
      }}
    />
  );
}
