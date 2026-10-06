import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/server-session";
import { setCartItemPromocode } from "@/lib/api/modules/student/cart/service";
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
  const cartItemId =
    typeof payload.cartItemId === "string" || typeof payload.cartItemId === "number"
      ? payload.cartItemId
      : null;
  const promocodeId =
    payload.promocodeId === null
      ? null
      : typeof payload.promocodeId === "string" ||
          typeof payload.promocodeId === "number"
        ? payload.promocodeId
        : undefined;

  if (cartItemId == null || promocodeId === undefined) {
    return NextResponse.json(
      { ok: false, error: "cartItemId and promocodeId are required." },
      { status: 400 }
    );
  }

  try {
    const cart = await setCartItemPromocode(
      accessToken,
      cartItemId,
      promocodeId
    );
    const item = cart.items?.[0];
    return NextResponse.json({
      ok: true,
      totals: {
        subtotalAmount: cart.totals?.subtotalAmount ?? 0,
        discountAmount: cart.totals?.discountAmount ?? 0,
        payableAmount: cart.totals?.payableAmount ?? 0,
      },
      code: item?.promocode?.code ?? null,
    });
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Unable to update coupon";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
