"use client";

import { useSyncExternalStore } from "react";
import {
  getRegistrationIncomplete,
  getRegistrationIncompleteServer,
  subscribeRegistrationIncomplete,
} from "@/lib/registration-gate";

/** True once the registration gate reports the student has not finished registration. */
export function useRegistrationIncomplete(): boolean {
  return useSyncExternalStore(
    subscribeRegistrationIncomplete,
    getRegistrationIncomplete,
    getRegistrationIncompleteServer
  );
}
