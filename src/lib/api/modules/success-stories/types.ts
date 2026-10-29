import type { CategorySummaryApi } from "@/lib/api/modules/categories/types";

export interface PaginationApi {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SuccessStoryApi {
  id: number | string;
  title?: string | null;
  subTitle?: string | null;
  youtubeLink?: string | null;
  websiteCategory?: CategorySummaryApi | null;
}

export interface SuccessStoryListApi {
  items?: SuccessStoryApi[] | null;
  pagination?: PaginationApi | null;
}

export interface SuccessStoryViewModel {
  id: string;
  youtubeId: string;
  student: string;
  subtitle: string;
  categorySlug: string;
}

export interface SuccessStoryListViewModel {
  items: SuccessStoryViewModel[];
  page: number;
  total: number;
  totalPages: number;
}
