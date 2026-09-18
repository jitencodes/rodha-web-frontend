import { apiGetOrNull } from "@/lib/api/client";
import { mapHomePage } from "@/lib/api/modules/home/mapper";
import type {
  HomePageApi,
  HomePageViewModel,
} from "@/lib/api/modules/home/types";

const PATH = "api/website/home";

export async function getHome(): Promise<HomePageViewModel | null> {
  const data = await apiGetOrNull<HomePageApi>(PATH);
  return mapHomePage(data);
}
