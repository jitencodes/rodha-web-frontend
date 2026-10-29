import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateCompleteProfile } from "@/lib/api/modules/auth/service";
import { getAccessToken } from "@/lib/auth/server-session";
import {
  applySessionCookies,
  AUTH_COOKIE_NAME,
  AUTH_GRAPHY_COOKIE_NAME,
  parseCookieJson,
} from "@/lib/auth/session-cookie";
import type { AuthGraphyViewModel } from "@/lib/api/modules/auth/types";
import { ApiError } from "@/lib/api/types";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";

export const runtime = "nodejs";

/** Forwards the complete-profile payload to PATCH api/auth/me/details. */
export async function PATCH(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { ok: false, error: "Invalid profile payload." },
      { status: 400 }
    );
  }

  try {
    const user = await updateCompleteProfile(
      accessToken,
      body as Record<string, unknown>
    );
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value || accessToken;
    const graphy = parseCookieJson<AuthGraphyViewModel>(
      jar.get(AUTH_GRAPHY_COOKIE_NAME)?.value
    );
    const response = NextResponse.json({ ok: true, user });
    applySessionCookies(
      response,
      {
        accessToken: token,
        user,
        graphy,
      },
      request
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const message =
      error instanceof ApiError
        ? error.message
        : "Unable to update your profile right now.";
    const status =
      error instanceof ApiError && error.status >= 400 && error.status < 600
        ? error.status
        : 502;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
