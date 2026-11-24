import { NextResponse } from "next/server";
import { retryOrderFulfillment } from "@/lib/api/modules/student/orders/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

/** Repeat only the delivery steps that failed for a paid order. */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  const { orderId } = await params;
  if (!/^\d+$/.test(orderId)) {
    return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
  }

  try {
    await retryOrderFulfillment(accessToken, orderId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return bffErrorResponse(error, "Unable to retry delivery right now.");
  }
}
