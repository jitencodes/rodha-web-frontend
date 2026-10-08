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
import { getCategoryDropdown } from "@/lib/api/modules/categories/service";
import { getFacultyPage } from "@/lib/api/modules/faculty/service";
import { packageCardToCourse } from "@/lib/api/modules/packages/mapper";
import {
  getPackageCategories,
  getPackages,
  getPackageSubcategories,
} from "@/lib/api/modules/packages/service";
import { getActiveSubjects } from "@/lib/api/modules/subjects/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { getCatalogListings } from "@/lib/catalog";
import { EXTERNAL_URLS } from "@/lib/constants";
import {
  DEFAULT_COURSE_SORT,
  resolveCourseSort,
} from "@/lib/course-sort";
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
    categoryId?: string;
    q?: string;
    type?: string;
    subCategory1?: string;
    facultyId?: string;
    subjectId?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const categoryId =
    params.categoryId?.trim() && params.categoryId !== "all"
      ? params.categoryId.trim()
      : undefined;
  const graphyCategory =
    params.type?.trim() && params.type !== "all"
      ? params.type.trim()
      : undefined;
  const subCategory1 =
    params.subCategory1?.trim() && params.subCategory1 !== "all"
      ? params.subCategory1.trim()
      : undefined;
  const facultyId =
    params.facultyId?.trim() && params.facultyId !== "all"
      ? params.facultyId.trim()
      : undefined;
  const subjectId =
    params.subjectId?.trim() && params.subjectId !== "all"
      ? params.subjectId.trim()
      : undefined;
  const query = params.q?.trim() || undefined;
  const sortPreset = resolveCourseSort(params.sort?.trim());
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);

  const accessToken = await getAccessToken();
  const [
    categoryOptions,
    typeOptions,
    subCategoryOptions,
    facultyPage,
    subjects,
    packagesResult,
    catalog,
  ] = await Promise.all([
    getCategoryDropdown({ limit: 50 }),
    getPackageCategories({
      categoryId,
      limit: 50,
    }),
    getPackageSubcategories({
      categoryId,
      graphyCategory,
      limit: 50,
    }),
    getFacultyPage({
      page: 1,
      limit: 50,
      categoryIds: categoryId,
      subjectIds: subjectId,
    }),
    getActiveSubjects(),
    getPackages(
      {
        page,
        limit: PAGE_SIZE,
        search: query,
        categoryId,
        graphyCategory,
        subCategory1,
        facultyId,
        subjectId,
        sortBy: sortPreset.sortBy,
        sortOrder: sortPreset.sortOrder,
      },
      { accessToken: accessToken ?? undefined }
    ),
    getCatalogListings(),
  ]);

  const facultyOptions =
    facultyPage?.items.map((member) => ({
      value: member.id,
      label: member.name,
    })) ?? [];

  const subjectOptions = subjects
    .filter((subject) =>
      categoryId ? subject.categoryIds.includes(categoryId) : true
    )
    .map((subject) => ({
      value: subject.id,
      label: subject.name,
    }));

  const items = packagesResult.items;

  const isDefaultView =
    !categoryId &&
    !graphyCategory &&
    !subCategory1 &&
    !facultyId &&
    !subjectId &&
    !query &&
    sortPreset.value === DEFAULT_COURSE_SORT;

  const queryForPagination: Record<string, string> = {};
  if (categoryId) queryForPagination.categoryId = categoryId;
  if (query) queryForPagination.q = query;
  if (graphyCategory) queryForPagination.type = graphyCategory;
  if (subCategory1) queryForPagination.subCategory1 = subCategory1;
  if (facultyId) queryForPagination.facultyId = facultyId;
  if (subjectId) queryForPagination.subjectId = subjectId;
  if (sortPreset.value !== DEFAULT_COURSE_SORT) {
    queryForPagination.sort = sortPreset.value;
  }

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

      <section className="relative z-20 bg-section-white home-on-light">
        <Container>
          <CatalogToolbar
            variant="packages"
            basePath="/courses"
            activeCategoryId={categoryId || "all"}
            categoryOptions={categoryOptions}
            initialQuery={query || ""}
            activeType={graphyCategory || "all"}
            typeOptions={typeOptions}
            activeSubCategory1={subCategory1 || "all"}
            subCategoryOptions={subCategoryOptions}
            activeFacultyId={facultyId || "all"}
            facultyOptions={facultyOptions}
            activeSubjectId={subjectId || "all"}
            subjectOptions={subjectOptions}
            activeSort={sortPreset.value}
            searchPlaceholder="Search courses..."
            searchAriaLabel="Search courses"
            tabsAriaLabel="Course subcategories"
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
                const detailHref = packageDetailHref(pkg.slug);
                const ctaLabel = pkg.isSelfEnrolled
                  ? "View Course"
                  : "Buy Now";
                const ctaHref = pkg.isSelfEnrolled
                  ? packageViewCourseHref(pkg.packageId)
                  : pkg.packageId != null
                    ? packageBuyNowHref(pkg.packageId, pkg.slug)
                    : detailHref;

                return (
                  <CourseCardV2
                    key={pkg.id}
                    course={course}
                    className="h-full bg-white"
                    href={detailHref}
                    ctaHref={ctaHref}
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
