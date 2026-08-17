import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import {
  getAllCategoryLandings,
  getCategoryCourse,
  getCategoryLandingBySlug,
  getCategoryPathBySlug,
} from "@/data/category-landings";
import { breadcrumbJsonLd } from "@/lib/structured-data";

interface CourseDetailPageProps {
  params: Promise<{ category_slug: string; slug: string }>;
}

export function generateStaticParams() {
  return getAllCategoryLandings().flatMap((category) =>
    category.courses.map((course) => ({
      category_slug: category.slug,
      slug: course.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { category_slug, slug } = await params;
  const category = getCategoryLandingBySlug(category_slug);
  const course = getCategoryCourse(category_slug, slug);

  if (!category || !course) {
    return { title: "Course — Rodha" };
  }

  return {
    title: `${course.title} — ${category.name} Course — Rodha`,
    description: course.shortDescription || course.description,
  };
}

export default async function CategoryCourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { category_slug, slug } = await params;
  const category = getCategoryLandingBySlug(category_slug);
  const course = getCategoryCourse(category_slug, slug);

  if (!category || !course) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { label: "Home", href: "/" },
              {
                label: category.menuLabel,
                href: getCategoryPathBySlug(category.slug),
              },
              { label: course.title },
            ])
          ),
        }}
      />
      <section className="home-section-spacing home-on-light bg-section-white">
        <Container>
          <p className="section-header-badge text-body-sm uppercase tracking-wider text-white bg-[#F06B23] rounded-full px-4 py-1.5 w-fit font-semibold mb-5">
            {category.menuLabel}
          </p>
          <h1 className="text-h1 md:text-hero font-bold text-neutral-900">
            {course.title}
          </h1>
          <p className="mt-4 text-body-lg text-neutral-600 max-w-3xl">
            {course.shortDescription || course.description}
          </p>
          <div className="mt-8 rounded-[6px] border border-[#FFEAD6] bg-[#FFF3E8] p-5 md:p-6">
            <p className="text-body text-neutral-700">
              Full course curriculum, pricing, and enrolment details are coming
              soon. Meanwhile, explore more programs on the{" "}
              <a
                href={getCategoryPathBySlug(category.slug)}
                className="font-semibold text-orange-500 hover:text-orange-600"
              >
                {category.name} category page
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
