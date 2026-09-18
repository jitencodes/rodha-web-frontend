import { apiGetOrNull } from "@/lib/api/client";
import { mapAboutPage } from "@/lib/api/modules/about/mapper";
import type {
  AboutPageApi,
  AboutPageViewModel,
} from "@/lib/api/modules/about/types";

const PATH = "api/website/about";

export async function getAbout(): Promise<AboutPageViewModel | null> {
  const data = await apiGetOrNull<AboutPageApi>(PATH);
  return mapAboutPage(data);
}
