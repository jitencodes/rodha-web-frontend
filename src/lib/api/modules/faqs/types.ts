import type { CategorySummaryApi } from "@/lib/api/modules/categories/types";

export interface FaqApi {
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

export interface FaqPaginationApi {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FaqListApi {
  items: FaqApi[];
  pagination: FaqPaginationApi;
}

export interface GetFaqsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export interface FaqViewModel {
  id: string;
  question: string;
  answer: string;
  category: {
    id: string;
    name: string;
    title: string;
    slug: string;
  } | null;
}

export interface FaqListViewModel {
  items: FaqViewModel[];
  pagination: FaqPaginationApi;
}