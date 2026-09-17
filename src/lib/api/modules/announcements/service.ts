import { apiGetOrNull } from "@/lib/api/client";
import { mapAnnouncements } from "@/lib/api/modules/announcements/mapper";
import type {
  AnnouncementApi,
  AnnouncementViewModel,
} from "@/lib/api/modules/announcements/types";

const PATH = "api/website/announcements";

export async function getActiveAnnouncements(): Promise<
  AnnouncementViewModel[]
> {
  const data = await apiGetOrNull<AnnouncementApi[]>(PATH);
  return mapAnnouncements(data);
}
