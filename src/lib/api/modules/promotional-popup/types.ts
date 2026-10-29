export type PromoMediaType = "IMAGE" | "YOUTUBE";

export interface PromotionalPopupApi {
  id?: number | string | null;
  mediaType?: string | null;
  imageUrl?: string | null;
  youtubeUrl?: string | null;
  title?: string | null;
}

export interface PromotionalPopupViewModel {
  id: string;
  mediaType: PromoMediaType;
  imageUrl: string | null;
  youtubeUrl: string | null;
  youtubeId: string | null;
  title: string;
}
