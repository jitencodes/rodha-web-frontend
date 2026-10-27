import { NextResponse } from "next/server";
import {
  getStudentRegistration,
  submitStudentRegistration,
} from "@/lib/api/modules/student/registration/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { ApiError } from "@/lib/api/types";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";

export const runtime = "nodejs";

export async function GET() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

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
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const message =
      error instanceof ApiError
        ? error.message
        : "Unable to load registration form.";
    const status =
      error instanceof ApiError && error.status >= 400 && error.status < 600
        ? error.status
        : 502;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

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
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const message =
      error instanceof ApiError
        ? error.message
        : "Unable to submit registration.";
    const status =
      error instanceof ApiError && error.status >= 400 && error.status < 600
        ? error.status
        : 502;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
