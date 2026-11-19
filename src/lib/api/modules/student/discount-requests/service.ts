import { apiGet, apiPostFormData } from "@/lib/api/client";
import { websiteCategoryHeaders } from "@/lib/api/website-category";
import { mapDiscountConfig, mapDiscountCurrent } from "./mapper";
import type {
  DiscountConfigApi,
  DiscountConfigViewModel,
  DiscountCurrentViewModel,
  DiscountRequestApi,
  DiscountRequestCurrentApi,
  DiscountRequestFileLinkApi,
  DiscountRequestListApi,
} from "./types";

const BASE_PATH = "api/website/student/discount-requests";

type CategoryId = number | string | null | undefined;

function authed(accessToken: string, categoryId: CategoryId) {
  return {
    accessToken,
    cache: "no-store" as const,
    headers: websiteCategoryHeaders(categoryId),
  };
}

export async function getDiscountRequestConfig(
  accessToken: string,
  categoryId?: CategoryId
): Promise<DiscountConfigViewModel> {
  const data = await apiGet<DiscountConfigApi>(
    `${BASE_PATH}/config`,
    authed(accessToken, categoryId)
  );
  return mapDiscountConfig(data);
}

/** Button state for one package (`canRequest` / `canResubmit` / `request`). */
export async function getCurrentDiscountRequest(
  accessToken: string,
  packageId: number,
  categoryId?: CategoryId
): Promise<DiscountCurrentViewModel> {
  const data = await apiGet<DiscountRequestCurrentApi>(
    `${BASE_PATH}/current?packageId=${encodeURIComponent(String(packageId))}`,
    authed(accessToken, categoryId)
  );
  return mapDiscountCurrent(data);
}

/** Soft-fail variant for page loads — hides the CTA instead of crashing SSR. */
export async function getCurrentDiscountRequestOrNull(
  accessToken: string,
  packageId: number,
  categoryId?: CategoryId
): Promise<DiscountCurrentViewModel | null> {
  try {
    return await getCurrentDiscountRequest(accessToken, packageId, categoryId);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[getCurrentDiscountRequest]", error);
    }
    return null;
  }
}

/** Student's own requests, latest first. */
export async function getMyDiscountRequests(
  accessToken: string,
  categoryId?: CategoryId
): Promise<DiscountRequestApi[]> {
  const data = await apiGet<DiscountRequestListApi>(
    BASE_PATH,
    authed(accessToken, categoryId)
  );
  return data?.items ?? [];
}

export async function getMyDiscountRequest(
  accessToken: string,
  id: number | string,
  categoryId?: CategoryId
): Promise<DiscountRequestApi> {
  return apiGet<DiscountRequestApi>(
    `${BASE_PATH}/${encodeURIComponent(String(id))}`,
    authed(accessToken, categoryId)
  );
}

/** Signed proof link — valid ~5 minutes, never cache. */
export async function getMyDiscountRequestFileLink(
  accessToken: string,
  id: number | string,
  fileId: number | string,
  categoryId?: CategoryId
): Promise<DiscountRequestFileLinkApi> {
  return apiGet<DiscountRequestFileLinkApi>(
    `${BASE_PATH}/${encodeURIComponent(String(id))}/files/${encodeURIComponent(String(fileId))}`,
    authed(accessToken, categoryId)
  );
}

export async function submitDiscountRequest(
  accessToken: string,
  form: FormData,
  categoryId?: CategoryId
): Promise<DiscountRequestApi> {
  return apiPostFormData<DiscountRequestApi>(BASE_PATH, form, {
    accessToken,
    headers: websiteCategoryHeaders(categoryId),
  });
}

export async function resubmitDiscountRequest(
  accessToken: string,
  id: number | string,
  form: FormData,
  categoryId?: CategoryId
): Promise<DiscountRequestApi> {
  return apiPostFormData<DiscountRequestApi>(
    `${BASE_PATH}/${encodeURIComponent(String(id))}/resubmit`,
    form,
    { accessToken, headers: websiteCategoryHeaders(categoryId) }
  );
}
