"use client";

import { useSyncExternalStore } from "react";
import {
  getRegistrationIncomplete,
  getRegistrationIncompleteServer,
  subscribeRegistrationIncomplete,
} from "@/lib/student-gate";

/** True until the student has submitted the registration form (required or not). */
export function useRegistrationIncomplete(): boolean {
  return useSyncExternalStore(
    subscribeRegistrationIncomplete,
    getRegistrationIncomplete,
    getRegistrationIncompleteServer
  );
}
