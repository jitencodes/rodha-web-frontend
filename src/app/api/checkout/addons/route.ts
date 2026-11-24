import { NextResponse } from "next/server";
import { readAddonIds } from "@/lib/api/modules/addons/mapper";
import {
  addPackageToCart,
  removeCartItem,
  setCartItemAddons,
} from "@/lib/api/modules/student/cart/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { mapCheckoutCart } from "@/lib/checkout/map-cart";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

function readId(value: unknown): string | number | null {
  return (typeof value === "string" && value.trim()) || typeof value === "number"
    ? (value as string | number)
    : null;
}

/**
 * Replace the add-ons of the checkout line.
 * Body: `{ cartItemId, addonIds }`, or `{ packageId, addonIds }` when there is
 * no line yet (add-ons for an owned package). `packageOwned` lets an empty
 * selection drop the line, which the API does not accept as `[]`.
 */
export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  if (!Array.isArray(payload.addonIds)) {
    return NextResponse.json(
      { ok: false, error: "Select an add-on to continue." },
      { status: 400 }
    );
  }
  const addonIds = readAddonIds(payload.addonIds);
  const cartItemId = readId(payload.cartItemId);
  const packageId = Number(readId(payload.packageId));
  const websiteCategoryId = readId(payload.websiteCategoryId);

  try {
    if (cartItemId != null) {
      const cart =
        addonIds.length === 0 && payload.packageOwned === true
          ? await removeCartItem(accessToken, cartItemId, websiteCategoryId)
          : await setCartItemAddons(
              accessToken,
              cartItemId,
              addonIds,
              websiteCategoryId
            );
      return NextResponse.json({ ok: true, cart: mapCheckoutCart(cart) });
    }

    if (!Number.isInteger(packageId) || packageId <= 0 || addonIds.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Select an add-on to continue." },
        { status: 400 }
      );
    }
    const cart = await addPackageToCart(
      accessToken,
      packageId,
      websiteCategoryId,
      addonIds
    );
    return NextResponse.json({ ok: true, cart: mapCheckoutCart(cart) });
  } catch (error) {
    return bffErrorResponse(error, "Unable to update add-ons");
  }
}
