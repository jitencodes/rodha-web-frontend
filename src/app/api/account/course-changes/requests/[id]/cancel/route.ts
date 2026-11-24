import { NextResponse } from "next/server";
import { cancelCourseChange } from "@/lib/api/modules/student/course-changes/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

/** Cancel a pending request. 409 = no longer pending. */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ ok: false, error: "Request not found." }, { status: 404 });
  }

  try {
    await cancelCourseChange(accessToken, Number(id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return bffErrorResponse(error, "Unable to cancel this request.");
  }
}
