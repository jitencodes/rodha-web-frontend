import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/api/modules/auth/service";
import { getAccessToken } from "@/lib/auth/server-session";
import {
  applySessionCookies,
  AUTH_COOKIE_NAME,
} from "@/lib/auth/session-cookie";
import { cookies } from "next/headers";
import { ApiError } from "@/lib/api/types";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";

export const runtime = "nodejs";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getCurrentUser(accessToken);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Unable to load profile" },
        { status: 502 }
      );
    }

    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value || accessToken;
    const response = NextResponse.json({ ok: true, user });
    applySessionCookies(response, { accessToken: token, user });
    return response;
  } catch (error) {
    if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const message =
      error instanceof ApiError
        ? error.message
        : "Unable to load profile right now.";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
