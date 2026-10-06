import { atom } from "jotai";
import type { AuthUserViewModel } from "@/lib/api/modules/auth/types";

/** Global authenticated user (includes `stateId` / `state`). */
export const userAtom = atom<AuthUserViewModel | null>(null);
