import { NextResponse } from "next/server";
import { getStudentCourseDetail } from "@/lib/api/modules/student/courses/service";
import { ApiError } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/server-session";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ courseId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { courseId } = await context.params;
  if (!courseId?.trim()) {
    return NextResponse.json(
      { ok: false, error: "Missing course id" },
      { status: 400 }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = {
    type: searchParams.get("type") || undefined,
    search: searchParams.get("search") || undefined,
    page: Number.parseInt(searchParams.get("page") || "1", 10) || 1,
    limit: Number.parseInt(searchParams.get("limit") || "12", 10) || 12,
    completionStatus: searchParams.get("completionStatus") || undefined,
    liveClassStatus: searchParams.get("liveClassStatus") || undefined,
    resultStatus: searchParams.get("resultStatus") || undefined,
    chapter: searchParams.get("chapter") || undefined,
    chapterId: searchParams.get("chapterId") || undefined,
  };

  try {
    const detail = await getStudentCourseDetail(
      accessToken,
      courseId.trim(),
      query
    );
    if (!detail) {
      return NextResponse.json(
        { ok: false, error: "Course not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, detail });
  } catch (error) {
    if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const message =
      error instanceof ApiError ? error.message : "Unable to load course";
    console.error("[api/account/courses/:courseId]", message, error);
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
