import type { CourseFilterType } from "@/lib/types";

/** Course payload nested on category / faculty pages. */
export interface CourseApi {
  id?: string | number;
  title?: string | null;
  slug?: string | null;
  language?: string | null;
  category?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  price?: number | string | null;
  duration?: string | null;
  mode?: string | null;
  features?: string[] | null;
  highlights?: string[] | null;
  enrollmentUrl?: string | null;
  badge?: string | null;
  badgeType?: string | null;
  detailsLabel?: string | null;
  details?: string[] | null;
  thumbnail?: string | null;
  image?: string | null;
  showFaculty?: boolean | null;
  externalLink?: string | null;
  courseType?: string | null;
  caourseCount?: number | null;
  originalPrice?: number | string | null;
  startDate?: string | null;
  faculty?: string | null;
  isActive?: boolean;
}

export const COURSE_FILTER_TYPES: readonly CourseFilterType[] = [
  "comprehensive",
  "individual",
  "crash",
  "other",
] as const;
