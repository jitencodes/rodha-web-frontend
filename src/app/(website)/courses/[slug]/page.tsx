import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseDetailPageView } from "@/components/sections/course/CourseDetailPage";
import {
  getCourseBySlug,
  getCoursePath,
  withCourseDetailDefaults,
} from "@/data/course-details";
import type { CoursePurchaseDiscountProps } from "@/components/cards/CoursePurchaseCard";
import type { PackageDetailViewModel } from "@/lib/api/modules/packages/mapper";
import { getPackageBySlug } from "@/lib/api/modules/packages/service";
import { mapCheckoutPromocodeOptions } from "@/lib/api/modules/student/cart/mapper";
import { getPackagePromocodes } from "@/lib/api/modules/student/cart/service";
import type { CheckoutPromocodeOption } from "@/lib/api/modules/student/cart/types";
import { getCurrentDiscountRequestOrNull } from "@/lib/api/modules/student/discount-requests/service";
import { getAccessToken, getSessionUser } from "@/lib/auth/server-session";
import { getCategoryLandingById } from "@/data/category-landings";
import { withCategoryLandingDefaults } from "@/data/category-landing-defaults";
import { buildPageMetadata } from "@/lib/seo";
import type { CategoryLandingConfig } from "@/lib/types";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkoutError?: string }>;
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

/** Request Discount button state (packages only, not for enrolled students). */
async function loadDiscountCta(
  pkg: PackageDetailViewModel,
  slug: string,
  accessToken: string | null
): Promise<CoursePurchaseDiscountProps | undefined> {
  if (pkg.packageId == null || pkg.isSelfEnrolled) return undefined;
  const loginHref = `/login?next=${encodeURIComponent(getCoursePath(slug))}`;
  if (!accessToken) {
    return {
      websiteCategoryId: pkg.websiteCategoryId,
      current: null,
      student: null,
      loginHref,
    };
  }
  const [current, user] = await Promise.all([
    getCurrentDiscountRequestOrNull(
      accessToken,
      pkg.packageId,
      pkg.websiteCategoryId
    ),
    getSessionUser(),
  ]);
  return {
    websiteCategoryId: pkg.websiteCategoryId,
    current,
    student: {
      name: user?.fullName ?? "",
      email: user?.email ?? "",
      mobile: user?.mobile ?? "",
    },
    loginHref,
  };
}

/** Listed promocodes for the purchase card (logged-in, purchasable packages). */
async function loadPromocodeOffers(
  pkg: PackageDetailViewModel,
  accessToken: string | null
): Promise<CheckoutPromocodeOption[]> {
  if (!accessToken || pkg.packageId == null || pkg.isSelfEnrolled) return [];
  try {
    const promos = await getPackagePromocodes(
      accessToken,
      pkg.packageId,
      pkg.websiteCategoryId
    );
    return mapCheckoutPromocodeOptions(promos);
  } catch {
    return [];
  }
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
  searchParams,
}: CourseDetailPageProps) {
  const { slug } = await params;
  const { checkoutError } = await searchParams;
  const accessToken = await getAccessToken();
  const pkg = await getPackageBySlug(slug, {
    accessToken: accessToken ?? undefined,
  });

  if (pkg) {
    const categoryLabel =
      pkg.graphyCategories[0] || pkg.course.exam || "Courses";
    const landing = fallbackLanding(categoryLabel);
    const [discount, promocodeOffers] = await Promise.all([
      loadDiscountCta(pkg, slug, accessToken),
      loadPromocodeOffers(pkg, accessToken),
    ]);
    return (
      <CourseDetailPageView
        course={pkg.course}
        landing={landing}
        packageId={pkg.packageId}
        isSelfEnrolled={pkg.isSelfEnrolled}
        isLoggedIn={Boolean(accessToken)}
        discount={discount}
        promocodeOffers={promocodeOffers}
        faqsOverride={pkg.faqs}
        similarPackages={pkg.similar}
        facultyOverride={pkg.faculty}
        testimonialsOverride={pkg.testimonials}
        apiBacked
        checkoutError={checkoutError}
      />
    );
  }

  const match = getCourseBySlug(slug);
  if (!match) {
    notFound();
  }

  return (
    <CourseDetailPageView
      course={match.course}
      landing={match.landing}
      checkoutError={checkoutError}
    />
  );
}
