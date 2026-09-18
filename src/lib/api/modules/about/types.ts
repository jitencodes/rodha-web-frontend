import type { WebsiteBannerApi } from "@/lib/api/modules/banners/types";
import type { WebsiteBannerViewModel } from "@/lib/api/modules/banners/types";

export interface AboutJourneyApi {
  id: number;
  iconUrl?: string | null;
  title?: string | null;
  timelineDate?: string | null;
  description?: string | null;
  isActive?: boolean;
}

export interface AboutStackApi {
  id: number;
  iconUrl?: string | null;
  title?: string | null;
  count?: string | null;
  isActive?: boolean;
}

export interface GalleryApi {
  id: number;
  title?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
}

export interface AboutPageApi {
  banner?: WebsiteBannerApi | null;
  journeys?: AboutJourneyApi[] | null;
  stacks?: AboutStackApi[] | null;
  galleries?: GalleryApi[] | null;
}

export interface AboutJourneyViewModel {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: string;
}

export interface AboutStatViewModel {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export interface GalleryImageViewModel {
  id: string;
  src: string;
  alt: string;
}

export interface AboutPageViewModel {
  banner: WebsiteBannerViewModel | null;
  journeys: AboutJourneyViewModel[];
  stats: AboutStatViewModel[];
  galleries: GalleryImageViewModel[];
}
