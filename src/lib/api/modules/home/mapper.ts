import { mapWebsiteBanner } from "@/lib/api/modules/banners/mapper";
import { mapCategories, slugToCategoryId } from "@/lib/api/modules/categories/mapper";
import type {
  HomeBannerApi,
  HomeBannerViewModel,
  HomeFaqApi,
  HomeFaqViewModel,
  HomePageApi,
  HomePageViewModel,
  HomeResultBannerViewModel,
  StudentResultApi,
  StudentResultGroupApi,
} from "@/lib/api/modules/home/types";
import type { CategoryId, TopperResult } from "@/lib/types";

export function mapHomeBanner(
  banner: HomeBannerApi | null | undefined
): HomeBannerViewModel | null {
  const mapped = mapWebsiteBanner(banner);
  if (!mapped) return null;

  return {
    title: mapped.title,
    titleHighlights: mapped.titleHighlights,
    description: mapped.description,
    stacks: mapped.stacks.map(({ id, value, label }) => ({ id, value, label })),
    videoId: mapped.videoId,
    imageUrl: mapped.imageUrl,
  };
}

export function mapHomeFaqs(
  faqs: HomeFaqApi[] | null | undefined
): HomeFaqViewModel[] {
  if (!faqs?.length) return [];
  return faqs
    .filter((faq) => faq.isActive !== false)
    .map((faq) => {
      const question = faq.question?.trim();
      const answer = faq.answer?.trim();
      if (!question || !answer) return null;
      return {
        id: String(faq.id),
        question,
        answer,
      };
    })
    .filter((item): item is HomeFaqViewModel => item !== null);
}

function parsePercentile(raw: string | null | undefined): number | undefined {
  if (!raw?.trim()) return undefined;
  const n = Number.parseFloat(raw.replace(/%/g, "").trim());
  return Number.isFinite(n) ? n : undefined;
}

function parseYear(raw: string | null | undefined): number {
  if (!raw?.trim()) return new Date().getFullYear();
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : new Date().getFullYear();
}

function mapStudent(
  student: StudentResultApi,
  group: StudentResultGroupApi
): TopperResult | null {
  const name = student.fullName?.trim();
  if (!name) return null;
  if (student.isActive === false) return null;

  const categorySlug = group.category?.slug?.trim() || "cat";
  const categoryId: CategoryId =
    slugToCategoryId(categorySlug) ?? "cat";

  const percentile = parsePercentile(student.percentage);
  const rank =
    student.rank != null && Number.isFinite(Number(student.rank))
      ? Number(student.rank)
      : undefined;

  const exam =
    group.result?.overline?.trim() ||
    group.category?.name?.trim() ||
    "Result";

  const batch = student.batch?.trim()
    ? [student.batch.trim()]
    : [];

  return {
    id: String(student.id),
    name,
    batch,
    exam,
    rank,
    percentile,
    college: student.collegeName?.trim() || "",
    year: parseYear(student.examYear),
    image: student.profileImageUrl?.trim() || undefined,
    category: categoryId,
  };
}

export function mapStudentResultGroups(
  groups: StudentResultGroupApi[] | null | undefined
): HomeResultBannerViewModel[] {
  if (!groups?.length) return [];

  return groups
    .map((group): HomeResultBannerViewModel | null => {
      if (!group?.result || !group?.category) return null;

      const toppers = (group.students ?? [])
        .map((student) => mapStudent(student, group))
        .filter((item): item is TopperResult => item !== null);

      if (toppers.length === 0) return null;

      const slug = group.category.slug?.trim();
      if (!slug) return null;

      const title =
        group.result.title?.trim() ||
        group.category.title?.trim() ||
        group.category.name?.trim() ||
        "Results";

      const badge =
        group.result.overline?.trim() ||
        group.category.name?.trim() ||
        "Results";

      return {
        id: String(group.result.id),
        badge,
        title,
        highlight: null,
        subtitle: group.result.subTitle?.trim() || null,
        description: null,
        cta: group.category.name
          ? `View ${group.category.name} Results`
          : "View Results",
        href: `/category/${slug}#results`,
        toppers,
      };
    })
    .filter((item): item is HomeResultBannerViewModel => item !== null);
}

export function mapHomePage(
  data: HomePageApi | null | undefined
): HomePageViewModel | null {
  if (!data) return null;

  return {
    banner: mapHomeBanner(data.banner),
    categories: mapCategories(data.categories),
    faqs: mapHomeFaqs(data.faqs),
    resultBanners: mapStudentResultGroups(data.studentResultGroups),
  };
}
