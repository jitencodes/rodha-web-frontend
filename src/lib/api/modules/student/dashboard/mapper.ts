import type {
  DashboardRegistrationApi,
  StudentRegistrationStatusViewModel,
} from "./types";

export const EMPTY_REGISTRATION_STATUS: StudentRegistrationStatusViewModel = {
  completed: false,
  required: false,
  overdue: false,
  deadlineAt: null,
  firstEnrollmentAt: null,
};

function asNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

export function mapDashboardRegistration(
  raw: DashboardRegistrationApi | null | undefined
): StudentRegistrationStatusViewModel {
  if (!raw || typeof raw !== "object") {
    return { ...EMPTY_REGISTRATION_STATUS };
  }
  return {
    completed: Boolean(raw.completed),
    required: Boolean(raw.required),
    overdue: Boolean(raw.overdue),
    deadlineAt: asNullableString(raw.deadlineAt),
    firstEnrollmentAt: asNullableString(raw.firstEnrollmentAt),
  };
}

/** Soft-block body: errors.code REGISTRATION_REQUIRED */
export function mapRegistrationRequiredErrors(
  errors: unknown
): StudentRegistrationStatusViewModel {
  const obj =
    errors && typeof errors === "object"
      ? (errors as Record<string, unknown>)
      : {};
  return {
    completed: false,
    required: true,
    overdue: true,
    deadlineAt: asNullableString(obj.deadlineAt),
    firstEnrollmentAt: asNullableString(obj.firstEnrollmentAt),
  };
}

export function isRegistrationRequiredBody(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const errors = (body as { errors?: unknown }).errors;
  if (!errors || typeof errors !== "object") return false;
  return (errors as { code?: unknown }).code === "REGISTRATION_REQUIRED";
}
