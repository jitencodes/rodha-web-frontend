import type { WebsiteBannerApi } from "@/lib/api/modules/banners/types";
import type { WebsiteBannerViewModel } from "@/lib/api/modules/banners/types";
import type { CategorySummaryApi } from "@/lib/api/modules/categories/types";
import type { CourseApi } from "@/lib/api/modules/courses/types";
import type { Faculty } from "@/lib/types";

export interface FacultySubjectApi {
  id: number;
  name?: string | null;
  isActive?: boolean;
}

export interface FacultyTestimonialApi {
  id: number;
  fullName?: string | null;
  collegeName?: string | null;
  batch?: string | null;
  reviewText?: string | null;
  profileImageUrl?: string | null;
  isActive?: boolean;
}

export interface FacultyApi {
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
  subjects?: FacultySubjectApi[] | null;
  testimonials?: FacultyTestimonialApi[] | null;
  courses?: CourseApi[] | null;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface FacultyListPaginationApi {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FacultyPageApi {
  banner?: WebsiteBannerApi | null;
  featuredFaculty?: FacultyApi[] | null;
  faculty?: {
    items?: FacultyApi[] | null;
    pagination?: FacultyListPaginationApi | null;
  } | null;
}

export interface GetFacultyParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryIds?: string;
  subjectIds?: string;
  sortBy?: string;
}

export interface FacultyListViewModel {
  banner: WebsiteBannerViewModel | null;
  featuredFaculty: Faculty[];
  items: Faculty[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
