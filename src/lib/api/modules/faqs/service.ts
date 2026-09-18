import { apiGetOrNull } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import { mapFaqList } from "@/lib/api/modules/faqs/mapper";

import type {
  FaqListApi,
  FaqListViewModel,
  GetFaqsParams,
} from "@/lib/api/modules/faqs/types";

const PATH = "api/website/faqs";

export async function getFaqs(
  params: GetFaqsParams = {}
): Promise<FaqListViewModel | null> {
  const query = buildApiQuery({
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    search: params.search?.trim(),
    category:
      params.category && params.category !== "all"
        ? params.category.trim()
        : undefined,
  });

  const data = await apiGetOrNull<FaqListApi>(
    `${PATH}${query}`
  );

  return mapFaqList(data);
}