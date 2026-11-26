import { NextResponse } from "next/server";
import { sendVerificationOtp } from "@/lib/api/modules/auth/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { validateIndianMobile } from "@/lib/form-validation";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

/** Send a verification code. `channel`: `email` (no body) or `mobile` (`{ mobile }`). */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ channel: string }> }
) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  const { channel } = await params;
  const body = (await request.json().catch(() => null)) as {
    mobile?: unknown;
  } | null;

  try {
    if (channel === "email") {
      await sendVerificationOtp(accessToken, { channel });
    } else if (channel === "mobile") {
      const mobile = typeof body?.mobile === "string" ? body.mobile.trim() : "";
      const mobileError = validateIndianMobile(mobile);
      if (mobileError) {
        return NextResponse.json({ ok: false, error: mobileError }, { status: 400 });
      }
      await sendVerificationOtp(accessToken, { channel, mobile });
    } else {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return bffErrorResponse(error, "Unable to send the code right now.");
  }
}
