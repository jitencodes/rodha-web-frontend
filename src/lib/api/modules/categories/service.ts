import { apiGetOrNull } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import {
  mapCategoryPage,
  mapCategoryPagePackages,
  type CategoryPackagesViewModel,
} from "@/lib/api/modules/categories/category-page-mapper";
import { mapCategories } from "@/lib/api/modules/categories/mapper";
import type {
  CategoryApi,
  CategoryDropdownDataApi,
  CategoryDropdownItemApi,
  CategoryDropdownOption,
  CategoryPageApi,
  WebsiteCategoryViewModel,
} from "@/lib/api/modules/categories/types";
import type { CategoryLandingConfig } from "@/lib/types";

const PATH = "api/website/categories";
const DROPDOWN_PATH = "api/website/categories/dropdown";

export interface CategoryPageDetail {
  category: CategoryLandingConfig;
  packages: CategoryPackagesViewModel | null;
}

function mapDropdownItem(
  item: CategoryDropdownItemApi | null | undefined
): CategoryDropdownOption | null {
  if (!item || item.isActive === false) return null;
  if (typeof item.id !== "number" || !Number.isFinite(item.id)) return null;
  const label =
    (typeof item.title === "string" && item.title.trim()) ||
    (typeof item.name === "string" && item.name.trim()) ||
    "";
  if (!label) return null;
  return {
    value: String(item.id),
    label,
    slug: typeof item.slug === "string" ? item.slug.trim() : undefined,
  };
}

export async function getActiveCategories(): Promise<WebsiteCategoryViewModel[]> {
  const data = await apiGetOrNull<CategoryApi[]>(PATH);
  return mapCategories(data);
}

/** Categories that have packages — for courses listing Category filter. */
export async function getCategoryDropdown(
  options: { search?: string; page?: number; limit?: number } = {}
): Promise<CategoryDropdownOption[]> {
  const qs = buildApiQuery({
    withPackages: true,
    search: options.search?.trim() || undefined,
    page: options.page ?? 1,
    limit: options.limit ?? 50,
  });
  const data = await apiGetOrNull<CategoryDropdownDataApi>(
    `${DROPDOWN_PATH}${qs}`,
    { revalidate: 300 }
  );
  if (!Array.isArray(data?.items)) return [];
  return data.items
    .map(mapDropdownItem)
    .filter((item): item is CategoryDropdownOption => Boolean(item));
}

export async function getCategoryPageDetail(
  slug: string,
  options?: { accessToken?: string }
): Promise<CategoryPageDetail | null> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) return null;

  const data = await apiGetOrNull<CategoryPageApi>(
    `${PATH}/${encodeURIComponent(normalizedSlug)}`,
    {
      revalidate: options?.accessToken ? undefined : 60,
      accessToken: options?.accessToken,
      cache: options?.accessToken ? "no-store" : undefined,
    }
  );
  const category = mapCategoryPage(data, normalizedSlug);
  if (!category) return null;

  const packages = mapCategoryPagePackages(
    data?.packages,
    data?.subCategories,
    category.id
  );

  return { category, packages };
}

export async function getCategoryPage(
  slug: string
): Promise<CategoryLandingConfig | null> {
  const detail = await getCategoryPageDetail(slug);
  return detail?.category ?? null;
}
