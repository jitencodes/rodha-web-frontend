import { NextResponse } from "next/server";
import { setStudentCourseArchived } from "@/lib/api/modules/student/courses/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

/** Archive or restore a course. Body: `{ archived: boolean }`. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  const { courseId } = await params;
  const body = (await request.json().catch(() => null)) as {
    archived?: unknown;
  } | null;
  if (!/^\d+$/.test(courseId) || typeof body?.archived !== "boolean") {
    return NextResponse.json(
      { ok: false, error: "Unable to update this course." },
      { status: 400 }
    );
  }

  try {
    const archivedAt = await setStudentCourseArchived(
      accessToken,
      courseId,
      body.archived
    );
    return NextResponse.json({ ok: true, archivedAt });
  } catch (error) {
    return bffErrorResponse(error, "Unable to update this course.");
  }
}
