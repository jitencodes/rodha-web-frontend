import type { ContinueWatchingItem } from "@/lib/account/types";
import type {
  StudentCourseChapterApi,
  StudentCourseContentItemApi,
  StudentCourseDetailDataApi,
  StudentCourseFilterOptionApi,
  StudentCourseFilterOptionsDataApi,
  StudentEnrollmentListItemApi,
} from "@/lib/api/modules/student/courses/types";
import { COURSE_IMAGE_FALLBACK } from "@/lib/constants";

const SUPPORTED_CONTENT_TYPES = new Set([
  "video",
  "quiz",
  "pdf",
  "liveclass",
]);

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

function asOptionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number.parseFloat(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function formatDuration(totalSeconds: number): string | undefined {
  if (!totalSeconds || totalSeconds <= 0) return undefined;
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${hours}h ${rem}m`;
  }
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function mapFilterOption(
  option: StudentCourseFilterOptionApi
): { value: string; label: string } | null {
  const value = asString(
    option.value ??
      (option.id != null ? String(option.id) : undefined) ??
      option.slug
  );
  const label = asString(option.label ?? option.name ?? option.title ?? value);
  if (!value || !label) return null;
  return { value, label };
}

export function mapContinueWatchingItem(
  item: StudentEnrollmentListItemApi
): ContinueWatchingItem | null {
  const course = item.course;
  if (!course) return null;
  const title = asString(course.title);
  const id = course.id != null ? String(course.id) : "";
  if (!title || !id) return null;

  const percent = asOptionalNumber(item.progressPercent ?? item.progress);
  const durationLabel = formatDuration(asNumber(item.totalTime)) ?? "";

  return {
    id,
    title,
    tag: asString(course.language) || "Course",
    thumbnail: asString(course.bannerImageUrl) || COURSE_IMAGE_FALLBACK,
    durationLabel,
    progressCurrent:
      percent !== undefined ? Math.min(100, Math.max(0, percent)) : 0,
    progressTotal: 100,
    progressLabel:
      percent !== undefined ? `${Math.round(percent)}% complete` : "",
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
  chapterId?: string;
  chapterTitle?: string;
  liveClassStatus?: string;
  quizResultStatus?: string;
  quizMarksObtained?: number;
  pages?: number;
  questions?: number;
};

export type AccountCourseChapterOption = {
  id: string;
  title: string;
};

export type AccountCourseDetailViewModel = {
  courseId: string;
  title: string;
  instructor?: string;
  language?: string;
  categoryLabel?: string;
  syllabus?: string;
  courseTakeUrl: string;
  /** Present only when API provided a numeric progress value (including 0). */
  progressPercent?: number;
  learningStatus?: string;
  completed?: boolean;
  totalTimeLabel?: string;
  validTill?: string;
  startDate?: string;
  lastAccessDate?: string;
  contentTotal?: number;
  contentSummary: {
    video: number;
    quiz: number;
    pdf: number;
    liveclass: number;
  };
  chapters: AccountCourseChapterOption[];
  items: AccountCourseContentItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

function mapChapterOption(
  chapter: StudentCourseChapterApi
): AccountCourseChapterOption | null {
  const id = chapter.id != null ? String(chapter.id) : "";
  const title = asString(chapter.title);
  if (!id || !title) return null;
  return { id, title };
}

function mapContentLeaf(
  item: StudentCourseContentItemApi
): AccountCourseContentItem | null {
  const title = asString(item.title);
  const id = item.id != null ? String(item.id) : asString(item.graphyItemId);
  if (!title || !id) return null;

  const type = asString(item.type).toLowerCase() || "item";
  if (type === "heading") return null;

  const chapterId =
    item.chapter?.id != null ? String(item.chapter.id) : undefined;
  const chapterTitle = asString(item.chapter?.title) || undefined;
  const marks = asOptionalNumber(item.quizMarksObtained);
  const pages = asOptionalNumber(item.pages);
  const questions = asOptionalNumber(item.questions);
  const liveClassStatus = asString(item.liveClassStatus) || undefined;
  const quizResultStatus = asString(item.quizResultStatus) || undefined;
  const durationLabel =
    typeof item.duration === "number"
      ? formatDuration(item.duration)
      : undefined;

  return {
    id,
    title,
    type,
    completed: item.completed === true,
    takeUrl: asString(item.takeUrl),
    durationLabel,
    chapterId,
    chapterTitle,
    liveClassStatus,
    quizResultStatus,
    quizMarksObtained: marks,
    pages,
    questions,
  };
}

function collectSupportedLeaves(
  nodes: StudentCourseContentItemApi[] | null | undefined
): AccountCourseContentItem[] {
  if (!Array.isArray(nodes)) return [];
  const out: AccountCourseContentItem[] = [];

  for (const node of nodes) {
    const hasChildren = Array.isArray(node.items) && node.items.length > 0;
    if (hasChildren) {
      out.push(...collectSupportedLeaves(node.items));
      continue;
    }

    const mapped = mapContentLeaf(node);
    if (mapped && SUPPORTED_CONTENT_TYPES.has(mapped.type)) {
      out.push(mapped);
    }
  }

  return out;
}

function mapFlatItems(
  nodes: StudentCourseContentItemApi[] | null | undefined
): AccountCourseContentItem[] {
  if (!Array.isArray(nodes)) return [];
  return nodes
    .map(mapContentLeaf)
    .filter((item): item is AccountCourseContentItem => {
      if (!item) return false;
      return SUPPORTED_CONTENT_TYPES.has(item.type);
    });
}

function resolveProgressPercent(
  enrollment: StudentCourseDetailDataApi["enrollment"],
  courseProgress: NonNullable<
    StudentCourseDetailDataApi["course"]
  >["progress"]
): number | undefined {
  const fromEnrollment = asOptionalNumber(
    enrollment?.progressPercent ?? enrollment?.progress
  );
  if (fromEnrollment !== undefined) return fromEnrollment;

  return asOptionalNumber(
    courseProgress?.progressPercent ??
      courseProgress?.averageCourseCompletion ??
      courseProgress?.averageCompletion
  );
}

function mapContentSummary(
  byType: Record<string, number> | undefined,
  includes?: StudentEnrollmentListItemApi["includes"]
): AccountCourseDetailViewModel["contentSummary"] {
  return {
    video: asNumber(byType?.video ?? includes?.video),
    quiz: asNumber(byType?.quiz ?? includes?.quiz),
    pdf: asNumber(byType?.pdf ?? includes?.pdf),
    liveclass: asNumber(byType?.liveclass ?? includes?.liveClass),
  };
}

export function mapStudentCourseDetail(
  data: StudentCourseDetailDataApi | null | undefined
): AccountCourseDetailViewModel | null {
  if (!data?.course) return null;
  const course = data.course;
  const title = asString(course.title ?? (course as { courseTitle?: string }).courseTitle);
  const courseId = course.id != null ? String(course.id) : "";
  if (!title || !courseId) return null;

  const enrollment = data.enrollment;
  const hasTopLevelItems = Array.isArray(data.items);
  const items = hasTopLevelItems
    ? mapFlatItems(data.items)
    : collectSupportedLeaves(course.items);

  const chapters = Array.isArray(course.chapters)
    ? course.chapters
        .map(mapChapterOption)
        .filter((c): c is AccountCourseChapterOption => Boolean(c))
    : [];

  const categoryLabel =
    asString(course.categories?.[0]?.name) ||
    asString(course.subCategory1) ||
    undefined;

  const totalTimeLabel =
    formatDuration(asNumber(enrollment?.totalTime)) ||
    formatDuration(asNumber(course.progress?.totalTimeSpent));

  return {
    courseId,
    title,
    instructor: asString(course.instructor) || undefined,
    language: asString(course.language) || undefined,
    categoryLabel,
    syllabus: asString(course.syllabus) || undefined,
    courseTakeUrl: asString(course.courseTakeUrl),
    progressPercent: resolveProgressPercent(enrollment, course.progress),
    learningStatus: asString(enrollment?.learningStatus) || undefined,
    completed:
      typeof enrollment?.completed === "boolean"
        ? enrollment.completed
        : undefined,
    totalTimeLabel,
    validTill: asString(enrollment?.validTill) || undefined,
    startDate: asString(enrollment?.startDate) || undefined,
    lastAccessDate: asString(enrollment?.lastAccessDate) || undefined,
    contentTotal: asOptionalNumber(course.contentSummary?.total),
    contentSummary: mapContentSummary(course.contentSummary?.byType),
    chapters,
    items,
    pagination: {
      page: data.pagination?.page ?? 1,
      limit: data.pagination?.limit ?? (items.length || 12),
      total: data.pagination?.total ?? items.length,
      totalPages: data.pagination?.totalPages ?? 1,
    },
  };
}

export function mapStudentCourseFilterOptions(
  data: StudentCourseFilterOptionsDataApi | null | undefined
): {
  packages: { value: string; label: string }[];
  categories: { value: string; label: string }[];
  subCategories: { value: string; label: string }[];
} {
  const mapList = (list: StudentCourseFilterOptionApi[] | undefined) =>
    (list ?? [])
      .map(mapFilterOption)
      .filter((o): o is { value: string; label: string } => Boolean(o));

  return {
    packages: mapList(data?.packages),
    categories: mapList(data?.categories),
    subCategories: mapList(data?.subCategories),
  };
}

export function mapStudentCourseChapterOptions(
  items: StudentCourseChapterApi[] | null | undefined
): AccountCourseChapterOption[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(mapChapterOption)
    .filter((c): c is AccountCourseChapterOption => Boolean(c));
}
