import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryLandingPage } from "@/components/sections/CategoryLandingPage";
import type { CategoryCourseCard } from "@/components/sections/CategoryCoursesSlider";
import { getCategoryPage } from "@/lib/api/modules/categories/service";
import { packageCardToCourse } from "@/lib/api/modules/packages/mapper";
import {
  getPackages,
  getPackageSubcategories,
  resolveGraphyCategory,
} from "@/lib/api/modules/packages/service";
import { buildPageMetadata } from "@/lib/seo";

interface CategoryPageProps {
  params: Promise<{
    category_slug: string;
  }>;
  searchParams: Promise<{
    type?: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category_slug } = await params;

  const category = await getCategoryPage(category_slug);

  if (!category) {
    return {
      title: "Category — Rodha",
    };
  }

  return buildPageMetadata({
    title: category.metadata.title,
    description: category.metadata.description,
    path: `/category/${category.slug}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category_slug } = await params;
  const { type } = await searchParams;

  const category = await getCategoryPage(category_slug);

  if (!category) {
    notFound();
  }

  const subCategory1 =
    type?.trim() && type !== "all" ? type.trim() : undefined;

  const [graphyCategory, courseTypeOptions] = await Promise.all([
    resolveGraphyCategory(category.name).then(
      async (resolved) =>
        resolved ?? (await resolveGraphyCategory(category.slug))
    ),
    getPackageSubcategories(),
  ]);

  const packagesResult = await getPackages({
    page: 1,
    limit: 40,
    graphyCategory: graphyCategory ?? undefined,
    subCategory1,
  });

  const packageCourses: CategoryCourseCard[] = packagesResult.items.map(
    (pkg) => ({
      ...packageCardToCourse(pkg, category.id),
      packageId: pkg.packageId,
      isSelfEnrolled: pkg.isSelfEnrolled,
      detailsLabel: pkg.isSelfEnrolled ? "View Course" : "Buy Now",
    })
  );

  return (
    <CategoryLandingPage
      category={category}
      packageCourses={packageCourses}
      courseTypeOptions={courseTypeOptions}
      activeCourseType={subCategory1 || "all"}
    />
  );
}
