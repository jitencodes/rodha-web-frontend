import { apiGetOrNull } from "@/lib/api/client";
import { mapPromotionalBanner } from "@/lib/api/modules/promotional-banner/mapper";
import type {
  PromotionalBannerApi,
  PromotionalBannerViewModel,
} from "@/lib/api/modules/promotional-banner/types";

const PATH = "api/website/promotional-banner";

export async function getPromotionalBanner(): Promise<PromotionalBannerViewModel | null> {
  const data = await apiGetOrNull<PromotionalBannerApi | null>(PATH);
  return mapPromotionalBanner(data);
}
