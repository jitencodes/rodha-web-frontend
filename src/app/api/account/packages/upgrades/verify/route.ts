import { NextResponse } from "next/server";
import { verifyPackageUpgradePayment } from "@/lib/api/modules/student/package-upgrades/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

/** Verify Razorpay payment for a package upgrade. */
export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const razorpay_order_id =
    typeof payload.razorpay_order_id === "string"
      ? payload.razorpay_order_id
      : "";
  const razorpay_payment_id =
    typeof payload.razorpay_payment_id === "string"
      ? payload.razorpay_payment_id
      : "";
  const razorpay_signature =
    typeof payload.razorpay_signature === "string"
      ? payload.razorpay_signature
      : "";

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { ok: false, error: "Missing Razorpay payment fields." },
      { status: 400 }
    );
  }

  const websiteCategoryId =
    typeof payload.websiteCategoryId === "number" ||
    typeof payload.websiteCategoryId === "string"
      ? payload.websiteCategoryId
      : null;

  try {
    const verified = await verifyPackageUpgradePayment(
      accessToken,
      {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
      websiteCategoryId
    );
    return NextResponse.json({ ok: true, ...verified });
  } catch (error) {
    return bffErrorResponse(error, "Upgrade payment verification failed");
  }
}
