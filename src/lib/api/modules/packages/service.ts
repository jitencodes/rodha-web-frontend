import { apiGet, apiGetOrNull } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import {
  mapPackageDetail,
  mapPackageListItems,
  mapPackageMasterOptions,
  type PackageDetailViewModel,
} from "@/lib/api/modules/packages/mapper";
import type {
  PackageCardViewModel,
  PackageDetailApi,
  PackageFilterOption,
  PackageListDataApi,
  PackageListQuery,
  PackageMasterQuery,
  PackageMastersDataApi,
} from "@/lib/api/modules/packages/types";

const PACKAGES_PATH = "api/website/packages";
const CATEGORIES_PATH = "api/website/packages/categories";
const SUBCATEGORIES_PATH = "api/website/packages/subcategories";

export interface PackageListResult {
  items: PackageCardViewModel[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function packagesQueryString(query: PackageListQuery): string {
  return buildApiQuery({
    page: query.page ?? 1,
    limit: query.limit ?? 12,
    search: query.search,
    categoryId: query.categoryId,
    graphyCategory: query.graphyCategory,
    subCategory1: query.subCategory1,
    facultyId: query.facultyId,
    subjectId: query.subjectId,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });
}

export async function getPackages(
  query: PackageListQuery = {}
): Promise<PackageListResult> {
  const qs = packagesQueryString(query);

  const data = await apiGetOrNull<PackageListDataApi>(
    `${PACKAGES_PATH}${qs}`,
    { revalidate: 60 }
  );

  const items = mapPackageListItems(data?.items);
  const page = data?.pagination?.page ?? query.page ?? 1;
  const limit = data?.pagination?.limit ?? query.limit ?? 12;
  const total = data?.pagination?.total ?? items.length;
  const totalPages =
    data?.pagination?.totalPages ??
    Math.max(1, Math.ceil(total / Math.max(limit, 1)));

  return { items, page, limit, total, totalPages };
}

export async function getPackageBySlug(
  slug: string,
  options?: { accessToken?: string }
): Promise<PackageDetailViewModel | null> {
  const trimmed = slug.trim();
  if (!trimmed) return null;

  const data = await apiGetOrNull<PackageDetailApi>(
    `${PACKAGES_PATH}/${encodeURIComponent(trimmed)}`,
    {
      revalidate: options?.accessToken ? undefined : 60,
      accessToken: options?.accessToken,
      cache: options?.accessToken ? "no-store" : undefined,
    }
  );

  return mapPackageDetail(data);
}

/** Graphy Type masters (UI label: Type). Scoped by categoryId when provided. */
export async function getPackageCategories(
  query: PackageMasterQuery | string = {}
): Promise<PackageFilterOption[]> {
  const opts: PackageMasterQuery =
    typeof query === "string" ? { search: query } : query;
  const qs = buildApiQuery({
    search: opts.search?.trim() || undefined,
    categoryId: opts.categoryId,
    page: opts.page ?? 1,
    limit: opts.limit ?? 50,
  });
  const data = await apiGetOrNull<PackageMastersDataApi>(
    `${CATEGORIES_PATH}${qs}`,
    { revalidate: 300 }
  );
  return mapPackageMasterOptions(data?.items);
}

/** subCategory1 masters for course tabs. Scoped by categoryId / graphyCategory. */
export async function getPackageSubcategories(
  query: PackageMasterQuery | string = {}
): Promise<PackageFilterOption[]> {
  const opts: PackageMasterQuery =
    typeof query === "string" ? { search: query } : query;
  const qs = buildApiQuery({
    search: opts.search?.trim() || undefined,
    categoryId: opts.categoryId,
    graphyCategory: opts.graphyCategory,
    page: opts.page ?? 1,
    limit: opts.limit ?? 50,
  });
  const data = await apiGetOrNull<PackageMastersDataApi>(
    `${SUBCATEGORIES_PATH}${qs}`,
    { revalidate: 300 }
  );
  return mapPackageMasterOptions(data?.items);
}

/** Resolve best-effort Graphy category for a website CMS category name/slug. */
export async function resolveGraphyCategory(
  categoryNameOrSlug: string
): Promise<string | null> {
  const needle = categoryNameOrSlug.trim().toLowerCase();
  if (!needle) return null;
  const options = await getPackageCategories();
  const exact = options.find(
    (opt) =>
      opt.value.toLowerCase() === needle ||
      opt.label.toLowerCase() === needle
  );
  if (exact) return exact.value;

  const partial = options.find(
    (opt) =>
      opt.value.toLowerCase().includes(needle) ||
      opt.label.toLowerCase().includes(needle) ||
      needle.includes(opt.value.toLowerCase()) ||
      needle.includes(opt.label.toLowerCase())
  );
  return partial?.value ?? null;
}

export async function getPackagesOrThrow(
  query: PackageListQuery = {}
): Promise<PackageListResult> {
  const qs = packagesQueryString(query);
  const data = await apiGet<PackageListDataApi>(`${PACKAGES_PATH}${qs}`);
  return {
    items: mapPackageListItems(data.items),
    page: data.pagination?.page ?? 1,
    limit: data.pagination?.limit ?? 12,
    total: data.pagination?.total ?? 0,
    totalPages: data.pagination?.totalPages ?? 1,
  };
}
