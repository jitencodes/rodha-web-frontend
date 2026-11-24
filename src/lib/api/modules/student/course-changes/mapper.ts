import { paginateItems } from "@/lib/account/pagination";
import type { ContinueWatchingItem } from "@/lib/account/types";
import { COURSE_IMAGE_FALLBACK } from "@/lib/constants";
import type {
  CourseChangeBlockedReason,
  CourseChangeCourseApi,
  CourseChangeEligibilityApi,
  CourseChangeFilterOption,
  CourseChangeOptionsQuery,
  CourseChangeOptionsViewModel,
  CourseChangePackageApi,
  CourseChangeRequestApi,
  CourseChangeRequestsApi,
  CourseChangeRequestsQuery,
  CourseChangeRequestViewModel,
  CourseChangeSummary,
} from "./types";

export const COURSE_CHANGE_PAGE_SIZE = 6;
export const COURSE_CHANGE_REASON_MAX = 1000;

export const COURSE_CHANGE_STATUS_OPTIONS: CourseChangeFilterOption[] = [
  { value: "PENDING", label: "Under review" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
];

const BLOCKED_REASONS: readonly CourseChangeBlockedReason[] = [
  "DISABLED",
  "PENDING_EXISTS",
  "MAX_REACHED",
  "COOLDOWN",
];

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export function mapCourseChangeSummary(
  data: CourseChangeEligibilityApi | null | undefined
): CourseChangeSummary {
  const blockedReason =
    BLOCKED_REASONS.find((reason) => reason === data?.blockedReason) ?? null;
  return {
    enabled: data?.enabled === true,
    canRequest: data?.canRequest === true,
    blockedReason,
    blockedMessage: asString(data?.blockedMessage),
    nextAllowedLabel: formatDate(data?.nextAllowedAt),
    max: asCount(data?.max),
    remaining: asCount(data?.remaining),
    pendingRequestId:
      typeof data?.pendingRequestId === "number" ? data.pendingRequestId : null,
  };
}

/** Option → the Continue Watching card model (no progress yet). */
function mapOptionCard(
  course: CourseChangeCourseApi
): ContinueWatchingItem | null {
  const title = asString(course.title);
  if (typeof course.id !== "number" || !title) return null;
  const language = asString(course.language);
  return {
    id: String(course.id),
    title,
    tag: language || "Course",
    thumbnail: asString(course.bannerImageUrl) || COURSE_IMAGE_FALLBACK,
    language: language || undefined,
    progressCurrent: 0,
    progressTotal: 0,
    progressLabel: "",
    href: "",
  };
}

function mapOptionCards(
  courses: CourseChangeCourseApi[] | null | undefined
): ContinueWatchingItem[] {
  return (courses ?? [])
    .map(mapOptionCard)
    .filter((item): item is ContinueWatchingItem => item != null);
}

function packageOption(
  pkg: CourseChangePackageApi | null | undefined
): CourseChangeFilterOption | null {
  return typeof pkg?.id === "number"
    ? { value: String(pkg.id), label: asString(pkg.title) || `Package ${pkg.id}` }
    : null;
}

function isOption(
  option: CourseChangeFilterOption | null
): option is CourseChangeFilterOption {
  return option != null;
}

function languageOptions(
  languages: Array<string | null | undefined>
): CourseChangeFilterOption[] {
  const unique = [...new Set(languages.map(asString).filter(Boolean))].sort();
  return unique.map((language) => ({ value: language, label: language }));
}

/**
 * Listing for the change dialog. Uses the paginated `options` block when the
 * API sends it, otherwise filters and pages `packages[].courses[].options`.
 */
export function mapCourseChangeOptions(
  data: CourseChangeEligibilityApi | null | undefined,
  query: CourseChangeOptionsQuery
): CourseChangeOptionsViewModel {
  const summary = mapCourseChangeSummary(data);
  const limit = query.limit ?? COURSE_CHANGE_PAGE_SIZE;

  if (Array.isArray(data?.options?.items)) {
    const { options } = data;
    const items = mapOptionCards(options.items);
    const total = options.pagination?.total ?? items.length;
    const current = packageOption(options.package);
    const packages = (options.filters?.packages ?? [])
      .map(packageOption)
      .filter(isOption);
    return {
      summary,
      pendingForCourse: false,
      changeable: total > 0 || current != null,
      packageId: options.package?.id ?? null,
      packageTitle: current?.label ?? "",
      packageOptions: packages.length ? packages : [current].filter(isOption),
      languageOptions: languageOptions(options.filters?.languages ?? []),
      items,
      page: options.pagination?.page ?? query.page ?? 1,
      total,
      totalPages: Math.max(
        1,
        options.pagination?.totalPages ?? Math.ceil(total / limit)
      ),
    };
  }

  const groups = (data?.packages ?? []).flatMap((entry) => {
    const match = entry.courses?.find(
      (course) => course.course?.id === query.courseId
    );
    const option = packageOption(entry.package);
    return match?.options?.length && option
      ? [{ option, courses: match.options }]
      : [];
  });
  const group =
    groups.find((entry) => entry.option.value === String(query.packageId ?? "")) ??
    groups[0];

  const search = query.search?.trim().toLowerCase() ?? "";
  let courses = (group?.courses ?? []).filter(
    (course) =>
      (!search || asString(course.title).toLowerCase().includes(search)) &&
      (!query.language || asString(course.language) === query.language)
  );
  if (query.sort) {
    const direction = query.sort === "title_desc" ? -1 : 1;
    courses = [...courses].sort(
      (a, b) =>
        direction *
        asString(a.title).localeCompare(asString(b.title), "en", { numeric: true })
    );
  }
  const paged = paginateItems(mapOptionCards(courses), query.page ?? 1, limit);

  return {
    summary,
    pendingForCourse: false,
    changeable: group != null,
    packageId: group ? Number(group.option.value) : null,
    packageTitle: group?.option.label ?? "",
    packageOptions: groups.map((entry) => entry.option),
    languageOptions: languageOptions(
      (group?.courses ?? []).map((course) => course.language)
    ),
    ...paged,
  };
}

export function mapCourseChangeRequest(
  request: CourseChangeRequestApi | null | undefined
): CourseChangeRequestViewModel | null {
  if (typeof request?.id !== "number") return null;
  const raw = asString(request.status).toUpperCase();
  // A failed approval is still "under review" for the student.
  const status =
    raw === "APPROVED" || raw === "REJECTED" || raw === "CANCELLED"
      ? raw
      : "PENDING";
  return {
    id: request.id,
    status,
    statusLabel:
      COURSE_CHANGE_STATUS_OPTIONS.find((option) => option.value === status)
        ?.label ?? status,
    reason: asString(request.reason),
    adminRemark: status === "REJECTED" ? asString(request.adminRemark) : "",
    packageTitle: asString(request.package?.title),
    fromCourseId:
      typeof request.fromCourse?.id === "number" ? request.fromCourse.id : null,
    fromTitle: asString(request.fromCourse?.title) || "Course",
    fromImageUrl: asString(request.fromCourse?.bannerImageUrl) || COURSE_IMAGE_FALLBACK,
    toTitle: asString(request.toCourse?.title) || "Course",
    toImageUrl: asString(request.toCourse?.bannerImageUrl) || COURSE_IMAGE_FALLBACK,
    requestedLabel: formatDate(request.createdAt),
    closedLabel: formatDate(request.reviewedAt ?? request.cancelledAt),
    canCancel: raw === "PENDING",
  };
}

/** History page: server pagination when present, else filtered and paged here. */
export function mapCourseChangeRequests(
  data: CourseChangeRequestsApi | null | undefined,
  query: CourseChangeRequestsQuery
): {
  items: CourseChangeRequestViewModel[];
  page: number;
  total: number;
  totalPages: number;
} {
  const items = (data?.items ?? [])
    .map(mapCourseChangeRequest)
    .filter((item): item is CourseChangeRequestViewModel => item != null);

  if (data?.pagination) {
    const total = data.pagination.total ?? items.length;
    return {
      items,
      page: data.pagination.page ?? query.page ?? 1,
      total,
      totalPages: Math.max(1, data.pagination.totalPages ?? 1),
    };
  }

  const search = query.search?.trim().toLowerCase() ?? "";
  const filtered = items.filter(
    (item) =>
      (!query.status || item.status === query.status) &&
      (!search ||
        [item.fromTitle, item.toTitle, item.packageTitle].some((text) =>
          text.toLowerCase().includes(search)
        ))
  );
  return paginateItems(filtered, query.page ?? 1, query.limit ?? 10);
}
