import { apiGetOrNull } from "@/lib/api/client";
import { mapPromotionalPopup } from "@/lib/api/modules/promotional-popup/mapper";
import type {
  PromotionalPopupApi,
  PromotionalPopupViewModel,
} from "@/lib/api/modules/promotional-popup/types";

const PATH = "api/website/promotional-popup";

export async function getPromotionalPopup(): Promise<PromotionalPopupViewModel | null> {
  const data = await apiGetOrNull<PromotionalPopupApi | null>(PATH);
  return mapPromotionalPopup(data);
}
