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

const CART_PATH = "api/website/student/cart";
const CHECKOUT_PATH = "api/website/student/checkout";
const VERIFY_PATH = "api/website/student/payments/verify";
const REFRESH_PATH = "api/website/student/enrollments/refresh";

export async function getStudentCart(
  accessToken: string
): Promise<StudentCartApi> {
  return apiGet<StudentCartApi>(CART_PATH, {
    accessToken,
    cache: "no-store",
  });
}

export async function clearStudentCart(
  accessToken: string
): Promise<StudentCartApi> {
  return apiDelete<StudentCartApi>(CART_PATH, { accessToken });
}

export async function addPackageToCart(
  accessToken: string,
  packageId: number
): Promise<StudentCartApi> {
  return apiPost<StudentCartApi, { packageId: number }>(
    `${CART_PATH}/items`,
    { packageId },
    { accessToken }
  );
}

export async function setCartItemPromocode(
  accessToken: string,
  cartItemId: number | string,
  promocodeId: number | string | null
): Promise<StudentCartApi> {
  return apiPatch<StudentCartApi, { promocodeId: number | string | null }>(
    `${CART_PATH}/items/${cartItemId}`,
    { promocodeId },
    { accessToken }
  );
}

export async function getPackagePromocodes(
  accessToken: string,
  packageId: number | string
): Promise<PackagePromocodesDataApi> {
  return apiGet<PackagePromocodesDataApi>(
    `api/website/student/packages/${packageId}/promocodes`,
    { accessToken, cache: "no-store" }
  );
}

export async function checkoutStudentCart(
  accessToken: string
): Promise<CheckoutResponseApi> {
  return apiPost<CheckoutResponseApi, Record<string, never>>(
    CHECKOUT_PATH,
    {},
    { accessToken }
  );
}

export async function verifyRazorpayPayment(
  accessToken: string,
  body: VerifyPaymentRequest
): Promise<VerifyPaymentResponseApi> {
  return apiPost<VerifyPaymentResponseApi, VerifyPaymentRequest>(
    VERIFY_PATH,
    body,
    { accessToken }
  );
}

export async function refreshEnrollments(
  accessToken: string
): Promise<unknown> {
  return apiPost<unknown, Record<string, never>>(
    REFRESH_PATH,
    {},
    { accessToken }
  );
}
