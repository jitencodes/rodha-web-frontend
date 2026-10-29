import { atom } from "jotai";
import type { AuthUserViewModel } from "@/lib/api/modules/auth/types";

/** Global authenticated user (includes `stateId` / `state`). */
export const userAtom = atom<AuthUserViewModel | null>(null);

/** GPS reverse-geocode result. Never written back to the saved profile until the user saves. */
export type DetectedLocation = {
  latitude: number;
  longitude: number;
  stateId: number | null;
  stateName: string | null;
};

export const detectedLocationAtom = atom<DetectedLocation | null>(null);
