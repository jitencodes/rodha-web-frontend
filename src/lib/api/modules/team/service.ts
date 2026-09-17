import { apiGetOrNull } from "@/lib/api/client";
import { mapTeamPage } from "@/lib/api/modules/team/mapper";
import type {
  TeamPageApi,
  TeamPageViewModel,
} from "@/lib/api/modules/team/types";

const PATH = "api/website/team";

export async function getTeam(): Promise<TeamPageViewModel | null> {
  const data = await apiGetOrNull<TeamPageApi>(PATH);
  return mapTeamPage(data);
}
