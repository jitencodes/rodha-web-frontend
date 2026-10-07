import { apiGet } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import {
  mapContinueWatchingItems,
  mapLiveContentItems,
  mapQuickActionItems,
  mapStudentCourseChapterOptions,
  mapStudentCourseDetail,
  mapStudentCourseFilterOptions,
  type AccountCourseChapterOption,
  type AccountCourseContentItem,
  type AccountCourseDetailViewModel,
  type AccountLiveContentItem,
} from "@/lib/api/modules/student/courses/mapper";
import type {
  QuickActionsDataApi,
  QuickActionsQuery,
  StudentCourseChapterOptionsDataApi,
  StudentCourseContentTypeQuery,
  StudentCourseDetailDataApi,
  StudentCourseFilterOptionsDataApi,
  StudentCoursesListDataApi,
  StudentCoursesSortByQuery,
} from "@/lib/api/modules/student/courses/types";
import { parseQuickActionType } from "@/lib/account/course-content-filters";
import type { ContinueWatchingItem } from "@/lib/account/types";

const COURSES_PATH = "api/website/student/courses";

export interface StudentCoursesQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: StudentCoursesSortByQuery | string;
  packageId?: string | number;
  packageIds?: string;
  categoryId?: string | number;
  subCategory1?: string;
  validTillFrom?: string;
  validTillTo?: string;
}

export interface StudentCourseDetailQuery {
  type?: StudentCourseContentTypeQuery | string;
  search?: string;
  page?: number;
  limit?: number;
  completionStatus?: string;
  liveClassStatus?: string;
  resultStatus?: string;
  chapter?: string;
  chapterId?: string;
}

export async function getStudentCourses(
  accessToken: string,
  query: StudentCoursesQuery = {}
): Promise<{
  items: ContinueWatchingItem[];
  todayContents: AccountLiveContentItem[];
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
    validTillFrom: query.validTillFrom,
    validTillTo: query.validTillTo,
  });

  const data = await apiGet<StudentCoursesListDataApi>(`${COURSES_PATH}${qs}`, {
    accessToken,
    cache: "no-store",
  });

  return {
    items: mapContinueWatchingItems(data.items),
    todayContents: mapLiveContentItems(data.todayContents),
    page: data.pagination?.page ?? 1,
    total: data.pagination?.total ?? 0,
    totalPages: data.pagination?.totalPages ?? 1,
  };
}

export async function getStudentCourseDetail(
  accessToken: string,
  courseId: string,
  query: StudentCourseDetailQuery = {}
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

export async function getStudentCourseFilterOptions(
  accessToken: string
): Promise<{
  packages: { value: string; label: string }[];
  categories: { value: string; label: string }[];
  subCategories: { value: string; label: string }[];
  courses: { value: string; label: string }[];
}> {
  try {
    const data = await apiGet<StudentCourseFilterOptionsDataApi>(
      `${COURSES_PATH}/filter-options`,
      { accessToken, cache: "no-store" }
    );
    return mapStudentCourseFilterOptions(data);
  } catch {
    return {
      packages: [],
      categories: [],
      subCategories: [],
      courses: [],
    };
  }
}

export async function getStudentCourseChapterOptions(
  accessToken: string,
  query: { courseId: string; search?: string }
): Promise<AccountCourseChapterOption[]> {
  const qs = buildApiQuery({
    courseId: query.courseId,
    search: query.search,
  });
  try {
    const data = await apiGet<StudentCourseChapterOptionsDataApi>(
      `${COURSES_PATH}/filter-options/chapters${qs}`,
      { accessToken, cache: "no-store" }
    );
    return mapStudentCourseChapterOptions(data.items);
  } catch {
    return [];
  }
}

export type QuickActionsViewModel = {
  type: string;
  items: AccountCourseContentItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export { parseQuickActionType };

export async function getQuickActions(
  accessToken: string,
  query: QuickActionsQuery
): Promise<QuickActionsViewModel> {
  const type = parseQuickActionType(query.type) as StudentCourseContentTypeQuery;
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  const qs = buildApiQuery({
    type,
    search: query.search,
    page,
    limit,
    courseId: query.courseId,
    courseIds: query.courseIds,
    packageId: query.packageId,
    packageIds: query.packageIds,
    completionStatus: query.completionStatus,
    liveClassStatus: query.liveClassStatus,
    resultStatus: query.resultStatus,
  });

  const data = await apiGet<QuickActionsDataApi>(
    `${COURSES_PATH}/quick-actions${qs}`,
    { accessToken, cache: "no-store" }
  );

  const items = mapQuickActionItems(data.items);
  return {
    type: data.type || type,
    items,
    page: data.pagination?.page ?? page,
    limit: data.pagination?.limit ?? limit,
    total: data.pagination?.total ?? items.length,
    totalPages: data.pagination?.totalPages ?? 1,
  };
}
