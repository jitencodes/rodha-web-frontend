import { apiGetOrNull } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import { mapSuccessStoryList } from "@/lib/api/modules/success-stories/mapper";
import type {
  SuccessStoryListApi,
  SuccessStoryListViewModel,
} from "@/lib/api/modules/success-stories/types";

const PATH = "api/website/success-stories";

export async function getSuccessStories(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}): Promise<SuccessStoryListViewModel> {
  const query = buildApiQuery({
    page: params.page ?? 1,
    limit: params.limit ?? 6,
    search: params.search?.trim(),
    category:
      params.category && params.category !== "all"
        ? params.category.trim()
        : undefined,
  });
  const data = await apiGetOrNull<SuccessStoryListApi>(`${PATH}${query}`);
  return mapSuccessStoryList(data);
}
