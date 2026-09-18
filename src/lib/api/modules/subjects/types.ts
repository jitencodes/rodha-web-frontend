import type { CategorySummaryApi } from "@/lib/api/modules/categories/types";

export interface SubjectApi {
  id: number;
  name?: string | null;
  categories?: CategorySummaryApi[] | null;
}

export interface SubjectViewModel {
  id: string;
  name: string;
  categoryIds: string[];
}
