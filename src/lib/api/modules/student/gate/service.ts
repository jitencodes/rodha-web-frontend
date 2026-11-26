import { getMe } from "@/lib/api/modules/auth/service";
import { mapStudentGate } from "./mapper";
import type { StudentGateViewModel } from "./types";

/** `auth/me` stays callable while the student is soft-blocked. */
export async function getStudentGate(
  accessToken: string
): Promise<StudentGateViewModel | null> {
  return mapStudentGate(await getMe(accessToken));
}
