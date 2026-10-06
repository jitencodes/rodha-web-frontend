import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateUserState } from "@/lib/api/modules/auth/service";
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

  const stateId =
    body &&
    typeof body === "object" &&
    "stateId" in body &&
    typeof (body as { stateId: unknown }).stateId === "number"
      ? (body as { stateId: number }).stateId
      : Number(
          body &&
            typeof body === "object" &&
            "stateId" in body
            ? (body as { stateId: unknown }).stateId
            : NaN
        );

  if (!Number.isFinite(stateId) || stateId <= 0) {
    return NextResponse.json(
      { ok: false, error: "Please select a valid state." },
      { status: 400 }
    );
  }

  try {
    const user = await updateUserState(accessToken, stateId);
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value || accessToken;
    const graphy = parseCookieJson<AuthGraphyViewModel>(
      jar.get(AUTH_GRAPHY_COOKIE_NAME)?.value
    );
    const response = NextResponse.json({ ok: true, user });
    applySessionCookies(response, {
      accessToken: token,
      user,
      graphy,
    });
    return response;
  } catch (error) {
    if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const message =
      error instanceof ApiError
        ? error.message
        : "Unable to update state right now.";
    const status =
      error instanceof ApiError && error.status >= 400 && error.status < 600
        ? error.status
        : 502;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
