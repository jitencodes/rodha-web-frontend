import { apiGet } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import { ApiError } from "@/lib/api/types";
import { mapSearchResults } from "@/lib/api/modules/search/mapper";
import type {
  SearchResponseApi,
  SearchScope,
  SearchViewModel,
} from "@/lib/api/modules/search/types";

const PATH = "api/website/search";

export interface SearchWebsiteParams {
  q: string;
  entityTypes?: string;
  scope?: SearchScope;
  page?: number;
  limit?: number;
  accessToken?: string;
  signal?: AbortSignal;
}

async function fetchSearch(
  params: SearchWebsiteParams,
  includeScope: boolean
): Promise<SearchResponseApi> {
  const query = buildApiQuery({
    q: params.q.trim(),
    entityTypes: params.entityTypes?.trim(),
    scope: includeScope ? params.scope : undefined,
    page: params.page ?? 1,
    limit: params.limit ?? 10,
  });

  return apiGet<SearchResponseApi>(`${PATH}${query}`, {
    accessToken: params.accessToken,
    cache: "no-store",
    signal: params.signal ?? AbortSignal.timeout(12000),
  });
}

export async function searchWebsite(
  params: SearchWebsiteParams
): Promise<SearchViewModel> {
  try {
    const data = await fetchSearch(params, Boolean(params.scope));
    return mapSearchResults(data);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 400) {
      throw error;
    }

    const message = error.message.toLowerCase();
    if (message.includes("scope") && params.scope) {
      const data = await fetchSearch(params, false);
      return mapSearchResults(data);
    }

    if (message.includes("entitytype") || message.includes("entity type")) {
      return mapSearchResults(null, true);
    }

    throw error;
  }
}
