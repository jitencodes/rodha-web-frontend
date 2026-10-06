import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountContinueWatchingCard } from "@/components/account/AccountContinueWatchingCard";
import { AccountPagination } from "@/components/account/AccountPagination";
import { CourseCardV2 } from "@/components/cards/CourseCardV2";
import { packageCardToCourse } from "@/lib/api/modules/packages/mapper";
import { getPackages } from "@/lib/api/modules/packages/service";
import { getStudentCourses } from "@/lib/api/modules/student/courses/service";
import { getAccessToken } from "@/lib/auth/server-session";
import {
  parseCoursesTab,
  parsePageParam,
  type CoursesTab,
} from "@/lib/account/pagination";
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
  }>;
}

const TABS: { id: CoursesTab; label: string }[] = [
  { id: "continue", label: "Continue Watching" },
  { id: "buy", label: "Buy Courses" },
];

const PAGE_SIZE = 8;

export default async function AccountCoursesPage({
  searchParams,
}: AccountCoursesPageProps) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login?next=/account/courses");
  }

  const params = await searchParams;
  const tab = parseCoursesTab(params.tab);
  const page = parsePageParam(params.page);
  const packageId = params.packageId?.trim();

  let continueItems: Awaited<ReturnType<typeof getStudentCourses>>["items"] =
    [];
  let continueTotalPages = 1;
  let continuePage = page;
  let buyItems: ReturnType<typeof packageCardToCourse>[] = [];
  let buyMeta = { page: 1, totalPages: 1 };

  if (tab === "continue") {
    try {
      const result = await getStudentCourses(accessToken, {
        page,
        limit: PAGE_SIZE,
        sortBy: "continue_watching",
        packageId: packageId || undefined,
      });
      continueItems = result.items;
      continueTotalPages = result.totalPages;
      continuePage = result.page;
    } catch {
      continueItems = [];
    }
  } else {
    try {
      const result = await getPackages({ page, limit: PAGE_SIZE });
      buyItems = result.items.map((pkg) => {
        const course = packageCardToCourse(pkg);
        return {
          ...course,
          detailsLabel: pkg.isSelfEnrolled ? "View Course" : "Buy Now",
          // stash for CTA via href below
          enrollmentUrl: pkg.isSelfEnrolled
            ? packageViewCourseHref(pkg.packageId)
            : pkg.packageId != null
              ? packageBuyNowHref(pkg.packageId, pkg.slug)
              : `/courses/${pkg.slug}`,
          externalLink: undefined,
        };
      });
      buyMeta = { page: result.page, totalPages: result.totalPages };
    } catch {
      buyItems = [];
    }
  }

  const currentPage = tab === "continue" ? continuePage : buyMeta.page;
  const totalPages =
    tab === "continue" ? continueTotalPages : buyMeta.totalPages;

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
        continueItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {continueItems.map((item) => (
              <AccountContinueWatchingCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState message="No courses in progress yet." />
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
        <EmptyState message="No courses available to buy right now." />
      )}

      {totalPages > 1 ? (
        <AccountPagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/account/courses"
          query={{
            tab,
            ...(packageId ? { packageId } : {}),
          }}
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
