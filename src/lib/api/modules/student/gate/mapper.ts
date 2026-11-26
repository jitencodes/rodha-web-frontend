import type { AuthUserApi } from "@/lib/api/modules/auth/types";
import type {
  StudentGateViewModel,
  StudentRegistrationStatusApi,
  StudentRegistrationStatusViewModel,
  StudentVerificationApi,
  StudentVerificationViewModel,
} from "./types";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function mapRegistrationStatus(
  raw: StudentRegistrationStatusApi | null | undefined
): StudentRegistrationStatusViewModel {
  return {
    completed: Boolean(raw?.completed),
    required: Boolean(raw?.required),
    overdue: Boolean(raw?.overdue),
    deadlineAt: asString(raw?.deadlineAt) || null,
    firstEnrollmentAt: asString(raw?.firstEnrollmentAt) || null,
  };
}

function mapVerification(
  raw: StudentVerificationApi | null | undefined
): StudentVerificationViewModel {
  const required = raw?.required === true && raw.verified !== true;
  return {
    required,
    overdue: required && raw?.overdue === true,
    deadlineAt: asString(raw?.deadlineAt) || null,
  };
}

export function mapStudentGate(
  me: AuthUserApi | null | undefined
): StudentGateViewModel | null {
  if (!me) return null;
  return {
    email: asString(me.email),
    mobile: asString(me.mobile),
    emailVerification: mapVerification(me.emailVerification),
    mobileVerification: mapVerification(me.mobileVerification),
    registration: mapRegistrationStatus(me.registration),
  };
}
