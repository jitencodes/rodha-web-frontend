import type { Course, CourseFilterType } from "@/lib/types";

export const COURSE_FILTERS = [
  { id: "all", label: "All" },
  { id: "comprehensive", label: "Comprehensive" },
  { id: "individual", label: "Individual" },
  { id: "crash", label: "Crash Course" },
  { id: "other", label: "Other" },
] as const;

export type CourseFilterId = (typeof COURSE_FILTERS)[number]["id"];

export function filterCoursesByType(
  courses: Course[],
  filter: CourseFilterId
): Course[] {
  if (filter === "all") return courses;
  return courses.filter((course) => course.courseType === filter);
}

/** Distinct courseType values present in the given courses (excludes undefined). */
export function getAvailableCourseTypes(courses: Course[]): CourseFilterType[] {
  const types = new Set<CourseFilterType>();
  for (const course of courses) {
    if (course.courseType) types.add(course.courseType);
  }
  return COURSE_FILTERS.filter(
    (f): f is (typeof COURSE_FILTERS)[number] & { id: CourseFilterType } =>
      f.id !== "all" && types.has(f.id as CourseFilterType)
  ).map((f) => f.id as CourseFilterType);
}

/** Filter chips to render: All + types with at least one course. Empty when ≤1 type. */
export function getVisibleCourseFilters(courses: Course[]): Array<{
  id: CourseFilterId;
  label: string;
}> {
  const available = getAvailableCourseTypes(courses);
  if (available.length <= 1) return [];

  return [
    { id: "all", label: "All" },
    ...COURSE_FILTERS.filter((f) =>
      available.includes(f.id as CourseFilterType)
    ).map((f) => ({ id: f.id as CourseFilterId, label: f.label })),
  ];
}
