import type { CategorySummaryApi } from "@/lib/api/modules/categories/types";
import type { PaginationApi } from "@/lib/api/modules/success-stories/types";

export const RESOURCE_TYPES = [
  "FREE_COURSE",
  "FREE_TEST_SERIES",
  "FREE_TOOL",
  "COMMUNITY_HANDLE",
  "DOCUMENT",
  "YOUTUBE_LINK",
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  FREE_COURSE: "Free course",
  FREE_TEST_SERIES: "Free test series",
  FREE_TOOL: "Free tool",
  COMMUNITY_HANDLE: "Community",
  DOCUMENT: "Document",
  YOUTUBE_LINK: "YouTube",
};

export interface ResourceApi {
  id: number | string;
  type?: string | null;
  title?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  redirectUrl?: string | null;
  cta?: string | null;
  category?: CategorySummaryApi | null;
}

export interface ResourceListApi {
  items?: ResourceApi[] | null;
  pagination?: PaginationApi | null;
}

export interface ResourceViewModel {
  id: string;
  title: string;
  description: string;
  categorySlug?: string;
  categoryLabel?: string;
  type: ResourceType;
  href: string;
  thumbnailUrl: string;
  cta?: string;
}

export interface ResourceListViewModel {
  items: ResourceViewModel[];
  page: number;
  total: number;
  totalPages: number;
}

export function isResourceType(value: string): value is ResourceType {
  return (RESOURCE_TYPES as readonly string[]).includes(value);
}
