import { toCategoryId } from "@/lib/api/modules/testimonials/types";
import type {
  StudentResultListApi,
  StudentResultListViewModel,
} from "@/lib/api/modules/student-results/types";

function parseYear(raw: string | number | null | undefined): number {
  const parsed = Number.parseInt(String(raw ?? ""), 10);
  return Number.isFinite(parsed) ? parsed : new Date().getFullYear();
}

function parsePercentile(raw: string | number | null | undefined): number | undefined {
  if (raw === null || raw === undefined || raw === "") return undefined;
  const parsed = Number.parseFloat(String(raw).replace(/%/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function mapStudentResultList(
  data: StudentResultListApi | null | undefined
): StudentResultListViewModel {
  const items = (data?.items ?? [])
    .map((item) => {
      const name = item.fullName?.trim();
      if (!name) return null;
      const categorySlug = item.websiteCategory?.slug?.trim() || "all";
      const rankRaw = item.rank;
      const rank =
        rankRaw === null || rankRaw === undefined || rankRaw === ""
          ? Number.NaN
          : Number(rankRaw);
      return {
        id: String(item.id),
        name,
        batch: item.batch?.trim() ? [item.batch.trim()] : [],
        exam:
          item.websiteResult?.overline?.trim() ||
          item.websiteResult?.title?.trim() ||
          item.websiteCategory?.title?.trim() ||
          "",
        rank: Number.isFinite(rank) ? rank : undefined,
        percentile: parsePercentile(item.percentage),
        college: item.collegeName?.trim() || "",
        year: parseYear(item.examYear),
        image: item.profileImageUrl?.trim() || undefined,
        category: toCategoryId(categorySlug === "all" ? null : categorySlug),
        categorySlug,
      };
    })
    .filter((item): item is StudentResultListViewModel["items"][number] => item !== null);

  return {
    items,
    page: data?.pagination?.page ?? 1,
    total: data?.pagination?.total ?? items.length,
    totalPages: data?.pagination?.totalPages ?? 1,
  };
}
