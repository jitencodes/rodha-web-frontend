import { apiGet } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import {
  mapContinueWatchingItems,
  mapStudentCourseDetail,
  type AccountCourseDetailViewModel,
} from "@/lib/api/modules/student/courses/mapper";
import type {
  QuickActionsDataApi,
  StudentCourseDetailDataApi,
  StudentCoursesListDataApi,
} from "@/lib/api/modules/student/courses/types";
import type { ContinueWatchingItem } from "@/lib/account/types";

const COURSES_PATH = "api/website/student/courses";

export interface StudentCoursesQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  packageId?: string | number;
  packageIds?: string;
  categoryId?: string | number;
  subCategory1?: string;
}

export async function getStudentCourses(
  accessToken: string,
  query: StudentCoursesQuery = {}
): Promise<{
  items: ContinueWatchingItem[];
  page: number;
  total: number;
  totalPages: number;
}> {
  const qs = buildApiQuery({
    page: query.page ?? 1,
    limit: query.limit ?? 10,
    search: query.search,
    sortBy: query.sortBy ?? "continue_watching",
    packageId: query.packageId,
    packageIds: query.packageIds,
    categoryId: query.categoryId,
    subCategory1: query.subCategory1,
  });

  const data = await apiGet<StudentCoursesListDataApi>(`${COURSES_PATH}${qs}`, {
    accessToken,
    cache: "no-store",
  });

  return {
    items: mapContinueWatchingItems(data.items),
    page: data.pagination?.page ?? 1,
    total: data.pagination?.total ?? 0,
    totalPages: data.pagination?.totalPages ?? 1,
  };
}

export async function getStudentCourseDetail(
  accessToken: string,
  courseId: string,
  query: {
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
    completionStatus?: string;
    liveClassStatus?: string;
    resultStatus?: string;
    chapter?: string;
    chapterId?: string;
  } = {}
): Promise<AccountCourseDetailViewModel | null> {
  const qs = buildApiQuery({
    type: query.type,
    search: query.search,
    page: query.page,
    limit: query.limit,
    completionStatus: query.completionStatus,
    liveClassStatus: query.liveClassStatus,
    resultStatus: query.resultStatus,
    chapter: query.chapter,
    chapterId: query.chapterId,
  });

  const data = await apiGet<StudentCourseDetailDataApi>(
    `${COURSES_PATH}/${encodeURIComponent(courseId)}${qs}`,
    { accessToken, cache: "no-store" }
  );
  return mapStudentCourseDetail(data);
}

export async function getQuickActions(
  accessToken: string,
  type: "videos" | "quizzes" | "pdfs" | "live-classes",
  page = 1,
  limit = 10
) {
  const qs = buildApiQuery({ type, page, limit });
  return apiGet<QuickActionsDataApi>(`${COURSES_PATH}/quick-actions${qs}`, {
    accessToken,
    cache: "no-store",
  });
}
