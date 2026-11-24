import { verifyPurchaseOtp } from "@/lib/api/modules/auth/service";
import { authCatch, jsonError, sessionResponse } from "@/lib/auth/route-response";
import { validateEmail } from "@/lib/form-validation";

export const runtime = "nodejs";

const OTP_PATTERN = /^\d{4,8}$/;

/** Guest checkout: verify the email OTP and set the session cookies. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const journeyId = Number(payload.journeyId);
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const otp = typeof payload.otp === "string" ? payload.otp.trim() : "";
  if (!Number.isInteger(journeyId) || journeyId <= 0 || validateEmail(email)) {
    return jsonError("Please enter your details again.", 400);
  }
  if (!OTP_PATTERN.test(otp)) {
    return jsonError("Enter the code sent to your email.", 400);
  }

  try {
    const session = await verifyPurchaseOtp({ journeyId, email, otp });
    return sessionResponse(session, request);
  } catch (error) {
    return authCatch(error, "Unable to verify the code right now.");
  }
}
