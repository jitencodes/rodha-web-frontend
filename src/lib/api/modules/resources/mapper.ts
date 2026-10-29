import { COURSE_IMAGE_FALLBACK } from "@/lib/constants";
import {
  isResourceType,
  type ResourceListApi,
  type ResourceListViewModel,
  type ResourceViewModel,
} from "@/lib/api/modules/resources/types";

export function mapResourceList(
  data: ResourceListApi | null | undefined
): ResourceListViewModel {
  const items: ResourceViewModel[] = [];
  for (const item of data?.items ?? []) {
    const title = item.title?.trim();
    const href = item.redirectUrl?.trim();
    const type = item.type?.trim() ?? "";
    if (!title || !href || !isResourceType(type)) continue;
    const slug = item.category?.slug?.trim();
    items.push({
      id: String(item.id),
      title,
      description: item.description?.trim() || "",
      categorySlug: slug || undefined,
      categoryLabel: item.category?.name?.trim() || item.category?.title?.trim() || undefined,
      type,
      href,
      thumbnailUrl: item.thumbnailUrl?.trim() || COURSE_IMAGE_FALLBACK,
      cta: item.cta?.trim() || undefined,
    });
  }

  return {
    items,
    page: data?.pagination?.page ?? 1,
    total: data?.pagination?.total ?? items.length,
    totalPages: data?.pagination?.totalPages ?? 1,
  };
}
