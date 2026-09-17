import type {
  CategoryApi,
  CategorySummaryApi,
} from "@/lib/api/modules/categories/types";
import type { WebsiteCategoryViewModel } from "@/lib/api/modules/categories/types";
import type { TopperResult } from "@/lib/types";

/** Raw banner from GET /api/website/home → data.banner */
export interface HomeBannerApi {
  id: number;
  pageKey?: string;
  mediaType?: string | null;
  mediaUrl?: string | null;
  videoYoutubeLink?: string | null;
  overline?: string | null;
  title?: string | null;
  titleHighlights?: unknown;
  description?: string | null;
  stacks?: unknown;
  listItems?: unknown;
  cats?: unknown;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface HomeFaqApi {
  id: number;
  websiteCategoryId?: number | null;
  question: string;
  answer: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  websiteCategory?: unknown;
}

export interface StudentResultApi {
  id: number;
  websiteCategoryId?: number;
  websiteResultId?: number;
  batch?: string | null;
  profileImageUrl?: string | null;
  rank?: number | null;
  percentage?: string | null;
  fullName?: string | null;
  collegeName?: string | null;
  examYear?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ResultMetaApi {
  id: number;
  title?: string | null;
  overline?: string | null;
  subTitle?: string | null;
}

export interface StudentResultGroupApi {
  category: CategorySummaryApi;
  result: ResultMetaApi;
  students: StudentResultApi[];
}

export interface HomePageApi {
  banner: HomeBannerApi | null;
  faqs: HomeFaqApi[];
  categories: CategoryApi[];
  studentResultGroups: StudentResultGroupApi[];
}

export interface HeroStackViewModel {
  id: string;
  value: string;
  label: string;
}

export interface HomeBannerViewModel {
  title: string;
  titleHighlights: string[];
  description: string | null;
  stacks: HeroStackViewModel[];
  videoId: string | null;
  imageUrl: string | null;
}

export interface HomeFaqViewModel {
  id: string;
  question: string;
  answer: string;
}

export interface HomeResultBannerViewModel {
  id: string;
  badge: string;
  title: string;
  highlight: string | null;
  subtitle: string | null;
  description: string | null;
  cta: string;
  href: string;
  toppers: TopperResult[];
}

export interface HomePageViewModel {
  banner: HomeBannerViewModel | null;
  categories: WebsiteCategoryViewModel[];
  faqs: HomeFaqViewModel[];
  resultBanners: HomeResultBannerViewModel[];
}
