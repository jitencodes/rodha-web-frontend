import { NextResponse } from "next/server";

import { getAccessToken } from "@/lib/auth/server-session";

export const runtime = "nodejs";

/**
 * Same-origin token for the Socket.IO handshake.
 * The API host cannot see the httpOnly session cookie, so the browser
 * reads it here and keeps the value in memory only.
 */
export async function GET() {
  const token = await getAccessToken();
  if (!token) {
    return NextResponse.json(
      { ok: false },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { ok: true, token },
    { headers: { "Cache-Control": "no-store" } }
  );
}
