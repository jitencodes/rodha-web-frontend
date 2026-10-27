import { toCategoryId } from "@/lib/api/modules/testimonials/types";
import type {
  TestimonialListApi,
  TestimonialListViewModel,
} from "@/lib/api/modules/testimonials/types";

export function mapTestimonialList(
  data: TestimonialListApi | null | undefined
): TestimonialListViewModel {
  const items = (data?.items ?? [])
    .map((item) => {
      const name = item.fullName?.trim();
      const quote = item.reviewText?.trim();
      if (!name || !quote) return null;
      const categorySlug = item.websiteCategory?.slug?.trim() || "all";
      return {
        id: String(item.id),
        name,
        exam: item.websiteCategory?.title?.trim() || item.batch?.trim() || "",
        score: "",
        college: item.collegeName?.trim() || "",
        quote,
        image: item.profileImageUrl?.trim() || undefined,
        year: new Date().getFullYear(),
        category: toCategoryId(categorySlug === "all" ? null : categorySlug),
        categorySlug,
      };
    })
    .filter((item): item is TestimonialListViewModel["items"][number] => item !== null);

  return {
    items,
    page: data?.pagination?.page ?? 1,
    total: data?.pagination?.total ?? items.length,
    totalPages: data?.pagination?.totalPages ?? 1,
  };
}
