import { NextResponse } from "next/server";
import { updateUserDetails } from "@/lib/api/modules/auth/service";
import { updatedUserResponse } from "@/lib/auth/route-response";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

/** Save the student's state. A mobile number goes through the verification OTP. */
export async function PATCH(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  const body = (await request.json().catch(() => null)) as {
    stateId?: unknown;
  } | null;
  const stateId = Number(body?.stateId);
  if (!Number.isInteger(stateId) || stateId <= 0) {
    return NextResponse.json(
      { ok: false, error: "Please select a valid state." },
      { status: 400 }
    );
  }

  try {
    const user = await updateUserDetails(accessToken, { stateId });
    return await updatedUserResponse(user, request);
  } catch (error) {
    return bffErrorResponse(error, "Unable to update your profile right now.");
  }
}
