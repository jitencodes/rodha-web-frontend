import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/server-session";
import { getGraphySso } from "@/lib/api/modules/student/profile/service";
import { ApiError } from "@/lib/api/types";

export const runtime = "nodejs";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const graphy = await getGraphySso(accessToken);
    if (!graphy?.ssoUrl) {
      return NextResponse.json(
        { ok: false, error: "Graphy SSO unavailable" },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, graphy });
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Unable to open Graphy";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
