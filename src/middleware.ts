import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session-cookie";
import { publicRequestUrl } from "@/lib/http/public-url";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(publicRequestUrl(request, "/login"));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
