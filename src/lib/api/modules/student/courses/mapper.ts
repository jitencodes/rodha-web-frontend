import type { ContinueWatchingItem } from "@/lib/account/types";
import type {
  StudentCourseContentItemApi,
  StudentCourseDetailDataApi,
  StudentEnrollmentListItemApi,
} from "@/lib/api/modules/student/courses/types";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return "";
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${hours}h ${rem}m`;
  }
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export function mapContinueWatchingItem(
  item: StudentEnrollmentListItemApi
): ContinueWatchingItem | null {
  const course = item.course;
  if (!course) return null;
  const title = asString(course.title);
  const id = course.id != null ? String(course.id) : "";
  if (!title || !id) return null;

  const percent = asNumber(item.progressPercent ?? item.progress);
  return {
    id,
    title,
    tag: asString(course.language) || "Course",
    thumbnail:
      asString(course.bannerImageUrl) ||
      "/assets/images/placeholders/course-thumb.svg",
    durationLabel: formatDuration(asNumber(item.totalTime)),
    progressCurrent: Math.min(100, Math.max(0, percent)),
    progressTotal: 100,
    progressLabel: `${Math.round(percent)}% complete`,
    href: `/account/courses/${id}`,
  };
}

export function mapContinueWatchingItems(
  items: StudentEnrollmentListItemApi[] | null | undefined
): ContinueWatchingItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(mapContinueWatchingItem)
    .filter((item): item is ContinueWatchingItem => Boolean(item));
}

export type AccountCourseContentItem = {
  id: string;
  title: string;
  type: string;
  completed: boolean;
  takeUrl: string;
  durationLabel?: string;
  children: AccountCourseContentItem[];
};

function mapContentItem(
  item: StudentCourseContentItemApi
): AccountCourseContentItem | null {
  const title = asString(item.title);
  const id = item.id != null ? String(item.id) : asString(item.graphyItemId);
  if (!title || !id) return null;
  const children = Array.isArray(item.items)
    ? item.items
        .map(mapContentItem)
        .filter((child): child is AccountCourseContentItem => Boolean(child))
    : [];

  return {
    id,
    title,
    type: asString(item.type) || "item",
    completed: item.completed === true,
    takeUrl: asString(item.takeUrl),
    durationLabel:
      typeof item.duration === "number"
        ? formatDuration(item.duration)
        : undefined,
    children,
  };
}

export type AccountCourseDetailViewModel = {
  courseId: string;
  title: string;
  instructor?: string;
  language?: string;
  courseTakeUrl: string;
  progressPercent: number;
  contentSummary?: Record<string, number>;
  items: AccountCourseContentItem[];
};

export function mapStudentCourseDetail(
  data: StudentCourseDetailDataApi | null | undefined
): AccountCourseDetailViewModel | null {
  if (!data?.course) return null;
  const course = data.course;
  const title = asString(course.title);
  const courseId = course.id != null ? String(course.id) : "";
  if (!title || !courseId) return null;

  const rawItems = data.items ?? course.items ?? [];
  const items = rawItems
    .map(mapContentItem)
    .filter((item): item is AccountCourseContentItem => Boolean(item));

  return {
    courseId,
    title,
    instructor: asString(course.instructor) || undefined,
    language: asString(course.language) || undefined,
    courseTakeUrl: asString(course.courseTakeUrl),
    progressPercent: asNumber(
      course.progress?.progressPercent ?? course.progress?.averageCompletion
    ),
    contentSummary: course.contentSummary?.byType,
    items,
  };
}
