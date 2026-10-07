import { forgotPassword } from "@/lib/api/modules/auth/service";
import { authCatch, jsonError } from "@/lib/auth/route-response";
import { validateEmail } from "@/lib/form-validation";
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
  const fieldError = validateEmail(email);
  if (fieldError) {
    return jsonError(fieldError, 400);
  }

  try {
    const message = await forgotPassword({ email });
    return NextResponse.json({ ok: true, message });
  } catch (error) {
    return authCatch(error, "Unable to send reset link right now.");
  }
}
