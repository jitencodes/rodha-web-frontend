import type { CourseApi } from "@/lib/api/modules/courses/types";
import type { CategoryId } from "@/lib/types";

/** Raw category from GET /api/website/categories and home.categories */
export interface CategoryApi {
  id: number;
  name: string;
  title: string;
  slug: string;
  iconUrl?: string | null;
  description?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Nested category on studentResultGroups (subset of fields).
 */
export interface CategorySummaryApi {
  id: number;
  name: string;
  title: string;
  slug: string;
  iconUrl?: string | null;
  isActive?: boolean;
}

/** Shared view-model for header, mobile nav, and homepage category cards */
export interface WebsiteCategoryViewModel {
  /** Stringified API id — used as React key */
  id: string;
  name: string;
  /** From API `title` — dropdown / mobile primary label */
  menuLabel: string;
  slug: string;
  description: string;
  /** From API `title` — ExamCardV2 subheading */
  subHeading?: string;
  icon?: string;
  image?: string;
  /**
   * Known local CategoryId when API slug matches a static category.
   * Used for counselling pre-fill and free-resource URLs.
   */
  counsellingExamId?: CategoryId;
}

export const KNOWN_CATEGORY_IDS: readonly CategoryId[] = [
  "cat",
  "ipmat",
  "clat",
  "ssc",
  "skillhouse",
] as const;


export interface CategoryPageBannerApi {
  id: number;
  pageKey: string;
  mediaType: string;
  mediaUrl?: string | null;
  videoYoutubeLink?: string | null;
  overline?: string | null;
  title?: string | null;
  titleHighlights?: string[] | null;
  description?: string | null;

  stacks?: CategoryPageBannerStackApi[] | null;
  listItems?: unknown;
  cats?: CategoryPageBannerCtaApi[] | null;

  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CategoryPageBannerStackApi {
  count?: string | null;
  title?: string | null;
  iconUrl?: string | null;
  overline?: string | null;
}

export interface CategoryPageBannerCtaApi {
  name?: string | null;
  redirectUrl?: string | null;
}

export interface CategoryPageFaqApi {
  id: number;
  websiteCategoryId?: number | null;
  question: string;
  answer: string;
  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;

  websiteCategory?: CategorySummaryApi | null;
}

export interface CategoryPageResultStackApi {
  count?: string | null;
  title?: string | null;
  iconUrl?: string | null;
}

export interface CategoryPageResultApi {
  id: number;
  title?: string | null;
  overline?: string | null;
  subTitle?: string | null;
  description?: string | null;
  stacks?: CategoryPageResultStackApi[] | null;
}

export interface CategoryPageStudentResultApi {
  id: number;
  websiteCategoryId?: number | null;
  websiteResultId?: number | null;

  batch?: string | null;
  profileImageUrl?: string | null;
  rank?: number | null;
  percentage?: string | number | null;

  fullName?: string | null;
  collegeName?: string | null;
  examYear?: string | number | null;

  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CategoryPageStudentResultGroupApi {
  result?: CategoryPageResultApi | null;
  students?: CategoryPageStudentResultApi[] | null;
}

export interface CategoryPageFacultySubjectApi {
  id: number;
  name?: string | null;
  isActive?: boolean;
}

export interface CategoryPageFacultyTestimonialApi {
  id: number;
  fullName?: string | null;
  collegeName?: string | null;
  batch?: string | null;
  reviewText?: string | null;
  profileImageUrl?: string | null;
  isActive?: boolean;
}

export interface CategoryPageFacultyApi {
  id: number;
  slug: string;
  experienceYears?: number | null;
  profileImageUrl?: string | null;
  fullName?: string | null;
  designation?: string | null;
  about?: string | null;
  teachingPhilosophy?: string | null;
  achievements?: string[] | null;
  videoLinks?: string[] | null;
  isFeatured?: boolean;
  isActive?: boolean;
  categories?: CategorySummaryApi[] | null;
  subjects?: CategoryPageFacultySubjectApi[] | null;
  testimonials?: CategoryPageFacultyTestimonialApi[] | null;
  courses?: CourseApi[] | null;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CategoryPageTestimonialApi {
  id: number;
  websiteCategoryId?: number | null;
  profileImageUrl?: string | null;
  fullName?: string | null;
  collegeName?: string | null;
  batch?: string | null;
  reviewText?: string | null;

  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CategoryPageSuccessStoryApi {
  id: number;
  websiteCategoryId?: number | null;
  title?: string | null;
  subTitle?: string | null;
  youtubeLink?: string | null;
  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CategoryPageTestSeriesApi {
  id: string;
  value?: string | null;
  title: string;
  description?: string | null;

  price?: string | null;
  offerPrice?: string | null;

  href?: string | null;
  icon?: string | null;
  image?: string | null;

  isActive?: boolean;
}

export interface CategoryPageApi {
  category: CategoryApi;

  banner?: CategoryPageBannerApi | null;

  faqs?: CategoryPageFaqApi[] | null;

  studentResultsByResult?: CategoryPageStudentResultGroupApi[] | null;

  faculty?: CategoryPageFacultyApi[] | null;

  testimonials?: CategoryPageTestimonialApi[] | null;

  successStories?: CategoryPageSuccessStoryApi[] | null;

  courses?: CourseApi[] | null;

  testSeries?: CategoryPageTestSeriesApi[] | null;
}