import type { CategorySummaryApi } from "@/lib/api/modules/categories/types";
import type { PaginationApi } from "@/lib/api/modules/success-stories/types";
import type { TopperResult } from "@/lib/types";

export interface StudentResultApi {
  id: number | string;
  batch?: string | null;
  profileImageUrl?: string | null;
  rank?: number | string | null;
  percentage?: number | string | null;
  fullName?: string | null;
  collegeName?: string | null;
  examYear?: string | number | null;
  websiteCategory?: CategorySummaryApi | null;
  websiteResult?: { title?: string | null; overline?: string | null } | null;
}

export interface StudentResultListApi {
  items?: StudentResultApi[] | null;
  pagination?: PaginationApi | null;
}

export interface ListedStudentResult extends TopperResult {
  categorySlug: string;
}

export interface StudentResultListViewModel {
  items: ListedStudentResult[];
  page: number;
  total: number;
  totalPages: number;
}
