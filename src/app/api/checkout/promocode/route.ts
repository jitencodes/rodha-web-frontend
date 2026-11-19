import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/server-session";
import { promocodeOfferLabel } from "@/lib/api/modules/student/cart/mapper";
import {
  setCartItemPromocode,
  type CartItemPromocodeBody,
} from "@/lib/api/modules/student/cart/service";
import { bffErrorResponse } from "@/lib/http/bff-response";

export const runtime = "nodejs";

const CODE_MAX = 100;

function readId(value: unknown): string | number | null {
  return typeof value === "string" || typeof value === "number" ? value : null;
}

/**
 * Apply / remove a cart item promocode.
 * Body: `{ cartItemId, code }` (typed) or `{ cartItemId, promocodeId }` (listed; `null` removes),
 * plus optional `websiteCategoryId` for the `x-website-category-id` header.
 * Errors keep the API status: 400 (invalid / expired / not eligible), 409 (usage limit).
 */
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

  const payload = (body ?? {}) as Record<string, unknown>;
  const cartItemId = readId(payload.cartItemId);
  const code =
    typeof payload.code === "string" ? payload.code.trim().slice(0, CODE_MAX) : "";
  const promocodeId =
    payload.promocodeId === null ? null : readId(payload.promocodeId) ?? undefined;

  let update: CartItemPromocodeBody | null = null;
  if (code) update = { code };
  else if (promocodeId !== undefined) update = { promocodeId };

  if (cartItemId == null || !update) {
    return NextResponse.json(
      { ok: false, error: "Enter a coupon code." },
      { status: 400 }
    );
  }

  try {
    const cart = await setCartItemPromocode(
      accessToken,
      cartItemId,
      update,
      readId(payload.websiteCategoryId)
    );
    const item =
      cart.items?.find((entry) => String(entry.id) === String(cartItemId)) ??
      cart.items?.[0];
    return NextResponse.json({
      ok: true,
      totals: {
        subtotalAmount: cart.totals?.subtotalAmount ?? 0,
        discountAmount: cart.totals?.discountAmount ?? 0,
        payableAmount: cart.totals?.payableAmount ?? 0,
      },
      code: item?.promocode?.code ?? null,
      offerLabel: item?.promocode ? promocodeOfferLabel(item.promocode) : "",
      itemPayableAmount: item?.payableAmount ?? null,
    });
  } catch (error) {
    return bffErrorResponse(error, "Unable to update coupon");
  }
}
