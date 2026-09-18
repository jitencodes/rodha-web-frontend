import { mapWebsiteBanner } from "@/lib/api/modules/banners/mapper";
import { extractYoutubeId } from "@/lib/api/modules/banners/mapper";
import { slugToCategoryId } from "@/lib/api/modules/categories/mapper";
import type {
  CategoryPageApi,
  CategoryPageStudentResultApi,
  CategoryPageSuccessStoryApi,
  CategoryPageTestimonialApi,
} from "@/lib/api/modules/categories/types";
import { mapCourses } from "@/lib/api/modules/courses/mapper";
import { mapFacultyCards } from "@/lib/api/modules/faculty/mapper";
import type { FacultyApi } from "@/lib/api/modules/faculty/types";
import {
  getCategoryLandingBySlug,
} from "@/data/category-landings";
import {
  buildCategoryLandingFallback,
  withCategoryLandingDefaults,
} from "@/data/category-landing-defaults";
import type {
  CategoryId,
  CategoryLandingConfig,
  ResultStat,
  Testimonial,
  TestSeriesItem,
  TopperResult,
} from "@/lib/types";

function parseYear(raw: string | number | null | undefined): number {
  if (raw === null || raw === undefined) return new Date().getFullYear();
  const n = Number.parseInt(String(raw), 10);
  return Number.isFinite(n) ? n : new Date().getFullYear();
}

function parsePercentile(raw: string | number | null | undefined): number | undefined {
  if (raw === null || raw === undefined) return undefined;
  const n = Number.parseFloat(String(raw).replace(/%/g, "").trim());
  return Number.isFinite(n) ? n : undefined;
}

function resolveCategoryId(slug: string, jsonId?: CategoryId): CategoryId {
  return slugToCategoryId(slug) ?? jsonId ?? (slug as CategoryId);
}

function mapResultStudent(
  student: CategoryPageStudentResultApi,
  categoryId: CategoryId,
  examLabel: string
): TopperResult | null {
  if (student.isActive === false) return null;
  const name = student.fullName?.trim();
  if (!name) return null;

  const rank =
    student.rank !== null && student.rank !== undefined
      ? Number(student.rank)
      : undefined;

  return {
    id: String(student.id),
    name,
    image: student.profileImageUrl?.trim() || undefined,
    college: student.collegeName?.trim() || "",
    exam: examLabel,
    batch: student.batch?.trim() ? [student.batch.trim()] : [],
    percentile: parsePercentile(student.percentage),
    rank: Number.isFinite(rank) ? rank : undefined,
    year: parseYear(student.examYear),
    category: categoryId,
  };
}

function mapResults(
  groups: CategoryPageApi["studentResultsByResult"],
  categoryId: CategoryId
): { results: TopperResult[]; resultStats: ResultStat[] } {
  if (!groups?.length) {
    return { results: [], resultStats: [] };
  }

  const results: TopperResult[] = [];
  const resultStats: ResultStat[] = [];

  for (const group of groups) {
    if (!group?.result) continue;
    const examLabel =
      group.result.overline?.trim() ||
      group.result.title?.trim() ||
      "Result";

    for (const student of group.students ?? []) {
      const mapped = mapResultStudent(student, categoryId, examLabel);
      if (mapped) results.push(mapped);
    }

    for (const stack of group.result.stacks ?? []) {
      const count = stack.count?.trim();
      if (!count || !stack.title?.trim()) continue;
      const match = count.match(/^(\d+(?:\.\d+)?)(.*)$/);
      resultStats.push({
        label: stack.title.trim(),
        value: match?.[1] ?? count,
        suffix: match?.[2] ?? "",
      });
    }
  }

  return {
    results,
    resultStats: resultStats.slice(0, 2),
  };
}

function mapTestimonial(
  testimonial: CategoryPageTestimonialApi,
  categoryId: CategoryId
): Testimonial | null {
  if (testimonial.isActive === false) return null;
  const name = testimonial.fullName?.trim();
  const quote = testimonial.reviewText?.trim();
  if (!name || !quote) return null;

  return {
    id: String(testimonial.id),
    name,
    quote,
    image: testimonial.profileImageUrl || undefined,
    college: testimonial.collegeName?.trim() || "",
    exam: testimonial.batch?.trim() || "",
    score: "",
    year: parseYear(testimonial.createdAt),
    category: categoryId,
  };
}

function mapTestimonials(
  testimonials: CategoryPageApi["testimonials"],
  categoryId: CategoryId
): Testimonial[] {
  if (!testimonials?.length) return [];
  return testimonials
    .map((item) => mapTestimonial(item, categoryId))
    .filter((item): item is Testimonial => item !== null);
}

function mapSuccessStories(
  stories: CategoryPageApi["successStories"]
): CategoryLandingConfig["stories"] {
  if (!stories?.length) return [];

  return stories
    .filter((story: CategoryPageSuccessStoryApi) => story.isActive !== false)
    .map((story) => {
      const youtubeId = extractYoutubeId(story.youtubeLink);
      if (!youtubeId) return null;
      return {
        id: String(story.id),
        youtubeId,
        student: story.title?.trim() || "Student Success Story",
        subtitle: story.subTitle?.trim() || "",
      };
    })
    .filter(
      (item): item is CategoryLandingConfig["stories"][number] => item !== null
    );
}

function mapTestSeries(
  api: CategoryPageApi
): TestSeriesItem[] {
  if (!api.testSeries?.length) return [];

  const items: TestSeriesItem[] = [];
  for (const item of api.testSeries) {
    if (item.isActive === false) continue;
    const title = item.title?.trim();
    if (!title) continue;
    const mapped: TestSeriesItem = {
      id: String(item.id),
      value: item.value?.trim() || "",
      title,
      description: item.description?.trim() || "",
      price: item.price?.trim() || "",
      offerPrice: item.offerPrice?.trim() || "",
      href: item.href?.trim() || "",
      icon: item.icon?.trim() || "",
    };
    const image = item.image?.trim();
    if (image) mapped.image = image;
    items.push(mapped);
  }
  return items;
}

export function mapCategoryPage(
  api: CategoryPageApi | null,
  slug: string
): CategoryLandingConfig | null {
  if (!api?.category || api.category.isActive === false) {
    return null;
  }

  const apiSlug = api.category.slug?.trim() || slug.trim();
  const name = api.category.name?.trim() || apiSlug;
  const title = api.category.title?.trim() || name;
  const description = api.category.description?.trim() || "";
  const jsonLanding = getCategoryLandingBySlug(apiSlug);
  const categoryId = resolveCategoryId(apiSlug, jsonLanding?.id);
  const base =
    jsonLanding ??
    buildCategoryLandingFallback({
      slug: apiSlug,
      name,
      title,
      description,
      id: categoryId,
    });

  const { results, resultStats } = mapResults(
    api.studentResultsByResult,
    categoryId
  );

  const facultyMembers = mapFacultyCards(
    api.faculty as FacultyApi[] | null | undefined
  );

  const banner = mapWebsiteBanner(api.banner);
  const primaryCta = banner?.ctas[0];
  const mappedCourses = mapCourses(api.courses, categoryId);
  const mappedTestSeries = mapTestSeries(api);
  const mappedFaqs =
    api.faqs
      ?.filter((faq) => faq.isActive !== false)
      .filter(
        (faq) => Boolean(faq.question?.trim()) && Boolean(faq.answer?.trim())
      )
      .map((faq) => ({
        id: String(faq.id),
        question: faq.question.trim(),
        answer: faq.answer.trim(),
      })) ?? [];

  const mapped: CategoryLandingConfig = {
    ...base,
    id: categoryId,
    name: name || base.name,
    slug: apiSlug,
    fullName: title || base.fullName,
    description: description || base.description,
    metadata: {
      title: title ? `${title} — Rodha` : base.metadata.title,
      description: description || base.metadata.description,
    },
    hero: banner
      ? {
          eyebrow: banner.overline || base.hero.eyebrow,
          title: banner.title || base.hero.title,
          accent: banner.titleHighlights.length
            ? banner.titleHighlights
            : base.hero.accent,
          subtitle: banner.description || base.hero.subtitle,
          primaryCta: primaryCta
            ? { label: primaryCta.label, href: primaryCta.href }
            : base.hero.primaryCta,
          videoId: banner.videoId || undefined,
          imageUrl: banner.imageUrl || undefined,
        }
      : base.hero,
    quickStats: banner?.stacks.length
      ? banner.stacks.map((stack) => ({
          id: stack.id,
          value: stack.value,
          label: stack.label,
          icon: stack.icon || "",
          prefix: stack.prefix,
        }))
      : base.quickStats,
    results,
    resultStats,
    facultyMembers,
    facultyIds: facultyMembers.map((member) => member.id),
    testimonials: mapTestimonials(api.testimonials, categoryId),
    stories: mapSuccessStories(api.successStories),
    faqs: mappedFaqs,
    courses: mappedCourses.length > 0 ? mappedCourses : base.courses,
    // CMS courses/test-series are not live yet; fall back to the static catalog.
    testSeries:
      mappedTestSeries.length > 0 ? mappedTestSeries : base.testSeries,
  };

  return withCategoryLandingDefaults(mapped);
}
