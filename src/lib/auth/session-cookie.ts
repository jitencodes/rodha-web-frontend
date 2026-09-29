import { NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "rodha_access_token";

const DEFAULT_MAX_AGE = 60 * 60 * 24;

function decodeJwtPayload(accessToken: string): { exp?: unknown } | null {
  try {
    const payloadPart = accessToken.split(".")[1];
    if (!payloadPart) return null;
    const padded = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(padded);
    return JSON.parse(json) as { exp?: unknown };
  } catch {
    return null;
  }
}

function tokenMaxAgeSeconds(accessToken: string): number {
  const payload = decodeJwtPayload(accessToken);
  if (typeof payload?.exp !== "number") return DEFAULT_MAX_AGE;
  const seconds = payload.exp - Math.floor(Date.now() / 1000);
  return seconds > 60 ? seconds : DEFAULT_MAX_AGE;
}

export function applyAuthCookie(
  response: NextResponse,
  accessToken: string
): void {
  response.cookies.set(AUTH_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: tokenMaxAgeSeconds(accessToken),
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
