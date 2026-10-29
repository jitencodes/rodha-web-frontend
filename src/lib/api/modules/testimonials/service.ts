import { apiGetOrNull } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";
import { mapTestimonialList } from "@/lib/api/modules/testimonials/mapper";
import type {
  TestimonialListApi,
  TestimonialListViewModel,
} from "@/lib/api/modules/testimonials/types";

const PATH = "api/website/testimonials";

export async function getTestimonials(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}): Promise<TestimonialListViewModel> {
  const query = buildApiQuery({
    page: params.page ?? 1,
    limit: params.limit ?? 6,
    search: params.search?.trim(),
    category:
      params.category && params.category !== "all"
        ? params.category.trim()
        : undefined,
  });
  const data = await apiGetOrNull<TestimonialListApi>(`${PATH}${query}`);
  return mapTestimonialList(data);
}
