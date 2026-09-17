import { apiGetOrNull } from "@/lib/api/client";
import { mapCategories } from "@/lib/api/modules/categories/mapper";
import { mapCategoryPage } from "@/lib/api/modules/categories/category-page-mapper";
import type {
  CategoryApi,
  CategoryPageApi,
} from "@/lib/api/modules/categories/types";
import type { WebsiteCategoryViewModel } from "@/lib/api/modules/categories/types";
import type { CategoryLandingConfig } from "@/lib/types";

const PATH = "api/website/categories";

export async function getActiveCategories(): Promise<WebsiteCategoryViewModel[]> {
  const data = await apiGetOrNull<CategoryApi[]>(PATH);
  return mapCategories(data);
}

export async function getCategoryPage(
  slug: string
): Promise<CategoryLandingConfig | null> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) return null;

  const data = await apiGetOrNull<CategoryPageApi>(
    `${PATH}/${encodeURIComponent(normalizedSlug)}`
  );

  return mapCategoryPage(data, normalizedSlug);
}
