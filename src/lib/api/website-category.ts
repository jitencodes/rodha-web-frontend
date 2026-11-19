/**
 * `x-website-category-id` — the vertical (MBA = 1, …) a student API call is for.
 * Package-scoped calls send the package's own `websiteCategoryId`; calls with
 * no package context (dashboard list, form config, proof links) send the default.
 */
export const WEBSITE_CATEGORY_HEADER = "x-website-category-id";

export const DEFAULT_WEBSITE_CATEGORY_ID = 1;

function toCategoryId(value: unknown): number | null {
  const parsed =
    typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function resolveWebsiteCategoryId(value: unknown): number {
  return toCategoryId(value) ?? DEFAULT_WEBSITE_CATEGORY_ID;
}

export function websiteCategoryHeaders(
  categoryId?: number | string | null
): Record<string, string> {
  return { [WEBSITE_CATEGORY_HEADER]: String(resolveWebsiteCategoryId(categoryId)) };
}

/** BFF: read the category the browser sent (header, then `categoryId` query). */
export function readWebsiteCategoryId(request: Request): number {
  const fromHeader = request.headers.get(WEBSITE_CATEGORY_HEADER);
  if (fromHeader) return resolveWebsiteCategoryId(fromHeader);
  return resolveWebsiteCategoryId(new URL(request.url).searchParams.get("categoryId"));
}
