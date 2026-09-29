import type { Metadata } from "next";
import Link from "next/link";
import { AccountContinueWatchingCard } from "@/components/account/AccountContinueWatchingCard";
import { AccountPagination } from "@/components/account/AccountPagination";
import { CourseCardV2 } from "@/components/cards/CourseCardV2";
import { ACCOUNT_CONTINUE_WATCHING } from "@/data/account/continue-watching";
import { ACCOUNT_BUY_COURSES } from "@/data/account/courses";
import {
  paginateItems,
  parseCoursesTab,
  parsePageParam,
  type CoursesTab,
} from "@/lib/account/pagination";
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
  }>;
}

const TABS: { id: CoursesTab; label: string }[] = [
  { id: "continue", label: "Continue Watching" },
  { id: "buy", label: "Buy Courses" },
];

export default async function AccountCoursesPage({
  searchParams,
}: AccountCoursesPageProps) {
  const params = await searchParams;
  const tab = parseCoursesTab(params.tab);
  const page = parsePageParam(params.page);

  const continuePaged = paginateItems(ACCOUNT_CONTINUE_WATCHING, page);
  const buyPaged = paginateItems(ACCOUNT_BUY_COURSES, page);
  const { page: currentPage, totalPages } =
    tab === "continue" ? continuePaged : buyPaged;

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
        continuePaged.items.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {continuePaged.items.map((item) => (
              <AccountContinueWatchingCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState message="No courses in progress yet." />
        )
      ) : buyPaged.items.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {buyPaged.items.map((course) => (
            <CourseCardV2
              key={course.id}
              course={course}
              ctaLabel="Buy Now"
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
          query={{ tab }}
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
