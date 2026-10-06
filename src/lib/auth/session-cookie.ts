import { NextResponse } from "next/server";
import type {
  AuthGraphyViewModel,
  AuthUserViewModel,
} from "@/lib/api/modules/auth/types";

export const AUTH_COOKIE_NAME = "rodha_access_token";
export const AUTH_USER_COOKIE_NAME = "rodha_user";
export const AUTH_GRAPHY_COOKIE_NAME = "rodha_graphy";
/** Non-httpOnly flag so client Header can swap Login ↔ Dashboard. */
export const AUTH_LOGGED_IN_COOKIE_NAME = "rodha_logged_in";

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

function cookieBase(maxAge: number, httpOnly: boolean) {
  return {
    httpOnly,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function applyAuthCookie(
  response: NextResponse,
  accessToken: string
): void {
  response.cookies.set(
    AUTH_COOKIE_NAME,
    accessToken,
    cookieBase(tokenMaxAgeSeconds(accessToken), true)
  );
}

export function applySessionCookies(
  response: NextResponse,
  input: {
    accessToken: string;
    user: AuthUserViewModel;
    graphy?: AuthGraphyViewModel | null;
  }
): void {
  const maxAge = tokenMaxAgeSeconds(input.accessToken);
  applyAuthCookie(response, input.accessToken);

  response.cookies.set(
    AUTH_USER_COOKIE_NAME,
    encodeURIComponent(JSON.stringify(input.user)),
    cookieBase(maxAge, true)
  );

  if (input.graphy?.ssoToken || input.graphy?.ssoUrl) {
    response.cookies.set(
      AUTH_GRAPHY_COOKIE_NAME,
      encodeURIComponent(JSON.stringify(input.graphy)),
      cookieBase(maxAge, true)
    );
  } else {
    response.cookies.set(AUTH_GRAPHY_COOKIE_NAME, "", cookieBase(0, true));
  }

  response.cookies.set(
    AUTH_LOGGED_IN_COOKIE_NAME,
    "1",
    cookieBase(maxAge, false)
  );
}

export function clearAuthCookie(response: NextResponse): void {
  const cleared = cookieBase(0, true);
  response.cookies.set(AUTH_COOKIE_NAME, "", cleared);
  response.cookies.set(AUTH_USER_COOKIE_NAME, "", cleared);
  response.cookies.set(AUTH_GRAPHY_COOKIE_NAME, "", cleared);
  response.cookies.set(
    AUTH_LOGGED_IN_COOKIE_NAME,
    "",
    cookieBase(0, false)
  );
}

export function parseCookieJson<T>(raw: string | undefined): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as T;
  } catch {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
}
