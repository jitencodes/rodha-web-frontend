import type {
  PackageCardViewModel,
  PackageDetailApi,
  PackageFacultyApi,
  PackageFilterOption,
  PackageListItemApi,
  PackageMasterItemApi,
  PackageTestimonialApi,
} from "@/lib/api/modules/packages/types";
import type { FacultyApi } from "@/lib/api/modules/faculty/types";
import { mapFacultyCards } from "@/lib/api/modules/faculty/mapper";
import { COURSE_IMAGE_FALLBACK } from "@/lib/constants";
import type {
  Course,
  CourseModule,
  Faculty,
  FaqItem,
  Testimonial,
} from "@/lib/types";

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

function firstBatchStart(
  value: string | string[] | null | undefined
): string | undefined {
  if (Array.isArray(value)) {
    const first = value.map((item) => asString(item)).find(Boolean);
    return first || undefined;
  }
  return asString(value) || undefined;
}

function discountFromPrices(
  mrp: number | undefined,
  sale: number
): { originalPrice?: number; discountPercent?: number } {
  if (mrp === undefined || !(mrp > sale)) return {};
  return {
    originalPrice: mrp,
    discountPercent: Math.round(((mrp - sale) / mrp) * 100),
  };
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

  const sale = asNumber(item.discountedPrice ?? item.price);
  const mrp =
    item.price !== null && item.price !== undefined
      ? asNumber(item.price)
      : undefined;
  const { originalPrice, discountPercent } = discountFromPrices(mrp, sale);
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
    price: sale,
    originalPrice,
    discountPercent,
    thumbnail: asString(item.bannerImageUrl) || COURSE_IMAGE_FALLBACK,
    tags: asStringList(item.tags),
    courseCount: asNumber(item.courseCount),
    isSelfEnrolled: item.isSelfEnrolled === true,
    averageRating:
      typeof item.averageRating === "number" ? item.averageRating : null,
    ratingCount: asNumber(item.ratingCount),
    href: `/courses/${slug}`,
    courseTypeLabel:
      asStringList(item.subCategory1)[0] ||
      asStringList(item.graphySubCategory1)[0] ||
      undefined,
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
    discountPercent: pkg.discountPercent,
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

function toFacultyApi(item: PackageFacultyApi): FacultyApi | null {
  const fullName =
    asString(item.fullName) || asString(item.name);
  const slug = asString(item.slug);
  if (!fullName || !slug) return null;
  const idNum =
    typeof item.id === "number"
      ? item.id
      : Number.isFinite(Number(item.id))
        ? Number(item.id)
        : 0;
  return {
    id: idNum || 0,
    slug,
    fullName,
    designation: asString(item.designation) || asString(item.title) || null,
    profileImageUrl:
      asString(item.profileImageUrl) ||
      asString(item.imageUrl) ||
      asString(item.photoUrl) ||
      null,
    about: asString(item.about) || asString(item.bio) || null,
    experienceYears:
      typeof item.experienceYears === "number" ? item.experienceYears : null,
    isFeatured: item.isFeatured === true,
    isActive: item.isActive !== false,
  };
}

function mapPackageFaculty(
  items: PackageFacultyApi[] | null | undefined
): Faculty[] {
  if (!Array.isArray(items)) return [];
  const apis = items
    .map(toFacultyApi)
    .filter((item): item is FacultyApi => Boolean(item));
  return mapFacultyCards(apis);
}

function parseYear(value: string | null | undefined): number {
  if (!value) return new Date().getFullYear();
  const year = Number.parseInt(value.slice(0, 4), 10);
  return Number.isFinite(year) ? year : new Date().getFullYear();
}

function mapPackageTestimonials(
  items: PackageTestimonialApi[] | null | undefined,
  category: Course["category"]
): Testimonial[] {
  if (!Array.isArray(items)) return [];
  const mapped: Testimonial[] = [];
  items.forEach((item, index) => {
    if (item.isActive === false) return;
    const name = asString(item.fullName) || asString(item.name);
    const quote =
      asString(item.reviewText) ||
      asString(item.quote) ||
      asString(item.text);
    if (!name || !quote) return;
    const image =
      asString(item.profileImageUrl) || asString(item.imageUrl) || undefined;
    mapped.push({
      id: asString(item.id) || `testimonial-${index}`,
      name,
      quote,
      ...(image ? { image } : {}),
      college: asString(item.collegeName),
      exam: asString(item.batch) || asString(item.role),
      score: "",
      year: parseYear(item.createdAt),
      category,
    });
  });
  return mapped;
}

export interface PackageDetailViewModel {
  course: Course;
  packageId: number | null;
  isSelfEnrolled: boolean;
  faqs: FaqItem[];
  similar: PackageCardViewModel[];
  graphyCategories: string[];
  graphySubCategory1: string[];
  faculty: Faculty[];
  testimonials: Testimonial[];
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
  const faculty = mapPackageFaculty(data.faculty);
  const duration = asString(data.duration);
  const nextBatch = firstBatchStart(data.batchStarts);
  const days = asString(data.days) || undefined;
  const timing = asString(data.classTiming) || undefined;
  const mode = asString(data.mode) || undefined;
  const level = asString(data.level) || undefined;
  const hasSchedule = Boolean(nextBatch || days || timing || duration || mode);

  const course: Course = {
    ...packageCardToCourse(card),
    description,
    shortDescription: card.subtitle || description,
    duration,
    mode,
    level,
    highlights,
    benefits: benefits.length ? benefits : undefined,
    included: benefits.length ? benefits : undefined,
    modules: modules.length ? modules : undefined,
    faqs: mapPackageFaqs(data.faqs),
    faculty: faculty[0]?.name,
    exam: asStringList(data.graphyCategories)[0] || undefined,
    schedule: hasSchedule
      ? {
          nextBatch,
          days,
          timing,
          duration: duration || undefined,
          mode,
        }
      : undefined,
    detailsLabel: card.isSelfEnrolled ? "View Course" : "Buy Now",
  };

  const category = course.category;

  return {
    course,
    packageId: card.packageId,
    isSelfEnrolled: card.isSelfEnrolled,
    faqs: mapPackageFaqs(data.faqs),
    similar: mapPackageListItems(data.similarPackages),
    graphyCategories: asStringList(data.graphyCategories),
    graphySubCategory1: asStringList(data.graphySubCategory1),
    faculty,
    testimonials: mapPackageTestimonials(data.testimonials, category),
  };
}
