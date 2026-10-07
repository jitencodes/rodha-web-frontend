import { NextResponse } from "next/server";
import { parseQuickActionType } from "@/lib/account/course-content-filters";
import { getQuickActions } from "@/lib/api/modules/student/courses/service";
import { ApiError } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/server-session";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const type = parseQuickActionType(searchParams.get("type"));

  try {
    const result = await getQuickActions(accessToken, {
      type,
      search: searchParams.get("search") || undefined,
      page: Number.parseInt(searchParams.get("page") || "1", 10) || 1,
      limit: Number.parseInt(searchParams.get("limit") || "10", 10) || 10,
      courseId: searchParams.get("courseId") || undefined,
      courseIds: searchParams.get("courseIds") || undefined,
      packageId: searchParams.get("packageId") || undefined,
      packageIds: searchParams.get("packageIds") || undefined,
      completionStatus: searchParams.get("completionStatus") || undefined,
      liveClassStatus: searchParams.get("liveClassStatus") || undefined,
      resultStatus: searchParams.get("resultStatus") || undefined,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const message =
      error instanceof ApiError ? error.message : "Unable to load content";
    console.error("[api/account/courses/quick-actions]", message, error);
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
