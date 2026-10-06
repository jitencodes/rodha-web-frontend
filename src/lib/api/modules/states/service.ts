import { apiGet } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import { mapStateDropdown } from "@/lib/api/modules/states/mapper";
import type {
  StateDropdownDataApi,
  StateDropdownViewModel,
} from "@/lib/api/modules/states/types";

const PATH = "api/website/states/dropdown";

export async function getStatesDropdown(options?: {
  search?: string;
  page?: number;
  /** Default 50 — enough for full Indian states list */
  limit?: number;
}): Promise<StateDropdownViewModel> {
  const qs = buildApiQuery({
    search: options?.search,
    page: options?.page ?? 1,
    limit: options?.limit ?? 50,
  });
  const data = await apiGet<StateDropdownDataApi>(`${PATH}${qs}`);
  return mapStateDropdown(data);
}
