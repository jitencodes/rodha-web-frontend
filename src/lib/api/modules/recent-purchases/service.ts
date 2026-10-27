import { apiGetOrNull } from "@/lib/api/client";
import { mapRecentPurchase } from "@/lib/api/modules/recent-purchases/mapper";
import type {
  RecentPurchaseApi,
  RecentPurchaseViewModel,
} from "@/lib/api/modules/recent-purchases/types";

const PATH = "api/website/recent-purchases";

export async function getRecentPurchase(): Promise<RecentPurchaseViewModel | null> {
  const data = await apiGetOrNull<
    RecentPurchaseApi | RecentPurchaseApi[] | null
  >(PATH);
  return mapRecentPurchase(data);
}
