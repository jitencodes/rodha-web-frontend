/** Shared URL pagination helpers for account listing pages. */

export const ACCOUNT_LIST_PAGE_SIZE = 6;

export function parsePageParam(raw: string | undefined | null): number {
  return Math.max(1, Number.parseInt(raw ?? "1", 10) || 1);
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize = ACCOUNT_LIST_PAGE_SIZE
) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    total,
  };
}

export type CoursesTab = "continue" | "buy";

/** Canonical tabs: `continue` | `buy`. Also accepts sidebar aliases. */
export function parseCoursesTab(
  raw: string | undefined | null
): CoursesTab {
  if (!raw) return "continue";
  const t = raw.toLowerCase();
  if (t === "buy" || t === "buy-courses") return "buy";
  if (t === "continue" || t === "continue-watching") return "continue";
  return "continue";
}
