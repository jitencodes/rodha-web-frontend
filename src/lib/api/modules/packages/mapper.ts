import type {
  PackageCardViewModel,
  PackageDetailApi,
  PackageFilterOption,
  PackageListItemApi,
  PackageMasterItemApi,
} from "@/lib/api/modules/packages/types";
import { COURSE_IMAGE_FALLBACK } from "@/lib/constants";
import type { Course, CourseModule, FaqItem } from "@/lib/types";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    if (typeof value === "string" && value.trim()) return [value.trim()];
    return [];
  }
  return value
    .map((item) => asString(item))
    .filter(Boolean);
}

export function mapPackageMasterOptions(
  items: PackageMasterItemApi[] | null | undefined
): PackageFilterOption[] {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  const options: PackageFilterOption[] = [];
  for (const item of items) {
    const value =
      asString(item.value) ||
      asString(item.name) ||
      asString(item.label) ||
      asString(item.slug);
    if (!value || seen.has(value)) continue;
    seen.add(value);
    options.push({
      value,
      label: asString(item.label) || asString(item.name) || value,
    });
  }
  return options;
}

export function mapPackageListItem(
  item: PackageListItemApi | null | undefined
): PackageCardViewModel | null {
  if (!item) return null;
  const title = asString(item.title);
  const slug = asString(item.slug);
  if (!title || !slug) return null;

  const price = asNumber(item.discountedPrice ?? item.price);
  const original =
    item.price !== null && item.price !== undefined
      ? asNumber(item.price)
      : undefined;
  const packageId =
    typeof item.id === "number"
      ? item.id
      : Number.isFinite(Number(item.id))
        ? Number(item.id)
        : null;

  return {
    id: String(item.id ?? slug),
    packageId,
    slug,
    title,
    subtitle: asString(item.subtitle),
    language: asString(item.language) || undefined,
    price,
    originalPrice:
      original !== undefined && original > price ? original : undefined,
    thumbnail: asString(item.bannerImageUrl) || COURSE_IMAGE_FALLBACK,
    tags: asStringList(item.tags),
    courseCount: asNumber(item.courseCount),
    isSelfEnrolled: item.isSelfEnrolled === true,
    averageRating:
      typeof item.averageRating === "number" ? item.averageRating : null,
    ratingCount: asNumber(item.ratingCount),
    href: `/courses/${slug}`,
    courseTypeLabel: asStringList(item.graphySubCategory1)[0] || undefined,
  };
}

export function mapPackageListItems(
  items: PackageListItemApi[] | null | undefined
): PackageCardViewModel[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => mapPackageListItem(item))
    .filter((item): item is PackageCardViewModel => Boolean(item));
}

/** Map package card → existing `Course` shape for CourseCardV2. */
export function packageCardToCourse(
  pkg: PackageCardViewModel,
  categoryFallback: Course["category"] = "cat"
): Course {
  return {
    id: pkg.id,
    title: pkg.title,
    slug: pkg.slug,
    language: pkg.language,
    category: categoryFallback,
    description: pkg.subtitle || pkg.title,
    shortDescription: pkg.subtitle || pkg.title,
    price: pkg.price,
    originalPrice: pkg.originalPrice,
    duration: pkg.courseCount > 0 ? `${pkg.courseCount} courses` : "",
    features: [],
    highlights: pkg.tags,
    enrollmentUrl: "",
    thumbnail: pkg.thumbnail,
    image: pkg.thumbnail,
    tags: pkg.tags,
    detailsLabel: pkg.isSelfEnrolled ? "View Course" : "Buy Now",
    caourseCount: pkg.courseCount,
  };
}

function mapCurriculumModules(
  nodes: PackageDetailApi["courses"]
): CourseModule[] {
  if (!Array.isArray(nodes)) return [];
  const modules: CourseModule[] = [];
  nodes.forEach((node, index) => {
    const title = asString(node.title);
    if (!title) return;
    const children = Array.isArray(node.items) ? node.items : [];
    const lectureTitles = children
      .map((child) => asString(child.title))
      .filter(Boolean);
    modules.push({
      id: asString(node.id) || `module-${index}`,
      title,
      lectures: lectureTitles.length
        ? `${lectureTitles.length} items`
        : undefined,
      description: lectureTitles.length
        ? lectureTitles.join(" · ")
        : undefined,
    });
  });
  return modules;
}

function mapPackageFaqs(faqs: PackageDetailApi["faqs"]): FaqItem[] {
  if (!Array.isArray(faqs)) return [];
  return faqs
    .map((faq, index) => {
      const question = asString(faq.question);
      const answer = asString(faq.answer);
      if (!question || !answer) return null;
      return {
        id: asString(faq.id) || `faq-${index}`,
        question,
        answer,
      };
    })
    .filter((item): item is FaqItem => Boolean(item));
}

export interface PackageDetailViewModel {
  course: Course;
  packageId: number | null;
  isSelfEnrolled: boolean;
  faqs: FaqItem[];
  similar: PackageCardViewModel[];
  graphyCategories: string[];
  graphySubCategory1: string[];
  facultyNames: string[];
}

export function mapPackageDetail(
  data: PackageDetailApi | null | undefined
): PackageDetailViewModel | null {
  if (!data) return null;
  const card = mapPackageListItem(data);
  if (!card) return null;

  const description =
    asString(data.description) || card.subtitle || card.title;
  const highlights = asStringList(data.highlights);
  const benefits = asStringList(data.benefits);
  const modules = mapCurriculumModules(data.courses);
  const facultyNames = Array.isArray(data.faculty)
    ? data.faculty.map((f) => asString(f.name)).filter(Boolean)
    : [];
  const duration =
    asString(data.duration) ||
    (card.courseCount > 0 ? `${card.courseCount} courses` : "");

  const course: Course = {
    ...packageCardToCourse(card),
    description,
    shortDescription: card.subtitle || description,
    duration,
    mode: asString(data.mode) || undefined,
    level: asString(data.level) || undefined,
    highlights: highlights.length ? highlights : card.tags,
    benefits: benefits.length ? benefits : undefined,
    included: benefits.length ? benefits : undefined,
    modules: modules.length ? modules : undefined,
    faqs: mapPackageFaqs(data.faqs),
    faculty: facultyNames[0],
    exam: asStringList(data.graphyCategories)[0] || undefined,
    schedule:
      data.batchStarts || data.days || data.classTiming
        ? {
            nextBatch: asString(data.batchStarts) || undefined,
            days: asString(data.days) || undefined,
            timing: asString(data.classTiming) || undefined,
          }
        : undefined,
    detailsLabel: card.isSelfEnrolled ? "View Course" : "Buy Now",
  };

  return {
    course,
    packageId: card.packageId,
    isSelfEnrolled: card.isSelfEnrolled,
    faqs: mapPackageFaqs(data.faqs),
    similar: mapPackageListItems(data.similarPackages),
    graphyCategories: asStringList(data.graphyCategories),
    graphySubCategory1: asStringList(data.graphySubCategory1),
    facultyNames,
  };
}
