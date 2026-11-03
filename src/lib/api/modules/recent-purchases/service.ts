import { apiGetOrNull } from "@/lib/api/client";
import { mapRecentPurchases } from "@/lib/api/modules/recent-purchases/mapper";
import type {
  RecentPurchaseViewModel,
  RecentPurchasesApi,
} from "@/lib/api/modules/recent-purchases/types";

const PATH = "api/website/recent-purchases";

export async function getRecentPurchases(): Promise<RecentPurchaseViewModel[]> {
  const data = await apiGetOrNull<RecentPurchasesApi | null>(PATH);
  return mapRecentPurchases(data);
}
