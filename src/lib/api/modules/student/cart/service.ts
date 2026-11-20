import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "@/lib/api/client";
import type {
  CheckoutResponseApi,
  PackagePromocodesDataApi,
  StudentCartApi,
  VerifyPaymentRequest,
  VerifyPaymentResponseApi,
} from "@/lib/api/modules/student/cart/types";
import { websiteCategoryHeaders } from "@/lib/api/website-category";

const CART_PATH = "api/website/student/cart";
const CHECKOUT_PATH = "api/website/student/checkout";
const VERIFY_PATH = "api/website/student/payments/verify";

export async function getStudentCart(
  accessToken: string,
  websiteCategoryId?: number | string | null
): Promise<StudentCartApi> {
  return apiGet<StudentCartApi>(CART_PATH, {
    accessToken,
    cache: "no-store",
    headers: websiteCategoryHeaders(websiteCategoryId),
  });
}

export async function clearStudentCart(
  accessToken: string,
  websiteCategoryId?: number | string | null
): Promise<StudentCartApi> {
  return apiDelete<StudentCartApi>(CART_PATH, {
    accessToken,
    headers: websiteCategoryHeaders(websiteCategoryId),
  });
}

export async function addPackageToCart(
  accessToken: string,
  packageId: number,
  websiteCategoryId?: number | string | null
): Promise<StudentCartApi> {
  return apiPost<StudentCartApi, { packageId: number }>(
    `${CART_PATH}/items`,
    { packageId },
    { accessToken, headers: websiteCategoryHeaders(websiteCategoryId) }
  );
}

/** Exactly one of `code` (typed, case-insensitive) or `promocodeId` (listed / `null` = remove). */
export type CartItemPromocodeBody =
  | { code: string }
  | { promocodeId: number | string | null };

export async function setCartItemPromocode(
  accessToken: string,
  cartItemId: number | string,
  body: CartItemPromocodeBody,
  websiteCategoryId?: number | string | null
): Promise<StudentCartApi> {
  return apiPatch<StudentCartApi, CartItemPromocodeBody>(
    `${CART_PATH}/items/${cartItemId}`,
    body,
    { accessToken, headers: websiteCategoryHeaders(websiteCategoryId) }
  );
}

export async function getPackagePromocodes(
  accessToken: string,
  packageId: number | string,
  websiteCategoryId?: number | string | null
): Promise<PackagePromocodesDataApi> {
  return apiGet<PackagePromocodesDataApi>(
    `api/website/student/packages/${packageId}/promocodes`,
    {
      accessToken,
      cache: "no-store",
      headers: websiteCategoryHeaders(websiteCategoryId),
    }
  );
}

/** UTM fields plus an optional checkout-only `stateName`. Does not update the profile. */
export async function checkoutStudentCart(
  accessToken: string,
  body: Record<string, string> = {},
  websiteCategoryId?: number | string | null
): Promise<CheckoutResponseApi> {
  return apiPost<CheckoutResponseApi, Record<string, string>>(
    CHECKOUT_PATH,
    { ...body, channel: "WEB" },
    {
      accessToken,
      headers: {
        "x-channel": "WEB",
        ...websiteCategoryHeaders(websiteCategoryId),
      },
    }
  );
}

export async function verifyRazorpayPayment(
  accessToken: string,
  body: VerifyPaymentRequest,
  websiteCategoryId?: number | string | null
): Promise<VerifyPaymentResponseApi> {
  return apiPost<VerifyPaymentResponseApi, VerifyPaymentRequest>(
    VERIFY_PATH,
    body,
    { accessToken, headers: websiteCategoryHeaders(websiteCategoryId) }
  );
}
