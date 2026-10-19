import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAccessToken } from "@/lib/auth/server-session";
import {
  checkoutStudentCart,
  refreshEnrollments,
} from "@/lib/api/modules/student/cart/service";
import { ApiError } from "@/lib/api/types";
import { parseUtmCookie, UTM_COOKIE_NAME } from "@/lib/tracking/utm";

export const runtime = "nodejs";

export async function POST() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Please log in to continue." },
      { status: 401 }
    );
  }

  try {
    const jar = await cookies();
    const utm = parseUtmCookie(jar.get(UTM_COOKIE_NAME)?.value);
    const checkout = await checkoutStudentCart(accessToken, utm);
    if ((checkout.mode || "").toLowerCase() === "free") {
      try {
        await refreshEnrollments(accessToken);
      } catch {
        // non-blocking
      }
    }
    return NextResponse.json({
      ok: true,
      mode: checkout.mode,
      orderId: checkout.orderId,
      orderNumber: checkout.orderNumber,
      status: checkout.status,
      payableAmount: checkout.payableAmount,
      currency: checkout.currency,
      keyId: checkout.keyId,
      razorpayOrderId: checkout.razorpayOrderId,
      amountPaise: checkout.amountPaise,
      prefill: checkout.prefill,
      invoice: checkout.invoice,
    });
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Checkout failed";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
