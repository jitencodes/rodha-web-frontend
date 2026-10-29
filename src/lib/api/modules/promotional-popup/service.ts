import { apiGetOrNull } from "@/lib/api/client";
import { mapPromotionalPopup } from "@/lib/api/modules/promotional-popup/mapper";
import type {
  PromotionalPopupApi,
  PromotionalPopupViewModel,
} from "@/lib/api/modules/promotional-popup/types";

const PATH = "api/website/promotional-popup";

export async function getPromotionalPopup(): Promise<PromotionalPopupViewModel | null> {
  const data = await apiGetOrNull<PromotionalPopupApi | null>(PATH);
  const mapped = mapPromotionalPopup(data);
  // #region agent log
  fetch("http://127.0.0.1:7331/ingest/539f300b-4ba6-49bb-83d3-9fd84c4ec31d", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "227c1e",
    },
    body: JSON.stringify({
      sessionId: "227c1e",
      runId: "pre-fix",
      hypothesisId: "D",
      location: "promotional-popup/service.ts:getPromotionalPopup",
      message: "getPromotionalPopup result",
      data: {
        rawIsNull: data == null,
        mappedIsNull: mapped == null,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  return mapped;
}
