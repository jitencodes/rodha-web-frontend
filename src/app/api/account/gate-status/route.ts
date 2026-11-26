import { NextResponse } from "next/server";
import { getStudentGate } from "@/lib/api/modules/student/gate/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

/** Email / mobile verification and registration status for the student gate. */
export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  try {
    const gate = await getStudentGate(accessToken);
    if (!gate) {
      return NextResponse.json(
        { ok: false, error: "Unable to load account status." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, gate });
  } catch (error) {
    return bffErrorResponse(error, "Unable to load account status.");
  }
}
