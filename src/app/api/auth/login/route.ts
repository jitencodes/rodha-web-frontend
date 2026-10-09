import { loginStudent } from "@/lib/api/modules/auth/service";
import { authCatch, jsonError, sessionResponse } from "@/lib/auth/route-response";
import { validateEmail, validatePassword } from "@/lib/form-validation";

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
  const password = typeof payload.password === "string" ? payload.password : "";

  const fieldError = validateEmail(email) || validatePassword(password);
  if (fieldError) {
    return jsonError(fieldError, 400);
  }

  try {
    const session = await loginStudent({ email, password });
    return sessionResponse(session, request);
  } catch (error) {
    return authCatch(error, "Unable to log in right now.");
  }
}
