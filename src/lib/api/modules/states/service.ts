import { apiGet } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import { mapStateDropdown } from "@/lib/api/modules/states/mapper";
import type {
  StateDropdownDataApi,
  StateDropdownViewModel,
  StateOptionViewModel,
} from "@/lib/api/modules/states/types";

const PATH = "api/website/states/dropdown";
const PAGE_LIMIT = 50;
const MAX_PAGES = 20;

export async function getStatesDropdown(options?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<StateDropdownViewModel> {
  const qs = buildApiQuery({
    search: options?.search,
    page: options?.page ?? 1,
    limit: options?.limit ?? PAGE_LIMIT,
  });
  const data = await apiGet<StateDropdownDataApi>(`${PATH}${qs}`);
  return mapStateDropdown(data);
}

/**
 * Fetches every page until `totalPages` so dropdowns get the full state list.
 */
export async function getAllStatesDropdown(options?: {
  search?: string;
  /** Per-page page size sent to the API (default 50). */
  limit?: number;
}): Promise<StateDropdownViewModel> {
  const limit = options?.limit ?? PAGE_LIMIT;
  const search = options?.search;

  const first = await getStatesDropdown({ search, page: 1, limit });
  const totalPages = Math.max(1, Math.min(first.totalPages || 1, MAX_PAGES));

  if (totalPages <= 1) {
    return {
      ...first,
      page: 1,
      totalPages: 1,
      total: first.total || first.items.length,
    };
  }

  const byId = new Map<number, StateOptionViewModel>();
  for (const item of first.items) {
    byId.set(item.stateId, item);
  }

  for (let page = 2; page <= totalPages; page += 1) {
    const next = await getStatesDropdown({ search, page, limit });
    for (const item of next.items) {
      byId.set(item.stateId, item);
    }
    // Stop early if API reports fewer pages than expected
    if (next.totalPages > 0 && page >= next.totalPages) break;
    if (next.items.length === 0) break;
  }

  const items = Array.from(byId.values());
  return {
    items,
    page: 1,
    limit: items.length,
    total: items.length,
    totalPages: 1,
  };
}
