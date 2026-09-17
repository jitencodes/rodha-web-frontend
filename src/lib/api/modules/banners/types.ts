/** Shared CMS banner DTO used across home, category, about, team, and faculty. */
export interface WebsiteBannerStackApi {
  id?: string | number | null;
  count?: string | null;
  value?: string | null;
  stat?: string | null;
  title?: string | null;
  label?: string | null;
  name?: string | null;
  iconUrl?: string | null;
  overline?: string | null;
}

export interface WebsiteBannerListItemApi {
  title?: string | null;
  description?: string | null;
  iconUrl?: string | null;
  count?: string | null;
}

export interface WebsiteBannerCtaApi {
  name?: string | null;
  redirectUrl?: string | null;
}

export interface WebsiteBannerApi {
  id?: number;
  pageKey?: string | null;
  mediaType?: string | null;
  mediaUrl?: string | null;
  videoYoutubeLink?: string | null;
  overline?: string | null;
  title?: string | null;
  titleHighlights?: unknown;
  description?: string | null;
  stacks?: WebsiteBannerStackApi[] | unknown | null;
  listItems?: WebsiteBannerListItemApi[] | unknown | null;
  cats?: WebsiteBannerCtaApi[] | unknown | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface BannerStackViewModel {
  id: string;
  value: string;
  label: string;
  icon?: string;
  prefix?: string;
}

export interface BannerListItemViewModel {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export interface BannerCtaViewModel {
  label: string;
  href: string;
}

export interface WebsiteBannerViewModel {
  overline: string | null;
  title: string;
  titleHighlights: string[];
  description: string | null;
  videoId: string | null;
  imageUrl: string | null;
  stacks: BannerStackViewModel[];
  listItems: BannerListItemViewModel[];
  ctas: BannerCtaViewModel[];
}
