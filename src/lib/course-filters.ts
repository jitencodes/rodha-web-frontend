import type { Course } from "@/lib/types";

export const COURSE_FILTERS = [
  { id: "all", label: "All" },
  { id: "comprehensive", label: "Comprehensive" },
  { id: "individual", label: "Individual" },
  { id: "crash", label: "Crash Course" },
] as const;

export type CourseFilterId = (typeof COURSE_FILTERS)[number]["id"];

export function filterCoursesByType(
  courses: Course[],
  filter: CourseFilterId
): Course[] {
  if (filter === "all") return courses;
  return courses.filter((course) => course.courseType === filter);
}
