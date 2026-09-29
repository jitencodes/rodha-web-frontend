import { NextResponse } from "next/server";
import { applyAuthCookie } from "@/lib/auth/session-cookie";
import { ApiError } from "@/lib/api/types";
import type { AuthSessionViewModel } from "@/lib/api/modules/auth/types";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export function sessionResponse(session: AuthSessionViewModel) {
  const response = NextResponse.json({
    ok: true,
    user: session.user,
  });
  applyAuthCookie(response, session.accessToken);
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
