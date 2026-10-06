import type { Metadata } from "next";
import Link from "next/link";

import { CatalogToolbar } from "@/app/(website)/courses/CatalogToolbar";
import { CourseCardV2 } from "@/components/cards/CourseCardV2";
import { Container } from "@/components/layout/Container";
import { StoriesModal } from "@/components/layout/VideoModal";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
import { ListingHeroSection } from "@/components/sections/listing/ListingHeroSection";
import { SuccessStoriesSection } from "@/components/sections/SuccessStoriesSection";
import { Pagination } from "@/components/ui/Pagination";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { packageCardToCourse } from "@/lib/api/modules/packages/mapper";
import {
  getPackageCategories,
  getPackages,
  getPackageSubcategories,
} from "@/lib/api/modules/packages/service";
import { getCatalogListings } from "@/lib/catalog";
import { EXTERNAL_URLS } from "@/lib/constants";
import {
  packageBuyNowHref,
  packageDetailHref,
  packageViewCourseHref,
} from "@/lib/packages/buy-now";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "Courses — Rodha",
  description:
    "Browse Rodha courses across CAT, IPMAT, CLAT, SSC, and Skill House — comprehensive programs, sectional courses, crash batches, paid and free.",
  path: "/courses",
});

const LISTING_BANNER = "/assets/images/courses/banner/banner.png";
const PAGE_SIZE = 12;

interface CoursesPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    type?: string;
    price?: string;
    page?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const graphyCategory =
    params.category?.trim() && params.category !== "all"
      ? params.category.trim()
      : undefined;
  const subCategory1 =
    params.type?.trim() && params.type !== "all"
      ? params.type.trim()
      : undefined;
  const query = params.q?.trim() || undefined;
  const price = params.price?.trim() || "all";
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);

  const [categoryOptions, courseTypeOptions, packagesResult, catalog] =
    await Promise.all([
      getPackageCategories(),
      getPackageSubcategories(),
      getPackages({
        page,
        limit: PAGE_SIZE,
        search: query,
        graphyCategory,
        subCategory1,
      }),
      getCatalogListings(),
    ]);

  let items = packagesResult.items;
  if (price === "free") {
    items = items.filter((item) => item.price === 0);
  } else if (price === "paid") {
    items = items.filter((item) => item.price > 0);
  }

  const isDefaultView =
    !graphyCategory && !subCategory1 && !query && price === "all";

  const queryForPagination: Record<string, string> = {};
  if (graphyCategory) queryForPagination.category = graphyCategory;
  if (query) queryForPagination.q = query;
  if (subCategory1) queryForPagination.type = subCategory1;
  if (price !== "all") queryForPagination.price = price;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { label: "Home", href: "/" },
              { label: "Courses" },
            ])
          ),
        }}
      />

      <ListingHeroSection
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Courses" },
        ]}
        eyebrow="Courses"
        title="Programs that turn preparation into"
        accent="selection"
        subtitle="Browse comprehensive programs, sectional courses, and crash batches across CAT, IPMAT, CLAT, SSC, and Skill House."
        imageSrc={LISTING_BANNER}
        imageAlt="Graduation cap and books"
      />

      <section className="bg-section-white home-on-light">
        <Container>
          <CatalogToolbar
            basePath="/courses"
            activeCategory={graphyCategory || "all"}
            categoryOptions={categoryOptions}
            initialQuery={query || ""}
            activeType={subCategory1 || "all"}
            courseTypeOptions={courseTypeOptions}
            activePrice={price}
            showCourseType={courseTypeOptions.length > 0}
            searchPlaceholder="Search courses..."
            searchAriaLabel="Search courses"
            categoryAriaLabel="Course categories"
          />
        </Container>
      </section>

      <section
        className={cn(
          "home-section-spacing bg-section-white home-on-light",
          "!pt-0"
        )}
      >
        <Container>
          <div className="flex items-center justify-between mb-6">
            <div className="text-h3 font-semibold text-neutral-900">
              {isDefaultView
                ? "All Courses"
                : `${packagesResult.total} Result${packagesResult.total === 1 ? "" : "s"}`}
            </div>

            {!isDefaultView && (
              <Link
                href="/courses"
                className="text-body-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                Clear filters
              </Link>
            )}
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.map((pkg) => {
                const course = packageCardToCourse(pkg);
                const href = pkg.isSelfEnrolled
                  ? packageViewCourseHref(pkg.packageId)
                  : packageDetailHref(pkg.slug);
                const ctaLabel = pkg.isSelfEnrolled
                  ? "View Course"
                  : "Buy Now";
                const buyHref =
                  pkg.packageId != null
                    ? packageBuyNowHref(pkg.packageId, pkg.slug)
                    : packageDetailHref(pkg.slug);

                return (
                  <CourseCardV2
                    key={pkg.id}
                    course={course}
                    className="h-full bg-white"
                    href={pkg.isSelfEnrolled ? href : buyHref}
                    ctaLabel={ctaLabel}
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-section-beige bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-h4 font-semibold text-neutral-900">
                No courses found
              </p>
              <p className="mt-2 text-body text-neutral-500">
                {query
                  ? "We couldn't find any courses matching your search. Try a different keyword or browse another category."
                  : "There are no courses matching these filters at the moment. Please try another category or type."}
              </p>
              <Link
                href="/courses"
                className="inline-block mt-5 text-body-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                Clear filters
              </Link>
            </div>
          )}

          {packagesResult.totalPages > 1 && (
            <Pagination
              currentPage={packagesResult.page}
              totalPages={packagesResult.totalPages}
              basePath="/courses"
              query={queryForPagination}
              variant="light"
              className="pt-8"
            />
          )}
        </Container>
      </section>

      <SuccessStoriesSection
        stories={catalog.stories}
        subtitle="They were exactly where you are today — hear their stories, in their own words."
        className="bg-section-beige home-on-light"
      />
      {catalog.stories.length > 0 ? <StoriesModal /> : null}

      <RevealGroup>
        <CTABandV2Decorative
          title="Ready to Begin Your Journey?"
          subtitle="Explore our programs or connect with Rodha Buddy for personalised guidance."
          backgroundImage="/assets/images/background/cta background image.JPG"
          decorativeImage="/assets/images/about us/award-to-boy.png"
          primaryAction={{
            label: "Browse Courses",
            href: "/courses",
          }}
          secondaryAction={{
            label: "Ask Rodha Buddy",
            href: EXTERNAL_URLS.rodhaBuddy,
          }}
          className="reveal-child reveal-delay-1"
        />
      </RevealGroup>
    </>
  );
}
