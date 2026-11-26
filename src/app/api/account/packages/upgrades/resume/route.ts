import { NextResponse } from "next/server";
import { resumePackageUpgradePayment } from "@/lib/api/modules/student/package-upgrades/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

async function readOrderId(request: Request): Promise<number | null> {
  try {
    const body = (await request.json()) as { orderId?: unknown } | null;
    const n = Number.parseInt(String(body?.orderId ?? ""), 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

/** Re-open Razorpay for a pending upgrade. 404 not yours · 409 session missing (cancel). */
export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  const orderId = await readOrderId(request);
  if (orderId == null) {
    return NextResponse.json({ ok: false, error: "orderId is required." }, { status: 400 });
  }

  try {
    const data = await resumePackageUpgradePayment(accessToken, orderId);
    return NextResponse.json({
      ok: true,
      mode: data.mode,
      orderId: data.orderId,
      orderNumber: data.orderNumber,
      upgradeId: data.upgradeId,
      status: data.status,
      payableAmount: data.payableAmount,
      currency: data.currency,
      keyId: data.keyId,
      razorpayOrderId: data.razorpayOrderId,
      amountPaise: data.amountPaise,
      prefill: data.prefill,
      targetPackageTitle: data.targetPackageTitle,
    });
  } catch (error) {
    return bffErrorResponse(error, "Unable to resume this payment right now.");
  }
}
