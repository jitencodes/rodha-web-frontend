import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/server-session";
import { updateStudentPassword } from "@/lib/api/modules/student/profile/service";
import { ApiError } from "@/lib/api/types";
import { validatePassword } from "@/lib/form-validation";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const currentPassword =
    typeof payload.currentPassword === "string" ? payload.currentPassword : "";
  const newPassword =
    typeof payload.newPassword === "string" ? payload.newPassword : "";

  const err = validatePassword(newPassword);
  if (!currentPassword || err) {
    return NextResponse.json(
      { ok: false, error: err || "Current password is required." },
      { status: 400 }
    );
  }

  try {
    await updateStudentPassword(accessToken, currentPassword, newPassword);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Unable to update password";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
