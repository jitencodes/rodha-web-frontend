import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryLandingPage } from "@/components/sections/CategoryLandingPage";
import {
  getAllCategoryLandings,
  getCategoryLandingBySlug,
} from "@/data/category-landings";

interface CategoryPageProps {
  params: Promise<{ category_slug: string }>;
}

export function generateStaticParams() {
  return getAllCategoryLandings().map((category) => ({
    category_slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category_slug } = await params;
  const category = getCategoryLandingBySlug(category_slug);

  if (!category) {
    return { title: "Category — Rodha" };
  }

  return {
    title: category.metadata.title,
    description: category.metadata.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category_slug } = await params;
  const category = getCategoryLandingBySlug(category_slug);

  if (!category) {
    notFound();
  }

  return <CategoryLandingPage category={category} />;
}
