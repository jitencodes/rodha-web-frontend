export const COURSE_CONTENT_TYPE_TABS = [
  { id: "", label: "All", summaryKey: null },
  { id: "videos", label: "Videos", summaryKey: "video" as const },
  {
    id: "live-classes",
    label: "Live Classes",
    summaryKey: "liveclass" as const,
  },
  { id: "pdfs", label: "PDFs", summaryKey: "pdf" as const },
  { id: "quizzes", label: "Quizzes", summaryKey: "quiz" as const },
] as const;

export type CourseContentTypeTabId =
  (typeof COURSE_CONTENT_TYPE_TABS)[number]["id"];

export const COMPLETION_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "not_completed", label: "Not Completed" },
] as const;

export const LIVE_CLASS_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "upcoming", label: "Upcoming" },
] as const;

export const RESULT_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "passed", label: "Passed" },
  { value: "failed", label: "Failed" },
  { value: "in_review", label: "In Review" },
] as const;

export const CONTINUE_SORT_OPTIONS = [
  { value: "continue_watching", label: "Continue Watching" },
  { value: "last_updated", label: "Last Updated" },
  { value: "recently_purchased", label: "Recently Purchased" },
  { value: "recently_viewed", label: "Recently Viewed" },
] as const;

export const COURSE_CONTENT_PAGE_SIZE = 12;

export function contentTypeLabel(type: string): string {
  switch (type.toLowerCase()) {
    case "video":
      return "Video";
    case "quiz":
      return "Quiz";
    case "pdf":
      return "PDF";
    case "liveclass":
      return "Live Class";
    default:
      return type;
  }
}

export function completionLabel(completed: boolean): string {
  return completed ? "Completed" : "Not Started";
}

export function formatCourseDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    // Already a display string from API
    return value;
  }
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
