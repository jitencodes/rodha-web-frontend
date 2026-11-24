import { NextResponse } from "next/server";
import { COURSE_CHANGE_REASON_MAX } from "@/lib/api/modules/student/course-changes/mapper";
import { submitCourseChange } from "@/lib/api/modules/student/course-changes/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

function readPositiveInt(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/** Submit a course change. 409 = blocked; 400 field errors are kept. */
export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const packageId = readPositiveInt(payload.packageId);
  const fromCourseId = readPositiveInt(payload.fromCourseId);
  const toCourseId = readPositiveInt(payload.toCourseId);
  const reason = typeof payload.reason === "string" ? payload.reason.trim() : "";

  if (packageId == null || fromCourseId == null || toCourseId == null) {
    return NextResponse.json(
      { ok: false, error: "Select a course to switch to." },
      { status: 400 }
    );
  }
  if (reason.length > COURSE_CHANGE_REASON_MAX) {
    return NextResponse.json(
      {
        ok: false,
        error: `Keep the reason within ${COURSE_CHANGE_REASON_MAX} characters.`,
        errors: { reason: `Keep the reason within ${COURSE_CHANGE_REASON_MAX} characters.` },
      },
      { status: 400 }
    );
  }

  try {
    await submitCourseChange(accessToken, {
      packageId,
      fromCourseId,
      toCourseId,
      ...(reason ? { reason } : {}),
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return bffErrorResponse(error, "Unable to submit your request.");
  }
}
