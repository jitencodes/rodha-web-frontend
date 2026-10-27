import type { CategoryId, Testimonial } from "@/lib/types";
import type { CategorySummaryApi } from "@/lib/api/modules/categories/types";
import type { PaginationApi } from "@/lib/api/modules/success-stories/types";

export interface TestimonialApi {
  id: number | string;
  profileImageUrl?: string | null;
  fullName?: string | null;
  collegeName?: string | null;
  batch?: string | null;
  reviewText?: string | null;
  websiteCategory?: CategorySummaryApi | null;
}

export interface TestimonialListApi {
  items?: TestimonialApi[] | null;
  pagination?: PaginationApi | null;
}

export interface ListedTestimonial extends Testimonial {
  categorySlug: string;
}

export interface TestimonialListViewModel {
  items: ListedTestimonial[];
  page: number;
  total: number;
  totalPages: number;
}

const CATEGORY_IDS = new Set<CategoryId>([
  "cat",
  "ipmat",
  "clat",
  "ssc",
  "skillhouse",
]);

export function toCategoryId(slug?: string | null): CategoryId {
  if (slug && CATEGORY_IDS.has(slug as CategoryId)) return slug as CategoryId;
  return "cat";
}
