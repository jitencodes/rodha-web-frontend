import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/server-session";
import {
  refreshEnrollments,
  verifyRazorpayPayment,
} from "@/lib/api/modules/student/cart/service";
import { ApiError } from "@/lib/api/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Please log in to continue." },
      { status: 401 }
    );
  }

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

  try {
    const verified = await verifyRazorpayPayment(accessToken, {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    try {
      await refreshEnrollments(accessToken);
    } catch {
      // non-blocking
    }
    return NextResponse.json({ ok: true, ...verified });
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "Payment verification failed";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
