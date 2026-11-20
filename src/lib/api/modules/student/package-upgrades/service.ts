import { apiGet, apiPost } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import { websiteCategoryHeaders } from "@/lib/api/website-category";
import {
  mapEnrolledPackages,
  mapUpgradeQuote,
} from "./mapper";
import type {
  EnrolledPackagesListApi,
  EnrolledPackageViewModel,
  UpgradeCheckoutResponseApi,
  UpgradeQuoteApi,
  UpgradeQuoteViewModel,
  UpgradeVerifyResponseApi,
} from "./types";
import type { VerifyPaymentRequest } from "@/lib/api/modules/student/cart/types";

const PACKAGES_PATH = "api/website/student/packages";
const UPGRADES_PATH = `${PACKAGES_PATH}/upgrades`;

type CategoryId = number | string | null | undefined;

export async function getStudentEnrolledPackages(
  accessToken: string,
  websiteCategoryId?: CategoryId
): Promise<EnrolledPackageViewModel[]> {
  const data = await apiGet<EnrolledPackagesListApi>(PACKAGES_PATH, {
    accessToken,
    cache: "no-store",
    headers: websiteCategoryHeaders(websiteCategoryId),
  });
  return mapEnrolledPackages(data?.items);
}

export async function getUpgradeQuote(
  accessToken: string,
  params: { sourceEnrollmentId: number | string; targetPackageId: number | string },
  websiteCategoryId?: CategoryId
): Promise<UpgradeQuoteViewModel | null> {
  const qs = buildApiQuery({
    sourceEnrollmentId: params.sourceEnrollmentId,
    targetPackageId: params.targetPackageId,
  });
  const data = await apiGet<UpgradeQuoteApi>(`${UPGRADES_PATH}/quote${qs}`, {
    accessToken,
    cache: "no-store",
    headers: websiteCategoryHeaders(websiteCategoryId),
  });
  return mapUpgradeQuote(data);
}

export type UpgradeCheckoutRequestBody = {
  sourceEnrollmentId: number;
  targetPackageId: number;
  stateName?: string;
  channel?: string;
} & Record<string, string | number | undefined>;

export async function checkoutPackageUpgrade(
  accessToken: string,
  body: UpgradeCheckoutRequestBody,
  websiteCategoryId?: CategoryId
): Promise<UpgradeCheckoutResponseApi> {
  return apiPost<UpgradeCheckoutResponseApi, UpgradeCheckoutRequestBody>(
    `${UPGRADES_PATH}/checkout`,
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

export async function verifyPackageUpgradePayment(
  accessToken: string,
  body: VerifyPaymentRequest,
  websiteCategoryId?: CategoryId
): Promise<UpgradeVerifyResponseApi> {
  return apiPost<UpgradeVerifyResponseApi, VerifyPaymentRequest>(
    `${UPGRADES_PATH}/payments/verify`,
    body,
    {
      accessToken,
      headers: websiteCategoryHeaders(websiteCategoryId),
    }
  );
}
