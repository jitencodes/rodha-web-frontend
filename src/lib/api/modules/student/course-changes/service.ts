import { apiGet, apiPost } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import { ApiError } from "@/lib/api/types";
import { websiteCategoryHeaders } from "@/lib/api/website-category";
import {
  COURSE_CHANGE_PAGE_SIZE,
  mapCourseChangeOptions,
  mapCourseChangeRequests,
  mapCourseChangeSummary,
} from "./mapper";
import type {
  CourseChangeEligibilityApi,
  CourseChangeOptionsQuery,
  CourseChangeOptionsViewModel,
  CourseChangeRequestApi,
  CourseChangeRequestsApi,
  CourseChangeRequestsQuery,
  CourseChangeSubmitBody,
  CourseChangeSummary,
} from "./types";

const BASE_PATH = "api/website/student/course-changes";

function authed(accessToken: string) {
  return {
    accessToken,
    cache: "no-store" as const,
    headers: websiteCategoryHeaders(),
  };
}

/** Requests left / blocked state (no listing). */
export async function getCourseChangeSummary(
  accessToken: string
): Promise<CourseChangeSummary> {
  const data = await apiGet<CourseChangeEligibilityApi>(
    `${BASE_PATH}/eligibility`,
    authed(accessToken)
  );
  return mapCourseChangeSummary(data);
}

/** Courses the student may switch to from one course. */
export async function getCourseChangeOptions(
  accessToken: string,
  query: CourseChangeOptionsQuery
): Promise<CourseChangeOptionsViewModel> {
  const limit = query.limit ?? COURSE_CHANGE_PAGE_SIZE;
  const qs = buildApiQuery({
    packageId: query.packageId,
    fromCourseId: query.courseId,
    search: query.search?.trim(),
    language: query.language,
    sortBy: query.sort ? "title" : undefined,
    sortOrder: query.sort ? (query.sort === "title_desc" ? "desc" : "asc") : undefined,
    page: query.page ?? 1,
    limit,
  });

  let data: CourseChangeEligibilityApi | null = null;
  try {
    data = await apiGet<CourseChangeEligibilityApi>(
      `${BASE_PATH}/eligibility${qs}`,
      authed(accessToken)
    );
  } catch (error) {
    // Listing params not accepted yet → fall through to the plain call.
    if (!(error instanceof ApiError) || error.status !== 400) throw error;
  }

  if (!Array.isArray(data?.options?.items) && (data == null || query.packageId != null)) {
    // Without server listing, read every package so the package filter is complete.
    data = await apiGet<CourseChangeEligibilityApi>(
      `${BASE_PATH}/eligibility`,
      authed(accessToken)
    );
  }
  const view = mapCourseChangeOptions(data, { ...query, limit });
  return {
    ...view,
    pendingForCourse: await isPendingForCourse(
      accessToken,
      view.summary.pendingRequestId,
      query.courseId
    ),
  };
}

/**
 * Eligibility is per student, so `pendingRequestId` may belong to another
 * course; only the history says which one.
 */
async function isPendingForCourse(
  accessToken: string,
  pendingRequestId: number | null,
  courseId: number
): Promise<boolean> {
  if (pendingRequestId == null) return false;
  try {
    // Newest first, and nothing can be raised after an open request.
    const { items } = await getCourseChangeRequests(accessToken);
    return items.some(
      (item) => item.id === pendingRequestId && item.fromCourseId === courseId
    );
  } catch {
    return false;
  }
}

export async function getCourseChangeRequests(
  accessToken: string,
  query: CourseChangeRequestsQuery = {}
) {
  const qs = buildApiQuery({
    status: query.status,
    search: query.search?.trim(),
    page: query.page ?? 1,
    limit: query.limit ?? 10,
  });
  let data: CourseChangeRequestsApi;
  try {
    data = await apiGet<CourseChangeRequestsApi>(
      `${BASE_PATH}/requests${qs}`,
      authed(accessToken)
    );
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 400) throw error;
    data = await apiGet<CourseChangeRequestsApi>(
      `${BASE_PATH}/requests`,
      authed(accessToken)
    );
  }
  return mapCourseChangeRequests(data, query);
}

export async function submitCourseChange(
  accessToken: string,
  body: CourseChangeSubmitBody
): Promise<void> {
  await apiPost<CourseChangeRequestApi, CourseChangeSubmitBody>(
    `${BASE_PATH}/requests`,
    body,
    { accessToken, headers: websiteCategoryHeaders() }
  );
}

export async function cancelCourseChange(
  accessToken: string,
  requestId: number
): Promise<void> {
  await apiPost<CourseChangeRequestApi, Record<string, never>>(
    `${BASE_PATH}/requests/${requestId}/cancel`,
    {},
    { accessToken, headers: websiteCategoryHeaders() }
  );
}
