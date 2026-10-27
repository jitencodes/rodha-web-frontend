export const SEARCH_ENTITY_TYPES = [
  "PACKAGE",
  "FACULTY",
  "RESOURCE",
  "BLOG",
  "FAQ",
  "SUCCESS_STORY",
  "TESTIMONIAL",
  "STUDENT_RESULT",
  "CATEGORY",
] as const;

export type SearchEntityType = (typeof SEARCH_ENTITY_TYPES)[number];

export type SearchScope = "website" | "account";

export const SEARCH_ENTITY_FILTERS: {
  value: "all" | SearchEntityType;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "PACKAGE", label: "Courses" },
  { value: "FACULTY", label: "Faculty" },
  { value: "RESOURCE", label: "Resources" },
  { value: "BLOG", label: "Blogs" },
  { value: "FAQ", label: "FAQs" },
  { value: "SUCCESS_STORY", label: "Success stories" },
  { value: "TESTIMONIAL", label: "Testimonials" },
  { value: "STUDENT_RESULT", label: "Results" },
  { value: "CATEGORY", label: "Categories" },
];

export interface SearchHitApi {
  entityType: string;
  entityId: number | string;
  score?: number | null;
  data?: Record<string, unknown> | null;
}

export interface SearchResponseApi {
  query?: string;
  items?: SearchHitApi[] | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
}

export interface SearchResultViewModel {
  id: string;
  entityType: string;
  title: string;
  imageUrl: string | null;
  href: string;
  pathLabel: string;
  external: boolean;
}

export interface SearchViewModel {
  items: SearchResultViewModel[];
  unavailable: boolean;
}

export interface WebsiteQuickLink {
  label: string;
  href: string;
}
