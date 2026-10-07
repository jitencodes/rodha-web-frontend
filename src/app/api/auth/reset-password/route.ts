import { resetPassword } from "@/lib/api/modules/auth/service";
import { authCatch, jsonError } from "@/lib/auth/route-response";
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
} from "@/lib/form-validation";
import { NextResponse } from "next/server";

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
  const email = typeof payload.email === "string" ? payload.email : "";
  const token = typeof payload.token === "string" ? payload.token : "";
  const newPassword =
    typeof payload.newPassword === "string" ? payload.newPassword : "";
  const confirmPassword =
    typeof payload.confirmPassword === "string"
      ? payload.confirmPassword
      : newPassword;

  const fieldError =
    validateEmail(email) ||
    (!token.trim() ? "Reset token is required." : undefined) ||
    validatePassword(newPassword) ||
    validatePasswordConfirm(newPassword, confirmPassword);

  if (fieldError) {
    return jsonError(fieldError, 400);
  }

  try {
    const message = await resetPassword({ email, token, newPassword });
    return NextResponse.json({ ok: true, message });
  } catch (error) {
    return authCatch(error, "Unable to reset password right now.");
  }
}
