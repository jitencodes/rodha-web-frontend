/** Sort presets for GET api/website/packages (sortBy + sortOrder). */
export interface CourseSortPreset {
  value: string;
  label: string;
  sortBy: "createdAt" | "price" | "title" | "rating";
  sortOrder: "asc" | "desc";
}

export const COURSE_SORT_PRESETS: CourseSortPreset[] = [
  {
    value: "newest",
    label: "Newest",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
    sortBy: "price",
    sortOrder: "asc",
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
    sortBy: "price",
    sortOrder: "desc",
  },
  {
    value: "title-asc",
    label: "Title A–Z",
    sortBy: "title",
    sortOrder: "asc",
  },
  {
    value: "rating-desc",
    label: "Highest Rated",
    sortBy: "rating",
    sortOrder: "desc",
  },
];

export const DEFAULT_COURSE_SORT = "newest";

export function resolveCourseSort(value: string | undefined): CourseSortPreset {
  const match = COURSE_SORT_PRESETS.find((preset) => preset.value === value);
  return match ?? COURSE_SORT_PRESETS[0];
}
