import { NextResponse } from "next/server";
import { requestEmailUpdate } from "@/lib/api/modules/auth/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { ApiError } from "@/lib/api/types";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";
import { validateEmail } from "@/lib/form-validation";

export const runtime = "nodejs";

/**
 * Stub BFF for email-update requests.
 * Upstream path is a placeholder until the real API is available.
 */
export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const requestedEmail =
    body &&
    typeof body === "object" &&
    "requestedEmail" in body &&
    typeof (body as { requestedEmail: unknown }).requestedEmail === "string"
      ? (body as { requestedEmail: string }).requestedEmail
      : "";

  const emailError = validateEmail(requestedEmail);
  if (emailError) {
    return NextResponse.json({ ok: false, error: emailError }, { status: 400 });
  }

  try {
    const data = await requestEmailUpdate(accessToken, requestedEmail);
    const message =
      (data &&
        typeof data === "object" &&
        typeof data.message === "string" &&
        data.message.trim()) ||
      "Email update request submitted.";
    return NextResponse.json({ ok: true, message });
  } catch (error) {
    if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const message =
      error instanceof ApiError
        ? error.message
        : "Unable to submit email update request right now.";
    const status =
      error instanceof ApiError && error.status >= 400 && error.status < 600
        ? error.status
        : 502;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
