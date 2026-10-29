import { extractYoutubeId } from "@/lib/api/modules/banners/mapper";
import type {
  PromotionalPopupApi,
  PromotionalPopupViewModel,
} from "@/lib/api/modules/promotional-popup/types";

export function mapPromotionalPopup(
  data: PromotionalPopupApi | null | undefined
): PromotionalPopupViewModel | null {
  if (!data) return null;
  const youtubeUrl = data.youtubeUrl?.trim() || null;
  const youtubeId = extractYoutubeId(youtubeUrl);
  const imageUrl = data.imageUrl?.trim() || null;
  const mediaType =
    data.mediaType?.toUpperCase() === "YOUTUBE" || youtubeId
      ? "YOUTUBE"
      : "IMAGE";

  if (mediaType === "YOUTUBE" && !youtubeId && !imageUrl) return null;
  if (mediaType === "IMAGE" && !imageUrl) return null;

  return {
    id: String(data.id ?? "promo"),
    mediaType: youtubeId ? "YOUTUBE" : "IMAGE",
    imageUrl,
    youtubeUrl,
    youtubeId,
    title: data.title?.trim() || "Rodha",
  };
}
