import { NextResponse } from "next/server";
import { getStudentCourseChapterOptions } from "@/lib/api/modules/student/courses/service";
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
  const search = searchParams.get("search") || undefined;

  try {
    const chapters = await getStudentCourseChapterOptions(accessToken, {
      courseId: courseId.trim(),
      search,
    });
    return NextResponse.json({ ok: true, chapters });
  } catch (error) {
    if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const message =
      error instanceof ApiError ? error.message : "Unable to load chapters";
    console.error("[api/account/courses/:courseId/chapters]", message, error);
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
