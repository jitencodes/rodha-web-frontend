export type PromoBannerMediaType = "IMAGE" | "VIDEO";

export interface PromotionalBannerApi {
  id?: number | string | null;
  title?: string | null;
  mediaType?: string | null;
  mediaUrl?: string | null;
  videoYoutubeLink?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  link?: string | null;
}

export interface PromotionalBannerViewModel {
  id: string;
  title: string;
  mediaType: PromoBannerMediaType;
  /** CMS image URL for IMAGE media, or YouTube thumbnail for VIDEO. */
  imageUrl: string | null;
  youtubeId: string | null;
  youtubeUrl: string | null;
  /** External CTA / click-through URL. */
  link: string | null;
}
