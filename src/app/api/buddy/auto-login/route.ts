import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/server-session";
import { buildRodhaBuddyUrl } from "@/lib/constants";

export const runtime = "nodejs";

/** Redirect to Buddy, appending the httpOnly login JWT when the user is signed in. */
export async function GET() {
  const accessToken = await getAccessToken();
  return NextResponse.redirect(buildRodhaBuddyUrl(accessToken));
}
