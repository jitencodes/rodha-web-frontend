/**
 * Student soft-block: the API answers 201 + `success: false` with one of these
 * codes. `apiGet` & co. raise it as an `ApiError` with `SOFT_BLOCK_STATUS`, so
 * BFF routes pass it on and `fetchAuthed` opens the matching gate.
 * Never 401/403: those end the session.
 */
export const SOFT_BLOCK_STATUS = 423;

const SOFT_BLOCK_CODES: readonly unknown[] = [
  "EMAIL_VERIFICATION_REQUIRED",
  "MOBILE_VERIFICATION_REQUIRED",
  "REGISTRATION_REQUIRED",
];

export function isSoftBlockBody(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const errors = (body as { errors?: unknown }).errors;
  if (!errors || typeof errors !== "object") return false;
  return SOFT_BLOCK_CODES.includes((errors as { code?: unknown }).code);
}
