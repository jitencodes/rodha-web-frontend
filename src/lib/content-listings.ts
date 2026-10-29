export interface ListingQuery {
  category?: string;
  q?: string;
  page?: string;
  type?: string;
}

export function readListingQuery(params: ListingQuery) {
  const category = params.category?.trim() || "all";
  const query = params.q?.trim() || "";
  const type = params.type?.trim() || "all";
  const currentPage = Math.max(
    1,
    Number.parseInt(params.page ?? "1", 10) || 1
  );
  return { category, query, type, currentPage };
}

export function paginateItems<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit) || 1);
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  return {
    pageItems: items.slice(start, start + limit),
    total,
    totalPages,
    safePage,
  };
}

export function matchesListingQuery(
  query: string,
  ...parts: Array<string | number | undefined>
) {
  if (!query) return true;
  const needle = query.toLowerCase();
  return parts.some((part) =>
    part === undefined ? false : String(part).toLowerCase().includes(needle)
  );
}

export function listingPaginationQuery(input: {
  category: string;
  query: string;
  type?: string;
}) {
  const query: Record<string, string> = {};
  if (input.category && input.category !== "all") {
    query.category = input.category;
  }
  if (input.query) {
    query.q = input.query;
  }
  if (input.type && input.type !== "all") {
    query.type = input.type;
  }
  return query;
}
