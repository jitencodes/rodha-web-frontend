import { NextResponse } from "next/server";
import { sendPurchaseOtp } from "@/lib/api/modules/auth/service";
import { validateEmail } from "@/lib/form-validation";
import { bffErrorResponse } from "@/lib/http/bff-response";

export const runtime = "nodejs";

/** Emails the purchase OTP: the first send and every resend. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const journeyId = Number(payload.journeyId);
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  if (!Number.isInteger(journeyId) || journeyId <= 0 || validateEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter your details again." },
      { status: 400 }
    );
  }

  try {
    await sendPurchaseOtp({ journeyId, email });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return bffErrorResponse(error, "Unable to send the code right now.");
  }
}
