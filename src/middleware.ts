import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session-cookie";
import { publicUrl, requestIsSecure } from "@/lib/http/public-origin";
import {
  hasUtm,
  readUtmFromSearch,
  serializeUtmCookie,
  UTM_COOKIE_NAME,
  UTM_MAX_AGE_SECONDS,
} from "@/lib/tracking/utm";

/**
 * Persist landing `utm_*` params on the server response, so they survive
 * server redirects (auth gate, `/api/checkout/buy`) that happen before any
 * client JS runs. A new UTM set replaces the stored one; it is never merged.
 */
function withUtmCookie(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const utm = readUtmFromSearch(request.nextUrl.search);
  if (!hasUtm(utm)) return response;
  const value = serializeUtmCookie(utm);
  if (request.cookies.get(UTM_COOKIE_NAME)?.value === value) return response;
  response.headers.append(
    "Set-Cookie",
    [
      `${UTM_COOKIE_NAME}=${value}`,
      "Path=/",
      `Max-Age=${UTM_MAX_AGE_SECONDS}`,
      "SameSite=Lax",
      ...(requestIsSecure(request) ? ["Secure"] : []),
    ].join("; ")
  );
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/account" || pathname.startsWith("/account/")) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      const login = publicUrl(request, "/login");
      login.searchParams.set("next", `${pathname}${search}`);
      return withUtmCookie(request, NextResponse.redirect(login));
    }
  }

  return withUtmCookie(request, NextResponse.next());
}

export const config = {
  matcher: [
    // Pages + the Buy Now entry; skip other API routes, Next internals and files.
    "/api/checkout/buy",
    "/((?!api/|_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
