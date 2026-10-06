import type {
  AuthStateApi,
  StateApi,
  StateDropdownDataApi,
  StateDropdownViewModel,
  StateOptionViewModel,
} from "@/lib/api/modules/states/types";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function mapStateOption(
  item: StateApi | null | undefined
): StateOptionViewModel | null {
  if (!item || typeof item.id !== "number" || !Number.isFinite(item.id)) {
    return null;
  }
  const name = asString(item.name);
  if (!name) return null;
  const code = asString(item.code);
  return {
    stateId: item.id,
    name,
    code,
    value: String(item.id),
    label: code ? `${name} (${code})` : name,
  };
}

export function mapAuthState(
  state: AuthStateApi | null | undefined
): { id: number; name: string; code: string } | null {
  if (!state || typeof state.id !== "number" || !Number.isFinite(state.id)) {
    return null;
  }
  const name = asString(state.name);
  if (!name) return null;
  return {
    id: state.id,
    name,
    code: asString(state.code),
  };
}

export function mapStateDropdown(
  data: StateDropdownDataApi | null | undefined
): StateDropdownViewModel {
  const items = (data?.items ?? [])
    .map((item) => mapStateOption(item))
    .filter((item): item is StateOptionViewModel => Boolean(item));

  const pagination = data?.pagination;
  return {
    items,
    page: typeof pagination?.page === "number" ? pagination.page : 1,
    limit: typeof pagination?.limit === "number" ? pagination.limit : items.length,
    total: typeof pagination?.total === "number" ? pagination.total : items.length,
    totalPages:
      typeof pagination?.totalPages === "number" ? pagination.totalPages : 1,
  };
}
