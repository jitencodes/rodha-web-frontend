import type { Metadata } from "next";
import Link from "next/link";

import { AccountBuyCoursesToolbar } from "@/components/account/AccountBuyCoursesToolbar";
import { AccountContinueCoursesToolbar } from "@/components/account/AccountContinueCoursesToolbar";
import { AccountContinueWatchingCard } from "@/components/account/AccountContinueWatchingCard";
import { AccountLiveClassesSection } from "@/components/account/AccountLiveClassesSection";
import { AccountPagination } from "@/components/account/AccountPagination";
import { AccountQuickActionTiles } from "@/components/account/AccountQuickActionTiles";
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
    buyItems,
    buyMeta,
    continueFilterOptions,
    buyCategoryOptions,
    buyTypeOptions,
    buySubCategoryOptions,
  } = await withStudentAuth(async (accessToken) => {
    let todayContents: AccountLiveContentItem[] = [];
    let continueItems: Awaited<
      ReturnType<typeof getStudentCourses>
    >["items"] = [];
    let continueTotalPages = 1;
    let continuePage = page;
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

    if (tab === "continue") {
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
          }),
          getStudentCourseFilterOptions(accessToken),
        ]);
        todayContents = result.todayContents;
        continueItems = result.items;
        continueTotalPages = result.totalPages;
        continuePage = result.page;
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
          getPackages({
            page,
            limit: PAGE_SIZE,
            search: query,
            categoryId,
            graphyCategory,
            subCategory1,
            sortBy: buySortPreset.sortBy,
            sortOrder: buySortPreset.sortOrder,
          }),
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
      buyItems,
      buyMeta,
      continueFilterOptions,
      buyCategoryOptions,
      buyTypeOptions,
      buySubCategoryOptions,
    };
  }, "/account/courses");

  const currentPage = tab === "continue" ? continuePage : buyMeta.page;
  const totalPages =
    tab === "continue" ? continueTotalPages : buyMeta.totalPages;

  const paginationQuery: Record<string, string> = { tab };
  if (query) paginationQuery.q = query;
  if (categoryId) paginationQuery.categoryId = categoryId;
  if (subCategory1) paginationQuery.subCategory1 = subCategory1;
  if (packageId) paginationQuery.packageId = packageId;
  if (tab === "continue") {
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
        className="mb-6 flex flex-wrap gap-2 border-b border-[var(--account-border)]"
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
                "-mb-px border-b-2 px-4 py-2.5 text-[14px] font-semibold transition-colors",
                active
                  ? "border-[var(--account-accent)] text-[var(--account-accent)]"
                  : "border-transparent text-[var(--account-text-muted)] hover:text-[var(--account-text)]"
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {tab === "continue" ? (
        <>
          <AccountLiveClassesSection items={todayContents} />
          <AccountQuickActionTiles />
          <AccountContinueCoursesToolbar
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

      {tab === "continue" ? (
        continueItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {continueItems.map((item) => (
              <AccountContinueWatchingCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState message="No courses match these filters." />
        )
      ) : buyItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {buyItems.map((course) => (
            <CourseCardV2
              key={course.id}
              course={course}
              href={course.enrollmentUrl || `/courses/${course.slug}`}
              ctaLabel={course.detailsLabel || "Buy Now"}
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-6 py-12 text-center">
      <p className="text-body text-[var(--account-text-muted)]">{message}</p>
    </div>
  );
}
