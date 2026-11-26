import { NextResponse } from "next/server";
import { getAccessToken, getSessionGraphy } from "@/lib/auth/server-session";
import { applySessionCookies } from "@/lib/auth/session-cookie";
import { ApiError } from "@/lib/api/types";
import type {
  AuthSessionViewModel,
  AuthUserViewModel,
} from "@/lib/api/modules/auth/types";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function sessionResponse(
  session: AuthSessionViewModel,
  request: Request
) {
  const response = NextResponse.json({
    ok: true,
    user: session.user,
    graphy: session.graphy
      ? {
          ssoUrl: session.graphy.ssoUrl,
          graphyLearnerId: session.graphy.graphyLearnerId,
        }
      : null,
  });
  applySessionCookies(
    response,
    {
      accessToken: session.accessToken,
      user: session.user,
      graphy: session.graphy,
    },
    request
  );
  return response;
}

/** `{ ok, user }` with the user cookie refreshed; the Graphy session is kept. */
export async function updatedUserResponse(
  user: AuthUserViewModel,
  request: Request
) {
  const response = NextResponse.json({ ok: true, user });
  const accessToken = await getAccessToken();
  if (accessToken) {
    applySessionCookies(
      response,
      { accessToken, user, graphy: await getSessionGraphy() },
      request
    );
  }
  return response;
}

export function authCatch(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    const status =
      error.status >= 400 && error.status < 600 ? error.status : 502;
    return jsonError(error.message || fallback, status);
  }
  console.error("[api/auth]", error);
  return jsonError(fallback, 502);
}
