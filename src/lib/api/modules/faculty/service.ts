import { apiGetOrNull } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import {
  mapFacultyDetail,
  mapFacultyPage,
} from "@/lib/api/modules/faculty/mapper";
import type {
  FacultyApi,
  FacultyListViewModel,
  FacultyPageApi,
  GetFacultyParams,
} from "@/lib/api/modules/faculty/types";
import type { Faculty } from "@/lib/types";

const PATH = "api/website/faculty";

export async function getFacultyPage(
  params: GetFacultyParams = {}
): Promise<FacultyListViewModel | null> {
  const query = buildApiQuery({
    page: params.page ?? 1,
    limit: params.limit ?? 15,
    search: params.search?.trim(),
    categoryIds: params.categoryIds?.trim(),
    subjectIds: params.subjectIds?.trim(),
    sortBy: params.sortBy?.trim(),
  });

  const data = await apiGetOrNull<FacultyPageApi>(`${PATH}${query}`);
  return mapFacultyPage(data);
}

export async function getFacultyBySlug(
  slug: string
): Promise<Faculty | null> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) return null;

  const data = await apiGetOrNull<FacultyApi>(
    `${PATH}/${encodeURIComponent(normalizedSlug)}`
  );

  return mapFacultyDetail(data);
}
