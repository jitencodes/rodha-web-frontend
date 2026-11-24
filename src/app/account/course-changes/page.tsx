import type { Metadata } from "next";
import Link from "next/link";
import { AccountPagination } from "@/components/account/AccountPagination";
import { CourseChangeRequestsTable } from "@/components/account/course-changes/CourseChangeRequestsTable";
import { CourseChangeRequestsToolbar } from "@/components/account/course-changes/CourseChangeRequestsToolbar";
import { parsePageParam } from "@/lib/account/pagination";
import { COURSE_CHANGE_STATUS_OPTIONS } from "@/lib/api/modules/student/course-changes/mapper";
import {
  getCourseChangeRequests,
  getCourseChangeSummary,
} from "@/lib/api/modules/student/course-changes/service";
import {
  isUnauthorizedError,
  redirectSessionExpired,
  withStudentAuth,
} from "@/lib/auth/require-student";
import { buildPageMetadata } from "@/lib/seo";

const BASE_PATH = "/account/course-changes";
const PAGE_SIZE = 10;

export const metadata: Metadata = buildPageMetadata({
  title: "Course Switch Requests — Rodha",
  description: "Track and cancel your course switch requests.",
  path: BASE_PATH,
});

interface CourseChangesPageProps {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}

export default async function AccountCourseChangesPage({
  searchParams,
}: CourseChangesPageProps) {
  const params = await searchParams;
  const search = params.q?.trim() ?? "";
  const status =
    COURSE_CHANGE_STATUS_OPTIONS.find((option) => option.value === params.status)
      ?.value ?? "";

  const { requests, summary } = await withStudentAuth(async (accessToken) => {
    const [requests, summary] = await Promise.all([
      getCourseChangeRequests(accessToken, {
        status,
        search,
        page: parsePageParam(params.page),
        limit: PAGE_SIZE,
      }).catch((error: unknown) => {
        if (isUnauthorizedError(error)) redirectSessionExpired(BASE_PATH);
        return null;
      }),
      getCourseChangeSummary(accessToken).catch(() => null),
    ]);
    return { requests, summary };
  }, BASE_PATH);

  const isFiltered = Boolean(search || status);
  const query: Record<string, string> = {
    ...(search ? { q: search } : {}),
    ...(status ? { status } : {}),
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
            Course Switch Requests
          </h1>
          <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
            Track your course changes and cancel a request while it is under review.
          </p>
        </div>
        {summary?.enabled && summary.max > 0 ? (
          <div className="shrink-0 rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-4 py-2.5 text-[13px] shadow-[var(--account-shadow)]">
            <p className="font-semibold text-[var(--account-text)]">
              {summary.remaining} of {summary.max} changes left
            </p>
            {summary.blockedReason === "COOLDOWN" && summary.nextAllowedLabel ? (
              <p className="mt-0.5 text-[12px] text-[var(--account-text-muted)]">
                Next request from {summary.nextAllowedLabel}
              </p>
            ) : null}
          </div>
        ) : null}
      </header>

      {requests && (requests.total > 0 || isFiltered) ? (
        <CourseChangeRequestsToolbar initialSearch={search} activeStatus={status} />
      ) : null}

      {!requests ? (
        <EmptyState message="Unable to load your requests right now. Please try again." />
      ) : requests.items.length === 0 ? (
        <EmptyState
          message={
            isFiltered
              ? "No requests match these filters."
              : "You have not requested any course changes yet."
          }
          showCoursesLink={!isFiltered}
        />
      ) : (
        <CourseChangeRequestsTable requests={requests.items} />
      )}

      {requests && requests.totalPages > 1 ? (
        <AccountPagination
          currentPage={requests.page}
          totalPages={requests.totalPages}
          basePath={BASE_PATH}
          query={query}
          className="pt-8"
        />
      ) : null}
    </div>
  );
}

function EmptyState({
  message,
  showCoursesLink = false,
}: {
  message: string;
  showCoursesLink?: boolean;
}) {
  return (
    <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-6 py-12 text-center">
      <p className="text-body text-[var(--account-text-muted)]">{message}</p>
      {showCoursesLink ? (
        <Link
          href="/account/courses?tab=continue"
          className="mt-4 inline-block text-[13px] font-semibold text-[var(--account-accent)]"
        >
          Go to my courses →
        </Link>
      ) : null}
    </div>
  );
}
