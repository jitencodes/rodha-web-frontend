import categoryLandingSource from "./category-landings.json";
import { faculty } from "./faculty";
import type {
  CategoryId,
  CategoryLandingConfig,
  Course,
  Faculty,
  StudentStory,
  Testimonial,
  TopperResult,
} from "@/lib/types";

const categoryLandings =
  categoryLandingSource.categories as unknown as CategoryLandingConfig[];

export function getAllCategoryLandings(): CategoryLandingConfig[] {
  return categoryLandings;
}

export function getCategoryLandingBySlug(
  slug: string
): CategoryLandingConfig | undefined {
  return categoryLandings.find((category) => category.slug === slug);
}

export function getCategoryLandingById(
  id: CategoryId
): CategoryLandingConfig | undefined {
  return categoryLandings.find((category) => category.id === id);
}

export function getCategoryCourses(categoryId: CategoryId): Course[] {
  return getCategoryLandingById(categoryId)?.courses ?? [];
}

export function getCategoryCourse(
  categorySlug: string,
  courseSlug: string
): Course | undefined {
  return getCategoryLandingBySlug(categorySlug)?.courses.find(
    (course) => course.slug === courseSlug
  );
}

export function getCategoryFaculty(
  category: CategoryLandingConfig
): Faculty[] {
  const facultyById = new Map(faculty.map((member) => [member.id, member]));
  return category.facultyIds
    .map((id) => facultyById.get(id))
    .filter((member): member is Faculty => Boolean(member));
}

export function isCategorySlug(slug: string): boolean {
  return categoryLandings.some((category) => category.slug === slug);
}

export function getCategoryPathBySlug(slug: string): string {
  return `/category/${slug}`;
}

export interface ListedTopperResult extends TopperResult {
  categorySlug: string;
}

export interface ListedTestimonial extends Testimonial {
  categorySlug: string;
}

export interface ListedStudentStory extends StudentStory {
  categorySlug: string;
}

/** Static results from every category landing until a listing API exists. */
export function getListedResults(): ListedTopperResult[] {
  return getAllCategoryLandings().flatMap((landing) =>
    (landing.results ?? []).map((result) => ({
      ...result,
      category: landing.id,
      categorySlug: landing.slug,
    }))
  );
}

/** Static testimonials from every category landing until a listing API exists. */
export function getListedTestimonials(): ListedTestimonial[] {
  return getAllCategoryLandings().flatMap((landing) =>
    (landing.testimonials ?? []).map((testimonial) => ({
      ...testimonial,
      category: landing.id,
      categorySlug: landing.slug,
    }))
  );
}

/** Static success stories from every category landing until a listing API exists. */
export function getListedStories(): ListedStudentStory[] {
  return getAllCategoryLandings().flatMap((landing) =>
    (landing.stories ?? []).map((story) => ({
      ...story,
      categorySlug: landing.slug,
    }))
  );
}

export function getCategoryPathById(categoryId: string): string {
  const category = getCategoryLandingById(categoryId as CategoryId);
  return getCategoryPathBySlug(category?.slug ?? categoryId);
}

export {
  buildCategoryLandingFallback,
  withCategoryLandingDefaults,
} from "./category-landing-defaults";
