import type {
  RecentPurchaseItemApi,
  RecentPurchaseViewModel,
  RecentPurchasesApi,
} from "@/lib/api/modules/recent-purchases/types";

function itemHref(type: string, slug: string): string | null {
  if (!slug) return null;
  if (type === "package") return `/courses/${slug}`;
  return null;
}

export function mapRecentPurchase(
  item: RecentPurchaseItemApi | null | undefined,
  index: number
): RecentPurchaseViewModel | null {
  const studentName = item?.userName?.trim();
  const itemName = item?.itemName?.trim();
  const purchasedAt = item?.purchasedAt?.trim();
  if (!studentName || !itemName || !purchasedAt) return null;
  const slug = item?.itemSlug?.trim() || "";
  const type = item?.itemType?.trim().toLowerCase() || "";
  return {
    id: `${index}-${slug || itemName}-${purchasedAt}`,
    studentName,
    itemName,
    itemHref: itemHref(type, slug),
    purchasedAt,
  };
}

export function mapRecentPurchases(
  data: RecentPurchasesApi | null | undefined
): RecentPurchaseViewModel[] {
  const items = Array.isArray(data?.items) ? data.items : [];
  return items
    .map(mapRecentPurchase)
    .filter((item): item is RecentPurchaseViewModel => item !== null);
}
