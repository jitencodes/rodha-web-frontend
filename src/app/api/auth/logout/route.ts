import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth/session-cookie";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = NextResponse.json({ ok: true });
  clearAuthCookie(response, request);
  return response;
}
