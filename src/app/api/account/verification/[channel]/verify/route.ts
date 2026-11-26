import { NextResponse } from "next/server";
import {
  getCurrentUser,
  verifyVerificationOtp,
} from "@/lib/api/modules/auth/service";
import { ApiError } from "@/lib/api/types";
import { updatedUserResponse } from "@/lib/auth/route-response";
import { getAccessToken } from "@/lib/auth/server-session";
import { isUnauthorizedError } from "@/lib/auth/session-expired";
import { validateIndianMobile } from "@/lib/form-validation";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

const OTP_PATTERN = /^\d{6}$/;

function badRequest(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

/**
 * Verify a code: `{ otp }` (email) or `{ otp, mobile }`. Returns the refreshed
 * user, or `user: null` when the code was accepted but the reload failed.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ channel: string }> }
) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  const { channel } = await params;
  const body = (await request.json().catch(() => null)) as {
    otp?: unknown;
    mobile?: unknown;
  } | null;
  const otp = typeof body?.otp === "string" ? body.otp.trim() : "";
  const mobile = typeof body?.mobile === "string" ? body.mobile.trim() : "";
  if (!OTP_PATTERN.test(otp)) return badRequest("Enter the 6-digit code.");

  try {
    if (channel === "email") {
      await verifyVerificationOtp(accessToken, { channel, otp });
    } else if (channel === "mobile") {
      const mobileError = validateIndianMobile(mobile);
      if (mobileError) return badRequest(mobileError);
      await verifyVerificationOtp(accessToken, { channel, otp, mobile });
    } else {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
  } catch (error) {
    // The API answers 401 to a wrong code and to an expired session alike; a
    // wrong code must not sign the student out.
    if (isUnauthorizedError(error)) {
      const sessionExpired = await getCurrentUser(accessToken).then(
        () => false,
        isUnauthorizedError
      );
      if (sessionExpired) return bffUnauthorized();
      return badRequest(
        (error instanceof ApiError && error.message) || "Invalid code."
      );
    }
    return bffErrorResponse(error, "Unable to verify the code right now.");
  }

  const user = await getCurrentUser(accessToken).catch(() => null);
  return user
    ? updatedUserResponse(user, request)
    : NextResponse.json({ ok: true, user: null });
}
