import { extractYoutubeId } from "@/lib/api/modules/banners/mapper";
import type {
  SuccessStoryListApi,
  SuccessStoryListViewModel,
  SuccessStoryViewModel,
} from "@/lib/api/modules/success-stories/types";

export function mapSuccessStoryList(
  data: SuccessStoryListApi | null | undefined
): SuccessStoryListViewModel {
  const items: SuccessStoryViewModel[] = [];
  for (const story of data?.items ?? []) {
    const youtubeId = extractYoutubeId(story.youtubeLink);
    const student = story.title?.trim();
    if (!youtubeId || !student) continue;
    items.push({
      id: String(story.id),
      youtubeId,
      student,
      subtitle: story.subTitle?.trim() || story.websiteCategory?.title?.trim() || "",
      categorySlug: story.websiteCategory?.slug?.trim() || "all",
    });
  }

  return {
    items,
    page: data?.pagination?.page ?? 1,
    total: data?.pagination?.total ?? items.length,
    totalPages: data?.pagination?.totalPages ?? 1,
  };
}
