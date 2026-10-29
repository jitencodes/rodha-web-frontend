import { loginWithGoogle } from "@/lib/api/modules/auth/service";
import { authCatch, jsonError, sessionResponse } from "@/lib/auth/route-response";

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
  const idToken = typeof payload.idToken === "string" ? payload.idToken.trim() : "";
  if (!idToken) {
    return jsonError("Google sign-in did not return a credential.", 400);
  }

  try {
    const session = await loginWithGoogle({ idToken });
    return sessionResponse(session, request);
  } catch (error) {
    return authCatch(error, "Unable to continue with Google right now.");
  }
}
