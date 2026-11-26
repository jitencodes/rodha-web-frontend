import { NextResponse } from "next/server";
import { cancelPendingPackageUpgrade } from "@/lib/api/modules/student/package-upgrades/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

/** Cancel an unpaid upgrade so the upgrade options return. */
export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  let orderId: number | null = null;
  try {
    const body = (await request.json()) as { orderId?: unknown } | null;
    const n = Number.parseInt(String(body?.orderId ?? ""), 10);
    orderId = Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    orderId = null;
  }
  if (orderId == null) {
    return NextResponse.json({ ok: false, error: "orderId is required." }, { status: 400 });
  }

  try {
    await cancelPendingPackageUpgrade(accessToken, orderId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return bffErrorResponse(error, "Unable to cancel this upgrade right now.");
  }
}
