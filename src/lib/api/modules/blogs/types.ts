import type { CategorySummaryApi } from "@/lib/api/modules/categories/types";

export interface BlogApi {
  id: number;
  websiteCategoryId?: number | null;
  title: string;
  slug: string;
  description?: string | null;
  author?: string | null;
  publishedAt?: string | null;
  estimatedReadMinutes?: number | null;
  content?: string | null;
  bannerImageUrl?: string | null;
  contentImageUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string[] | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  websiteCategory?: CategorySummaryApi | null;
}

export interface BlogListApi {
  items: BlogApi[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogDetailApi {
  blog: BlogApi;
}

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export interface BlogViewModel {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  publishedAt: string;
  readTime: string;
  thumbnail: string;
  image: string;
  category: string;
  categoryLabel: string;
  categorySlug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

export interface BlogListViewModel {
  items: BlogViewModel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}