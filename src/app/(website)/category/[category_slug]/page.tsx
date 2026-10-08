import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryLandingPage } from "@/components/sections/CategoryLandingPage";
import type { CategoryCourseCard } from "@/components/sections/CategoryCoursesSlider";
import { getCategoryPageDetail } from "@/lib/api/modules/categories/service";
import { getAccessToken, getSessionUser } from "@/lib/auth/server-session";
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

  const detail = await getCategoryPageDetail(category_slug);

  if (!detail) {
    return {
      title: "Category — Rodha",
    };
  }

  return buildPageMetadata({
    title: detail.category.metadata.title,
    description: detail.category.metadata.description,
    path: `/category/${detail.category.slug}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category_slug } = await params;
  const { type } = await searchParams;
  const [sessionUser, accessToken] = await Promise.all([
    getSessionUser(),
    getAccessToken(),
  ]);

  const detail = await getCategoryPageDetail(category_slug, {
    accessToken: accessToken ?? undefined,
  });

  if (!detail) {
    notFound();
  }

  const { category, packages } = detail;
  const courseTypeOptions = packages?.courseTypeOptions ?? [];
  const requestedType = type?.trim() && type !== "all" ? type.trim() : undefined;
  const activeType =
    requestedType &&
    courseTypeOptions.some((option) => option.value === requestedType)
      ? requestedType
      : "all";

  let packageCourses: CategoryCourseCard[] | undefined;
  if (packages) {
    if (activeType === "all") {
      packageCourses = packages.allItems;
    } else {
      const group = packages.groups.find((g) => g.subCategory1 === activeType);
      packageCourses = group?.items ?? [];
    }
  }

  return (
    <CategoryLandingPage
      category={category}
      packageCourses={packageCourses}
      courseTypeOptions={courseTypeOptions}
      activeCourseType={activeType}
      viewAllCoursesHref={
        category.cmsCategoryId != null
          ? `/courses?categoryId=${category.cmsCategoryId}`
          : "/courses"
      }
      isLoggedIn={Boolean(sessionUser)}
    />
  );
}
