import { NextResponse } from "next/server";
import { refreshEnrollments } from "@/lib/api/modules/student/cart/service";
import { ApiError } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/server-session";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";

export const runtime = "nodejs";

/** Silent background sync of live Graphy enrollments for the logged-in student. */
export async function POST() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await refreshEnrollments(accessToken);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    // Keep failures quiet for background callers; still return a non-2xx for refresh skip.
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
