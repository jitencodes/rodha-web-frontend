import { apiGetOrNull } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import { mapResourceList } from "@/lib/api/modules/resources/mapper";
import type {
  ResourceListApi,
  ResourceListViewModel,
} from "@/lib/api/modules/resources/types";

const PATH = "api/website/resources";

export async function getResources(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  type?: string;
}): Promise<ResourceListViewModel> {
  const category = params.category?.trim();
  const isGeneral = category === "general";
  const query = buildApiQuery({
    page: params.page ?? 1,
    limit: params.limit ?? 8,
    search: params.search?.trim(),
    type: params.type && params.type !== "all" ? params.type : undefined,
    category: category && category !== "all" && !isGeneral ? category : undefined,
    general: isGeneral ? true : undefined,
  });
  const data = await apiGetOrNull<ResourceListApi>(`${PATH}${query}`);
  return mapResourceList(data);
}
