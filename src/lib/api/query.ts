// src/lib/api/query.ts

export type ApiQueryValue =
  | string
  | number
  | boolean
  | null
  | undefined;

export function buildApiQuery(
  params: Record<string, ApiQueryValue>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return;
    }

    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}