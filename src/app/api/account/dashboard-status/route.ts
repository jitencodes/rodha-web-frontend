import { NextResponse } from "next/server";
import { fetchStudentDashboardRegistrationStatus } from "@/lib/api/modules/student/dashboard/service";
import { getAccessToken } from "@/lib/auth/server-session";

export const runtime = "nodejs";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized", unauthorized: true },
      { status: 401 }
    );
  }

  const result = await fetchStudentDashboardRegistrationStatus(accessToken);
  if (result.unauthorized) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized", unauthorized: true },
      { status: 401 }
    );
  }

  if (!result.ok || !result.registration) {
    return NextResponse.json(
      { ok: false, error: "Unable to load registration status." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    registration: result.registration,
  });
}
