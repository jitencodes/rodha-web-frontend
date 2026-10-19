import type {
  RecentPurchaseApi,
  RecentPurchaseViewModel,
} from "@/lib/api/modules/recent-purchases/types";

export function mapRecentPurchase(
  data: RecentPurchaseApi | RecentPurchaseApi[] | null | undefined
): RecentPurchaseViewModel | null {
  const item = Array.isArray(data) ? data[0] : data;
  const studentName = item?.studentName?.trim();
  const itemName = item?.itemName?.trim();
  const purchasedAt = item?.purchasedAt?.trim();
  if (!studentName || !itemName || !purchasedAt) return null;
  return { studentName, itemName, purchasedAt };
}
