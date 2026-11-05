import { extractYoutubeId } from "@/lib/api/modules/banners/mapper";
import type {
  PromotionalBannerApi,
  PromotionalBannerViewModel,
} from "@/lib/api/modules/promotional-banner/types";

function youtubeThumb(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function isWithinDateWindow(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  now = Date.now()
): boolean {
  if (startDate?.trim()) {
    const start = Date.parse(startDate);
    if (!Number.isNaN(start) && now < start) return false;
  }
  if (endDate?.trim()) {
    const end = Date.parse(endDate);
    if (!Number.isNaN(end) && now > end) return false;
  }
  return true;
}

export function mapPromotionalBanner(
  data: PromotionalBannerApi | null | undefined
): PromotionalBannerViewModel | null {
  if (!data) return null;
  if (!isWithinDateWindow(data.startDate, data.endDate)) return null;

  const title = data.title?.trim() || "Rodha";
  const link = data.link?.trim() || null;
  const mediaUrl = data.mediaUrl?.trim() || null;
  const videoYoutubeLink = data.videoYoutubeLink?.trim() || null;
  const rawType = data.mediaType?.trim().toUpperCase() || "";

  const youtubeId =
    extractYoutubeId(videoYoutubeLink) ||
    extractYoutubeId(mediaUrl) ||
    extractYoutubeId(link);

  const isVideo =
    rawType === "VIDEO" ||
    rawType === "YOUTUBE" ||
    Boolean(extractYoutubeId(videoYoutubeLink));

  if (isVideo) {
    if (!youtubeId) return null;
    return {
      id: String(data.id ?? "promo-banner"),
      title,
      mediaType: "VIDEO",
      imageUrl: youtubeThumb(youtubeId),
      youtubeId,
      youtubeUrl:
        videoYoutubeLink ||
        `https://www.youtube.com/watch?v=${youtubeId}`,
      link: link || `https://www.youtube.com/watch?v=${youtubeId}`,
    };
  }

  if (!mediaUrl) return null;

  return {
    id: String(data.id ?? "promo-banner"),
    title,
    mediaType: "IMAGE",
    imageUrl: mediaUrl,
    youtubeId: null,
    youtubeUrl: null,
    link,
  };
}
