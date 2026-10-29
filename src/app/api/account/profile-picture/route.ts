import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/server-session";
import { updateProfilePicture } from "@/lib/api/modules/student/profile/service";
import { ApiError } from "@/lib/api/types";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";
import { clearAuthCookie } from "@/lib/auth/session-cookie";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const form = await request.formData();
    const file = form.get("profilePicture");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { ok: false, error: "Profile picture file is required." },
        { status: 400 }
      );
    }

    const data = await updateProfilePicture(
      accessToken,
      file,
      file.name || "profile.jpg"
    );
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
      const res = NextResponse.json(
        { ok: false, error: "Session expired" },
        { status: error.status }
      );
      clearAuthCookie(res, request);
      return res;
    }
    const message =
      error instanceof ApiError
        ? error.message
        : "Unable to update profile picture";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
