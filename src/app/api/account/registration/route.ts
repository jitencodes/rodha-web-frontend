import { NextResponse } from "next/server";
import {
  getStudentRegistration,
  submitStudentRegistration,
} from "@/lib/api/modules/student/registration/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { ApiError } from "@/lib/api/types";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  try {
    const data = await getStudentRegistration(accessToken);
    if (!data) {
      return NextResponse.json(
        { ok: false, error: "Unable to load registration form." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
      return bffUnauthorized();
    }
    return bffErrorResponse(error, "Unable to load registration form.");
  }
}

export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid form data." },
      { status: 400 }
    );
  }

  try {
    const data = await submitStudentRegistration(accessToken, formData);
    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
      return bffUnauthorized();
    }
    return bffErrorResponse(error, "Unable to submit registration.");
  }
}
