import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth/session-cookie";
import { SESSION_EXPIRED_QUERY } from "@/lib/auth/session-expired";
import { publicUrl } from "@/lib/http/public-origin";

export const runtime = "nodejs";

/** Clears auth cookies and redirects to login with Session expired toast reason. */
export async function GET(request: Request) {
  const url = publicUrl(request, "/login");
  url.searchParams.set("reason", SESSION_EXPIRED_QUERY);
  const next = new URL(request.url).searchParams.get("next");
  if (next?.startsWith("/") && !next.startsWith("//")) {
    url.searchParams.set("next", next);
  }
  const response = NextResponse.redirect(url);
  clearAuthCookie(response, request);
  return response;
}
