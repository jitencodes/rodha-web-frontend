import {
  getActiveCategories,
  getCategoryPage,
} from "@/lib/api/modules/categories/service";
import {
  COURSE_FILTERS,
  isCourseFree,
  isTestSeriesFree,
  type CourseFilterId,
  type PriceFilterId,
} from "@/lib/course-filters";
import type { Course, StudentStory, TestSeriesItem } from "@/lib/types";

export const CATALOG_ITEMS_PER_PAGE = 10;

export interface CatalogCourse extends Course {
  categorySlug: string;
}

export interface CatalogTestSeriesItem extends TestSeriesItem {
  categorySlug: string;
}

export interface CatalogListings {
  courses: CatalogCourse[];
  testSeries: CatalogTestSeriesItem[];
  stories: StudentStory[];
}

export interface CatalogQuery {
  category: string;
  query: string;
  type: CourseFilterId;
  price: PriceFilterId;
  page: number;
}

export function parseCatalogSearchParams(params: {
  category?: string;
  q?: string;
  type?: string;
  price?: string;
  page?: string;
}): CatalogQuery {
  const typeRaw = params.type?.trim() || "all";
  const type = COURSE_FILTERS.some((filter) => filter.id === typeRaw)
    ? (typeRaw as CourseFilterId)
    : "all";

  const priceRaw = params.price?.trim() || "all";
  const price: PriceFilterId =
    priceRaw === "paid" || priceRaw === "free" ? priceRaw : "all";

  return {
    category: params.category?.trim() || "all",
    query: params.q?.trim() || "",
    type,
    price,
    page: Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1),
  };
}

export function catalogQueryRecord(
  query: Pick<CatalogQuery, "category" | "query" | "type" | "price">
): Record<string, string> {
  const record: Record<string, string> = {};

  if (query.category && query.category !== "all") {
    record.category = query.category;
  }
  if (query.query) {
    record.q = query.query;
  }
  if (query.type && query.type !== "all") {
    record.type = query.type;
  }
  if (query.price && query.price !== "all") {
    record.price = query.price;
  }

  return record;
}

export async function getCatalogListings(): Promise<CatalogListings> {
  const categories = await getActiveCategories();
  if (categories.length === 0) {
    return { courses: [], testSeries: [], stories: [] };
  }

  const pages = await Promise.all(
    categories.map((category) => getCategoryPage(category.slug))
  );

  const courses: CatalogCourse[] = [];
  const courseKeys = new Set<string>();
  const testSeries: CatalogTestSeriesItem[] = [];
  const testKeys = new Set<string>();
  const stories: StudentStory[] = [];
  const storyKeys = new Set<string>();

  for (const page of pages) {
    if (!page) continue;
    const categorySlug = page.slug;

    for (const course of page.courses) {
      const key = course.id || course.slug;
      if (!key || courseKeys.has(key)) continue;
      courseKeys.add(key);
      courses.push({ ...course, categorySlug });
    }

    for (const item of page.testSeries) {
      const key = item.id;
      if (!key || testKeys.has(key)) continue;
      testKeys.add(key);
      testSeries.push({ ...item, categorySlug });
    }

    for (const story of page.stories) {
      const key = story.youtubeId || story.id;
      if (!key || storyKeys.has(key)) continue;
      storyKeys.add(key);
      stories.push(story);
    }
  }

  return { courses, testSeries, stories };
}

function matchesSearch(haystack: string, query: string): boolean {
  if (!query) return true;
  return haystack.toLowerCase().includes(query.toLowerCase());
}

export function filterCatalogCourses(
  courses: CatalogCourse[],
  filters: Pick<CatalogQuery, "category" | "query" | "type" | "price">
): CatalogCourse[] {
  return courses.filter((course) => {
    if (
      filters.category !== "all" &&
      course.categorySlug !== filters.category
    ) {
      return false;
    }
    if (filters.type !== "all" && course.courseType !== filters.type) {
      return false;
    }
    if (filters.price === "free" && !isCourseFree(course)) return false;
    if (filters.price === "paid" && isCourseFree(course)) return false;
    return matchesSearch(
      `${course.title} ${course.shortDescription} ${course.description}`,
      filters.query
    );
  });
}

export function filterCatalogTestSeries(
  items: CatalogTestSeriesItem[],
  filters: Pick<CatalogQuery, "category" | "query" | "price">
): CatalogTestSeriesItem[] {
  return items.filter((item) => {
    if (filters.category !== "all" && item.categorySlug !== filters.category) {
      return false;
    }
    if (filters.price === "free" && !isTestSeriesFree(item)) return false;
    if (filters.price === "paid" && isTestSeriesFree(item)) return false;
    return matchesSearch(`${item.title} ${item.description}`, filters.query);
  });
}

export function paginateCatalog<T>(
  items: T[],
  page: number,
  limit = CATALOG_ITEMS_PER_PAGE
): {
  items: T[];
  total: number;
  totalPages: number;
  page: number;
} {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit) || 1);
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    total,
    totalPages,
    page: safePage,
  };
}
