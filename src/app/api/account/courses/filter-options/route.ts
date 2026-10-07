import { NextResponse } from "next/server";
import { getStudentCourseFilterOptions } from "@/lib/api/modules/student/courses/service";
import { ApiError } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/server-session";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";

export const runtime = "nodejs";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const options = await getStudentCourseFilterOptions(accessToken);
    return NextResponse.json({ ok: true, ...options });
  } catch (error) {
    if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const message =
      error instanceof ApiError
        ? error.message
        : "Unable to load filter options";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
