import { apiGet } from "@/lib/api/client";
import {
  getApiBaseUrl,
  getApiKey,
  getApiSource,
} from "@/lib/api/env";
import { ApiError } from "@/lib/api/types";
import {
  mapContinueWatchingItems,
  mapLiveContentItems,
  type AccountLiveContentItem,
} from "@/lib/api/modules/student/courses/mapper";
import type { StudentLiveContentApi } from "@/lib/api/modules/student/courses/types";
import type {
  ContinueWatchingItem,
  LearningProgress,
  RecommendedProduct,
} from "@/lib/account/types";
import { COURSE_IMAGE_FALLBACK } from "@/lib/constants";
import {
  packageBuyNowHref,
  packageViewCourseHref,
} from "@/lib/packages/buy-now";
import {
  EMPTY_REGISTRATION_STATUS,
  isRegistrationRequiredBody,
  mapDashboardRegistration,
  mapRegistrationRequiredErrors,
} from "./mapper";
import type {
  DashboardRegistrationApi,
  DashboardStatusResult,
  StudentRegistrationStatusViewModel,
} from "./types";

export type { StudentRegistrationStatusViewModel } from "./types";

interface DashboardApi {
  courseStats?: {
    completed?: number;
    inProgress?: number;
    notStarted?: number;
    total?: number;
    learningProgressPercentage?: number;
  };
  todayContents?: StudentLiveContentApi[] | null;
  continueWatching?: unknown[];
  recommended?: Array<{
    type?: string;
    id?: number | string;
    slug?: string;
    title?: string;
    bannerImageUrl?: string | null;
    language?: string | null;
    price?: number | null;
    discountedPrice?: number | null;
    promocode?: {
      code?: string | null;
      discount?: number | string | null;
    } | null;
    isSelfEnrolled?: boolean | null;
  }>;
  latestOrders?: unknown[];
  registration?: DashboardRegistrationApi | null;
}

export interface StudentDashboardViewModel {
  todayContents: AccountLiveContentItem[];
  continueWatching: ContinueWatchingItem[];
  recommended: RecommendedProduct[];
  learningProgress: LearningProgress;
  registration: StudentRegistrationStatusViewModel;
}

function asNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function emptyDashboard(
  registration: StudentRegistrationStatusViewModel = EMPTY_REGISTRATION_STATUS
): StudentDashboardViewModel {
  return {
    todayContents: [],
    continueWatching: [],
    recommended: [],
    learningProgress: {
      percent: 0,
      completed: 0,
      inProgress: 0,
      notStarted: 0,
      title: "Learning Progress",
      encouragement: "Keep going — consistency wins.",
    },
    registration,
  };
}

function mapDashboardPayload(data: DashboardApi): StudentDashboardViewModel {
  const stats = data.courseStats ?? {};
  const continueWatching = mapContinueWatchingItems(
    data.continueWatching as never
  );

  const recommended: RecommendedProduct[] = [];
  for (const item of data.recommended ?? []) {
    const title = typeof item.title === "string" ? item.title.trim() : "";
    const id = item.id != null ? String(item.id) : "";
    const slug = typeof item.slug === "string" ? item.slug : "";
    if (!title || !id) continue;
    const price = asNumber(item.discountedPrice ?? item.price);
    const appliedCouponCode =
      typeof item.promocode?.code === "string"
        ? item.promocode?.code.trim()
        : undefined;
    const original = asNumber(item.price);
    const discountPercent =
      original > price && original > 0
        ? Math.round(((original - price) / original) * 100)
        : 0;
    const isSelfEnrolled = item.isSelfEnrolled === true;
    recommended.push({
      id,
      title,
      tag: typeof item.language === "string" ? item.language : "Package",
      thumbnail:
        (typeof item.bannerImageUrl === "string" && item.bannerImageUrl) ||
        COURSE_IMAGE_FALLBACK,
      price,
      originalPrice: original > price ? original : price,
      discountPercent,
      appliedCouponCode,
      href: slug ? `/courses/${slug}` : "/courses",
      ctaHref: isSelfEnrolled
        ? packageViewCourseHref(id)
        : packageBuyNowHref(id, slug || undefined),
      ctaLabel: isSelfEnrolled ? "View Course" : "Buy Now",
      isSelfEnrolled,
      productType: "course",
    });
  }

  return {
    todayContents: mapLiveContentItems(data.todayContents),
    continueWatching,
    recommended,
    learningProgress: {
      percent: asNumber(stats.learningProgressPercentage),
      completed: asNumber(stats.completed),
      inProgress: asNumber(stats.inProgress),
      notStarted: asNumber(stats.notStarted),
      title: "Learning Progress",
      encouragement: "Keep going — consistency wins.",
    },
    registration: mapDashboardRegistration(data.registration),
  };
}

/**
 * Soft-block-aware dashboard status fetch for the registration gate.
 * Handles HTTP 201 + success:false + REGISTRATION_REQUIRED.
 */
export async function fetchStudentDashboardRegistrationStatus(
  accessToken: string
): Promise<DashboardStatusResult> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    return { ok: false, registration: null };
  }

  const headers: HeadersInit = {
    Accept: "application/json",
    "x-source": getApiSource(),
    Authorization: `Bearer ${accessToken}`,
  };
  const apiKey = getApiKey();
  if (apiKey) headers["x-api-key"] = apiKey;

  let response: Response;
  try {
    response = await fetch(`${baseUrl}api/website/student/dashboard`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
  } catch {
    return { ok: false, registration: null };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return { ok: false, registration: null };
  }

  if (response.status === 401 || response.status === 403) {
    return { ok: false, unauthorized: true, registration: null };
  }

  if (isRegistrationRequiredBody(body)) {
    const errors =
      body && typeof body === "object"
        ? (body as { errors?: unknown }).errors
        : null;
    return {
      ok: true,
      registration: mapRegistrationRequiredErrors(errors),
    };
  }

  if (!response.ok) {
    return { ok: false, registration: null };
  }

  const envelope = body as {
    success?: boolean;
    data?: DashboardApi;
  };
  if (envelope.success !== true) {
    return { ok: false, registration: null };
  }

  return {
    ok: true,
    registration: mapDashboardRegistration(envelope.data?.registration),
  };
}

export async function getStudentDashboard(
  accessToken: string
): Promise<StudentDashboardViewModel> {
  try {
    const data = await apiGet<DashboardApi>("api/website/student/dashboard", {
      accessToken,
      cache: "no-store",
    });
    return mapDashboardPayload(data ?? {});
  } catch (error) {
    if (error instanceof ApiError && isRegistrationRequiredBody(error.body)) {
      const body = error.body as { errors?: unknown };
      return emptyDashboard(mapRegistrationRequiredErrors(body.errors));
    }
    throw error;
  }
}
