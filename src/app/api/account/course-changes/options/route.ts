import { NextResponse } from "next/server";
import { COURSE_CHANGE_PAGE_SIZE } from "@/lib/api/modules/student/course-changes/mapper";
import { getCourseChangeOptions } from "@/lib/api/modules/student/course-changes/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

const TEXT_MAX = 100;
const LIMIT_MAX = 24;

function readPositiveInt(value: string | null): number | null {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function readText(value: string | null): string | undefined {
  return value?.trim().slice(0, TEXT_MAX) || undefined;
}

/** Courses the student may switch to from `courseId` (search / filter / paged). */
export async function GET(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  const { searchParams } = new URL(request.url);
  const courseId = readPositiveInt(searchParams.get("courseId"));
  if (courseId == null) {
    return NextResponse.json({ ok: false, error: "Course not found." }, { status: 400 });
  }
  const sort = searchParams.get("sort");

  try {
    const data = await getCourseChangeOptions(accessToken, {
      courseId,
      packageId: readPositiveInt(searchParams.get("packageId")),
      search: readText(searchParams.get("search")),
      language: readText(searchParams.get("language")),
      sort: sort === "title_asc" || sort === "title_desc" ? sort : "",
      page: readPositiveInt(searchParams.get("page")) ?? 1,
      limit: Math.min(
        readPositiveInt(searchParams.get("limit")) ?? COURSE_CHANGE_PAGE_SIZE,
        LIMIT_MAX
      ),
    });
    return NextResponse.json(
      { ok: true, data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return bffErrorResponse(error, "Unable to load course options.");
  }
}
