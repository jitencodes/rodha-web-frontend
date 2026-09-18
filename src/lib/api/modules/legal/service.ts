import { apiGetOrNull } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import { mapLegalPage } from "@/lib/api/modules/legal/mapper";
import type {
  LegalPageApi,
  LegalPageType,
  LegalPageViewModel,
} from "@/lib/api/modules/legal/types";

const PATH = "api/website/legal-pages";

export async function getLegalPage(
  pageType: LegalPageType
): Promise<LegalPageViewModel | null> {
  const query = buildApiQuery({ pageType });
  const data = await apiGetOrNull<LegalPageApi[] | LegalPageApi>(
    `${PATH}${query}`
  );
  return mapLegalPage(data, pageType);
}
