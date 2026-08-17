import categoryLandingSource from "./category-landings.json";
import { faculty } from "./faculty";
import type {
  CategoryId,
  CategoryLandingConfig,
  Course,
  Faculty,
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

export function getCategoryPathById(categoryId: string): string {
  const category = getCategoryLandingById(categoryId as CategoryId);
  return getCategoryPathBySlug(category?.slug ?? categoryId);
}
