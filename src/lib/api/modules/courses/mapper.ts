import type { CourseApi } from "@/lib/api/modules/courses/types";
import { COURSE_FILTER_TYPES } from "@/lib/api/modules/courses/types";
import { slugToCategoryId } from "@/lib/api/modules/categories/mapper";
import type { CategoryId, Course, CourseFilterType } from "@/lib/types";

function asNumber(value: number | string | null | undefined): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export function mapCourseType(
  raw: string | null | undefined
): CourseFilterType | undefined {
  if (!raw?.trim()) return undefined;
  const normalized = raw.trim().toLowerCase().replace(/[\s_-]+/g, "");

  if (
    normalized.includes("comprehensive") ||
    normalized === "allinone" ||
    normalized === "program"
  ) {
    return "comprehensive";
  }
  if (
    normalized.includes("individual") ||
    normalized.includes("selfpaced") ||
    normalized.includes("singlemodule")
  ) {
    return "individual";
  }
  if (normalized.includes("crash")) return "crash";
  if (normalized === "other") return "other";

  if ((COURSE_FILTER_TYPES as readonly string[]).includes(normalized)) {
    return normalized as CourseFilterType;
  }

  return "other";
}

export function mapCourse(
  course: CourseApi,
  fallbackCategory: CategoryId
): Course | null {
  if (course.isActive === false) return null;

  const title = course.title?.trim();
  if (!title) return null;

  const slug =
    course.slug?.trim() ||
    (course.id !== undefined && course.id !== null ? String(course.id) : "");
  if (!slug) return null;

  const categorySlug = course.category?.trim() || "";
  const category = slugToCategoryId(categorySlug) ?? fallbackCategory;

  const description =
    course.description?.trim() ||
    course.shortDescription?.trim() ||
    title;
  const shortDescription =
    course.shortDescription?.trim() ||
    course.description?.trim() ||
    title;

  const enrollmentUrl =
    course.enrollmentUrl?.trim() || course.externalLink?.trim() || "";

  return {
    id: String(course.id ?? slug),
    title,
    slug,
    language: course.language?.trim() || undefined,
    category,
    description,
    shortDescription,
    price: asNumber(course.price),
    originalPrice:
      course.originalPrice !== null && course.originalPrice !== undefined
        ? asNumber(course.originalPrice)
        : undefined,
    duration: course.duration?.trim() || "",
    mode: course.mode?.trim() || undefined,
    features: course.features?.filter(Boolean) ?? [],
    highlights: course.highlights?.filter(Boolean) ?? [],
    enrollmentUrl,
    externalLink: course.externalLink?.trim() || undefined,
    thumbnail: course.thumbnail?.trim() || course.image?.trim() || undefined,
    image: course.image?.trim() || course.thumbnail?.trim() || undefined,
    badge: course.badge?.trim() || undefined,
    badgeType: course.badgeType === "audience" ? "audience" : undefined,
    detailsLabel: course.detailsLabel?.trim() || undefined,
    details: course.details?.filter(Boolean) ?? undefined,
    showFaculty: course.showFaculty ?? undefined,
    courseType: mapCourseType(course.courseType),
    caourseCount: course.caourseCount ?? undefined,
    startDate: course.startDate?.trim() || undefined,
    faculty: course.faculty?.trim() || undefined,
  };
}

export function mapCourses(
  courses: CourseApi[] | null | undefined,
  fallbackCategory: CategoryId
): Course[] {
  if (!courses?.length) return [];
  return courses
    .map((course) => mapCourse(course, fallbackCategory))
    .filter((item): item is Course => item !== null);
}
