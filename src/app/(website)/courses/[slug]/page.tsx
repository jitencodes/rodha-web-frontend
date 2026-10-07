import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseDetailPageView } from "@/components/sections/course/CourseDetailPage";
import {
  getCourseBySlug,
  getCoursePath,
  withCourseDetailDefaults,
} from "@/data/course-details";
import { getPackageBySlug } from "@/lib/api/modules/packages/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { getCategoryLandingById } from "@/data/category-landings";
import { withCategoryLandingDefaults } from "@/data/category-landing-defaults";
import { buildPageMetadata } from "@/lib/seo";
import type { CategoryLandingConfig } from "@/lib/types";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

function fallbackLanding(name = "Courses"): CategoryLandingConfig {
  const base = getCategoryLandingById("cat");
  if (base) {
    return withCategoryLandingDefaults({
      ...base,
      name,
      menuLabel: name,
    });
  }
  // Absolute last resort — should not happen when category landings exist.
  return withCategoryLandingDefaults(
    getCategoryLandingById("ipmat") as CategoryLandingConfig
  );
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (pkg) {
    const course = withCourseDetailDefaults(pkg.course, { fillMissing: false });
    return buildPageMetadata({
      title: `${course.title} — Rodha`,
      description: course.shortDescription || course.description,
      path: getCoursePath(course.slug),
      image: course.thumbnail || course.image,
    });
  }

  const match = getCourseBySlug(slug);
  if (!match) {
    return { title: "Course — Rodha" };
  }

  const course = withCourseDetailDefaults(match.course, { fillMissing: false });
  return buildPageMetadata({
    title: `${course.title} — ${match.landing.name} Course — Rodha`,
    description: course.shortDescription || course.description,
    path: getCoursePath(course.slug),
    image: course.thumbnail || course.image,
  });
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { slug } = await params;
  const accessToken = await getAccessToken();
  const pkg = await getPackageBySlug(slug, {
    accessToken: accessToken ?? undefined,
  });

  if (pkg) {
    const categoryLabel =
      pkg.graphyCategories[0] || pkg.course.exam || "Courses";
    const landing = fallbackLanding(categoryLabel);
    return (
      <CourseDetailPageView
        course={pkg.course}
        landing={landing}
        packageId={pkg.packageId}
        isSelfEnrolled={pkg.isSelfEnrolled}
        isLoggedIn={Boolean(accessToken)}
        faqsOverride={pkg.faqs}
        similarPackages={pkg.similar}
        facultyOverride={pkg.faculty}
        testimonialsOverride={pkg.testimonials}
        apiBacked
      />
    );
  }

  const match = getCourseBySlug(slug);
  if (!match) {
    notFound();
  }

  return (
    <CourseDetailPageView course={match.course} landing={match.landing} />
  );
}
