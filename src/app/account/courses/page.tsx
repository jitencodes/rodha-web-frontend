import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AccountBuyCoursesToolbar } from "@/components/account/AccountBuyCoursesToolbar";
import { AccountContinueCoursesToolbar } from "@/components/account/AccountContinueCoursesToolbar";
import { AccountContinueWatchingCard } from "@/components/account/AccountContinueWatchingCard";
import { AccountLiveClassesSection } from "@/components/account/AccountLiveClassesSection";
import { AccountPagination } from "@/components/account/AccountPagination";
import { AccountQuickActionTiles } from "@/components/account/AccountQuickActionTiles";
import { CourseArchiveButton } from "@/components/account/CourseArchiveButton";
import { CourseCardV2 } from "@/components/cards/CourseCardV2";
import type { AccountLiveContentItem } from "@/lib/api/modules/student/courses/mapper";
import {
  parseCoursesTab,
  parsePageParam,
  type CoursesTab,
} from "@/lib/account/pagination";
import { getCategoryDropdown } from "@/lib/api/modules/categories/service";
import { packageCardToCourse } from "@/lib/api/modules/packages/mapper";
import {
  getPackageCategories,
  getPackages,
  getPackageSubcategories,
} from "@/lib/api/modules/packages/service";
import {
  getArchivedCourseCount,
  getStudentCourseFilterOptions,
  getStudentCourses,
} from "@/lib/api/modules/student/courses/service";
import {
  isUnauthorizedError,
  redirectSessionExpired,
  withStudentAuth,
} from "@/lib/auth/require-student";
import {
  DEFAULT_COURSE_SORT,
  resolveCourseSort,
} from "@/lib/course-sort";
import {
  packageBuyNowHref,
  packageViewCourseHref,
} from "@/lib/packages/buy-now";
import { buildPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: "My Courses — Rodha",
  description: "Continue watching and browse Rodha courses.",
  path: "/account/courses",
});

interface AccountCoursesPageProps {
  searchParams: Promise<{
    tab?: string;
    page?: string;
    packageId?: string;
    type?: string;
    q?: string;
    search?: string;
    categoryId?: string;
    subCategory1?: string;
    sortBy?: string;
    sort?: string;
    validTillFrom?: string;
    validTillTo?: string;
  }>;
}

const TABS: { id: CoursesTab; label: string }[] = [
  { id: "continue", label: "Continue Watching" },
  { id: "archived", label: "Archived" },
  { id: "buy", label: "Buy Courses" },
];

const PAGE_SIZE = 8;

const CONTINUE_SORTS = new Set([
  "continue_watching",
  "last_updated",
  "recently_purchased",
  "recently_viewed",
]);

export default async function AccountCoursesPage({
  searchParams,
}: AccountCoursesPageProps) {
  const params = await searchParams;
  const tab = parseCoursesTab(params.tab);
  const isArchivedTab = tab === "archived";
  /** Continue Watching and Archived: the same list, split by archive state. */
  const isEnrolledTab = tab !== "buy";
  const page = parsePageParam(params.page);
  const packageId =
    params.packageId?.trim() && params.packageId !== "all"
      ? params.packageId.trim()
      : undefined;
  const query = (params.q ?? params.search)?.trim() || undefined;
  const categoryId =
    params.categoryId?.trim() && params.categoryId !== "all"
      ? params.categoryId.trim()
      : undefined;
  const subCategory1 =
    params.subCategory1?.trim() && params.subCategory1 !== "all"
      ? params.subCategory1.trim()
      : undefined;
  const graphyCategory =
    params.type?.trim() && params.type !== "all"
      ? params.type.trim()
      : undefined;
  const continueSort =
    params.sortBy?.trim() && CONTINUE_SORTS.has(params.sortBy.trim())
      ? params.sortBy.trim()
      : "continue_watching";
  const buySortPreset = resolveCourseSort(params.sort?.trim());
  const validTillFrom = params.validTillFrom?.trim() || undefined;
  const validTillTo = params.validTillTo?.trim() || undefined;

  const {
    todayContents,
    continueItems,
    continueTotalPages,
    continuePage,
    continueLoaded,
    buyItems,
    buyMeta,
    continueFilterOptions,
    buyCategoryOptions,
    buyTypeOptions,
    buySubCategoryOptions,
    archivedCount,
  } = await withStudentAuth(async (accessToken) => {
    let todayContents: AccountLiveContentItem[] = [];
    let continueItems: Awaited<
      ReturnType<typeof getStudentCourses>
    >["items"] = [];
    let continueTotalPages = 1;
    let continuePage = page;
    let continueLoaded = false;
    let buyItems: ReturnType<typeof packageCardToCourse>[] = [];
    let buyMeta = { page: 1, totalPages: 1 };
    let continueFilterOptions = {
      packages: [] as { value: string; label: string }[],
      categories: [] as { value: string; label: string }[],
      subCategories: [] as { value: string; label: string }[],
      courses: [] as { value: string; label: string }[],
    };
    let buyCategoryOptions: { value: string; label: string }[] = [];
    let buyTypeOptions: { value: string; label: string }[] = [];
    let buySubCategoryOptions: { value: string; label: string }[] = [];

    const archivedCountPromise = getArchivedCourseCount(accessToken);

    if (isEnrolledTab) {
      try {
        const [result, filterOptions] = await Promise.all([
          getStudentCourses(accessToken, {
            page,
            limit: PAGE_SIZE,
            search: query,
            sortBy: continueSort,
            packageId,
            categoryId,
            subCategory1,
            validTillFrom,
            validTillTo,
            archived: isArchivedTab,
          }),
          getStudentCourseFilterOptions(accessToken),
        ]);
        // Same on both tabs; shown on the main one only.
        todayContents = isArchivedTab ? [] : result.todayContents;
        continueItems = result.items;
        continueTotalPages = result.totalPages;
        continuePage = result.page;
        continueLoaded = true;
        continueFilterOptions = filterOptions;
      } catch (error) {
        if (isUnauthorizedError(error)) {
          redirectSessionExpired("/account/courses");
        }
        todayContents = [];
        continueItems = [];
      }
    } else {
      try {
        const [
          result,
          categoryOptions,
          typeOptions,
          subCategoryOptions,
        ] = await Promise.all([
          getPackages(
            {
              page,
              limit: PAGE_SIZE,
              search: query,
              categoryId,
              graphyCategory,
              subCategory1,
              sortBy: buySortPreset.sortBy,
              sortOrder: buySortPreset.sortOrder,
            },
            { accessToken }
          ),
          getCategoryDropdown({ limit: 50 }),
          getPackageCategories({ categoryId, limit: 50 }),
          getPackageSubcategories({
            categoryId,
            graphyCategory,
            limit: 50,
          }),
        ]);

        buyCategoryOptions = categoryOptions;
        buyTypeOptions = typeOptions;
        buySubCategoryOptions = subCategoryOptions;

        buyItems = result.items.map((pkg) => {
          const course = packageCardToCourse(pkg);
          return {
            ...course,
            detailsLabel: pkg.isSelfEnrolled ? "View Course" : "Buy Now",
            enrollmentUrl: pkg.isSelfEnrolled
              ? packageViewCourseHref(pkg.packageId)
              : pkg.packageId != null
                ? packageBuyNowHref(pkg.packageId, pkg.slug)
                : `/courses/${pkg.slug}`,
            externalLink: undefined,
          };
        });
        buyMeta = { page: result.page, totalPages: result.totalPages };
      } catch (error) {
        if (isUnauthorizedError(error)) {
          redirectSessionExpired("/account/courses");
        }
        buyItems = [];
      }
    }

    return {
      todayContents,
      continueItems,
      continueTotalPages,
      continuePage,
      continueLoaded,
      buyItems,
      buyMeta,
      continueFilterOptions,
      buyCategoryOptions,
      buyTypeOptions,
      buySubCategoryOptions,
      archivedCount: await archivedCountPromise,
    };
  }, "/account/courses");

  const currentPage = isEnrolledTab ? continuePage : buyMeta.page;
  const totalPages = isEnrolledTab ? continueTotalPages : buyMeta.totalPages;

  const paginationQuery: Record<string, string> = { tab };
  if (query) paginationQuery.q = query;
  if (categoryId) paginationQuery.categoryId = categoryId;
  if (subCategory1) paginationQuery.subCategory1 = subCategory1;
  if (packageId) paginationQuery.packageId = packageId;
  if (isEnrolledTab) {
    if (continueSort !== "continue_watching") {
      paginationQuery.sortBy = continueSort;
    }
    if (validTillFrom) paginationQuery.validTillFrom = validTillFrom;
    if (validTillTo) paginationQuery.validTillTo = validTillTo;
  } else {
    if (graphyCategory) paginationQuery.type = graphyCategory;
    if (buySortPreset.value !== DEFAULT_COURSE_SORT) {
      paginationQuery.sort = buySortPreset.value;
    }
  }

  // The last card of a page was archived / restored: show the previous page.
  if (continueLoaded && continueItems.length === 0 && page > totalPages) {
    const lastPageQuery = new URLSearchParams(paginationQuery);
    if (totalPages > 1) lastPageQuery.set("page", String(totalPages));
    redirect(`/account/courses?${lastPageQuery.toString()}`);
  }

  const isFiltered = Boolean(
    query || categoryId || subCategory1 || packageId || validTillFrom || validTillTo
  );
  // e.g. View Course of a package whose courses are all archived.
  const archivedHref = packageId
    ? `/account/courses?tab=archived&packageId=${encodeURIComponent(packageId)}`
    : "/account/courses?tab=archived";

  return (
    <div className="mx-auto w-full max-w-7xl">
      <header className="mb-6">
        <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
          My Courses
        </h1>
        <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
          Resume in-progress learning or explore courses to buy.
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Course views"
        className="mb-6 flex gap-2 overflow-x-auto overflow-y-hidden border-b border-[var(--account-border)] [scrollbar-width:none]"
      >
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <Link
              key={t.id}
              href={`/account/courses?tab=${t.id}`}
              role="tab"
              aria-selected={active}
              className={cn(
                "shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 text-[14px] sm:px-4 font-semibold transition-colors",
                active
                  ? "border-[var(--account-accent)] text-[var(--account-accent)]"
                  : "border-transparent text-[var(--account-text-muted)] hover:text-[var(--account-text)]"
              )}
            >
              {t.id === "archived" && archivedCount
                ? `${t.label} (${archivedCount})`
                : t.label}
            </Link>
          );
        })}
      </div>

      {isEnrolledTab ? (
        <>
          {isArchivedTab ? null : (
            <>
              <AccountLiveClassesSection items={todayContents} />
              <AccountQuickActionTiles />
            </>
          )}
          <AccountContinueCoursesToolbar
            key={tab}
            tab={isArchivedTab ? "archived" : "continue"}
            initialSearch={query || ""}
            activeCategoryId={categoryId || "all"}
            categoryOptions={continueFilterOptions.categories}
            activeSubCategory1={subCategory1 || "all"}
            subCategoryOptions={continueFilterOptions.subCategories}
            activePackageId={packageId || "all"}
            packageOptions={continueFilterOptions.packages}
            activeSort={continueSort}
            validTillFrom={validTillFrom || ""}
            validTillTo={validTillTo || ""}
          />
        </>
      ) : (
        <AccountBuyCoursesToolbar
          initialSearch={query || ""}
          activeCategoryId={categoryId || "all"}
          categoryOptions={buyCategoryOptions}
          activeType={graphyCategory || "all"}
          typeOptions={buyTypeOptions}
          activeSubCategory1={subCategory1 || "all"}
          subCategoryOptions={buySubCategoryOptions}
          activeSort={buySortPreset.value}
        />
      )}

      {isEnrolledTab ? (
        continueItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {continueItems.map((item) => (
              <AccountContinueWatchingCard
                key={item.id}
                item={item}
                secondaryAction={
                  <CourseArchiveButton
                    courseId={item.id}
                    courseTitle={item.title}
                    archived={isArchivedTab}
                  />
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            message={
              isArchivedTab && !isFiltered
                ? "No archived courses."
                : "No courses match these filters."
            }
            link={
              !isArchivedTab && archivedCount
                ? { href: archivedHref, label: "View archived courses →" }
                : undefined
            }
          />
        )
      ) : buyItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {buyItems.map((course) => (
            <CourseCardV2
              key={course.id}
              course={course}
              href={`/courses/${course.slug}`}
              ctaHref={course.enrollmentUrl || `/courses/${course.slug}`}
              ctaLabel={course.detailsLabel || "Buy Now"}
              compactPricing
            />
          ))}
        </div>
      ) : (
        <EmptyState message="No packages match these filters." />
      )}

      {totalPages > 1 ? (
        <AccountPagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/account/courses"
          query={paginationQuery}
          className="pt-8"
        />
      ) : null}
    </div>
  );
}

function EmptyState({
  message,
  link,
}: {
  message: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-6 py-12 text-center">
      <p className="text-body text-[var(--account-text-muted)]">{message}</p>
      {link ? (
        <Link
          href={link.href}
          className="mt-4 inline-block text-[13px] font-semibold text-[var(--account-accent)]"
        >
          {link.label}
        </Link>
      ) : null}
    </div>
  );
}
