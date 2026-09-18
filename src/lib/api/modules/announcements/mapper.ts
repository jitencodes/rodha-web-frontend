import type {
  AnnouncementApi,
  AnnouncementViewModel,
} from "@/lib/api/modules/announcements/types";

function isEndAtInFuture(endAt: string | null | undefined): boolean {
  if (!endAt) return true; // no end date → still show (countdown hidden)
  const ts = new Date(endAt).getTime();
  if (Number.isNaN(ts)) return true;
  return ts > Date.now();
}

export function mapAnnouncement(
  item: AnnouncementApi
): AnnouncementViewModel | null {
  if (!item?.description?.trim()) return null;
  if (item.isActive === false) return null;
  if (!isEndAtInFuture(item.endAt)) return null;

  return {
    id: item.id,
    title: item.title ?? "",
    descriptionHtml: item.description,
    endAt: item.endAt?.trim() ? item.endAt : null,
  };
}

export function mapAnnouncements(
  items: AnnouncementApi[] | null | undefined
): AnnouncementViewModel[] {
  if (!items?.length) return [];
  return items
    .map(mapAnnouncement)
    .filter((item): item is AnnouncementViewModel => item !== null);
}
