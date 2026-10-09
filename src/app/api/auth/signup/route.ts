import { signupStudent } from "@/lib/api/modules/auth/service";
import { authCatch, jsonError, sessionResponse } from "@/lib/auth/route-response";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "@/lib/form-validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  if (!body || typeof body !== "object") {
    return jsonError("Invalid request body.", 400);
  }

  const payload = body as Record<string, unknown>;
  const fullName = typeof payload.fullName === "string" ? payload.fullName : "";
  const email = typeof payload.email === "string" ? payload.email : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const phoneNumber =
    typeof payload.phoneNumber === "string" ? payload.phoneNumber : "";
  const stateIdRaw = payload.stateId;
  const stateId =
    typeof stateIdRaw === "number"
      ? stateIdRaw
      : typeof stateIdRaw === "string"
        ? Number(stateIdRaw)
        : NaN;

  const fieldError =
    validateName(fullName) ||
    validateEmail(email) ||
    validatePhone(phoneNumber) ||
    validatePassword(password);
  if (fieldError) {
    return jsonError(fieldError, 400);
  }
  if (!Number.isFinite(stateId) || stateId <= 0) {
    return jsonError("Please select your state.", 400);
  }

  try {
    const session = await signupStudent({
      fullName,
      email,
      password,
      phoneNumber,
      stateId,
    });
    return sessionResponse(session, request);
  } catch (error) {
    return authCatch(error, "Unable to create your account right now.");
  }
}
