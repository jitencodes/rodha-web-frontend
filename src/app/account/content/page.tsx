import type { Metadata } from "next";

import { AccountContentTypeTabs } from "@/components/account/AccountContentTypeTabs";
import { AccountCourseContentCard } from "@/components/account/course-detail/AccountCourseContentCard";
import { AccountPagination } from "@/components/account/AccountPagination";
import { AccountQuickContentToolbar } from "@/components/account/AccountQuickContentToolbar";
import {
  DEFAULT_CONTENT_TYPE,
  QUICK_CONTENT_PAGE_SIZE,
  parseQuickActionType,
} from "@/lib/account/course-content-filters";
import { parsePageParam } from "@/lib/account/pagination";
import { getQuickActions } from "@/lib/api/modules/student/courses/service";
import { getGraphySso } from "@/lib/api/modules/student/profile/service";
import { withSsoToken } from "@/lib/auth/sso";
import {
  isUnauthorizedError,
  redirectSessionExpired,
  withStudentAuth,
} from "@/lib/auth/require-student";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Quick Content — Rodha",
  description: "Browse videos, quizzes, PDFs, live classes, and assignments.",
  path: "/account/content",
});

interface AccountContentPageProps {
  searchParams: Promise<{
    type?: string;
    search?: string;
    q?: string;
    page?: string;
    limit?: string;
    courseId?: string;
    completionStatus?: string;
    liveClassStatus?: string;
    resultStatus?: string;
    packageId?: string;
  }>;
}

export default async function AccountContentPage({
  searchParams,
}: AccountContentPageProps) {
  const params = await searchParams;
  const type = parseQuickActionType(params.type);
  const search = (params.search ?? params.q)?.trim() || undefined;
  const page = parsePageParam(params.page);
  const limit =
    Number.parseInt(params.limit || String(QUICK_CONTENT_PAGE_SIZE), 10) ||
    QUICK_CONTENT_PAGE_SIZE;
  const courseId = params.courseId?.trim() || undefined;
  const packageId = params.packageId?.trim() || undefined;
  const completionStatus =
    params.completionStatus?.trim() && params.completionStatus !== "all"
      ? params.completionStatus.trim()
      : undefined;
  const liveClassStatus =
    params.liveClassStatus?.trim() && params.liveClassStatus !== "all"
      ? params.liveClassStatus.trim()
      : undefined;
  const resultStatus =
    params.resultStatus?.trim() && params.resultStatus !== "all"
      ? params.resultStatus.trim()
      : undefined;

  const { result, ssoToken } = await withStudentAuth(async (accessToken) => {
    try {
      const [quick, sso] = await Promise.all([
        getQuickActions(accessToken, {
          type,
          search,
          page,
          limit,
          courseId,
          packageId,
          completionStatus,
          liveClassStatus,
          resultStatus,
        }),
        getGraphySso(accessToken).catch(() => null),
      ]);
      return {
        result: quick,
        ssoToken: sso?.ssoToken || "",
      };
    } catch (error) {
      if (isUnauthorizedError(error)) {
        redirectSessionExpired("/account/content");
      }
      return {
        result: {
          type,
          items: [],
          page: 1,
          limit,
          total: 0,
          totalPages: 1,
        },
        ssoToken: "",
      };
    }
  }, "/account/content");

  const paginationQuery: Record<string, string> = {
    type: result.type || type || DEFAULT_CONTENT_TYPE,
    limit: String(limit),
  };
  if (search) paginationQuery.search = search;
  if (courseId) paginationQuery.courseId = courseId;
  if (packageId) paginationQuery.packageId = packageId;
  if (completionStatus) paginationQuery.completionStatus = completionStatus;
  if (liveClassStatus) paginationQuery.liveClassStatus = liveClassStatus;
  if (resultStatus) paginationQuery.resultStatus = resultStatus;

  const tabQuery = { ...paginationQuery };
  delete tabQuery.page;

  return (
    <div className="mx-auto w-full max-w-7xl">
      <header className="mb-6">
        <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
          Quick Content
        </h1>
        <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
          Browse videos, quizzes, PDFs, live classes, and assignments.
        </p>
      </header>

      <AccountContentTypeTabs
        basePath="/account/content"
        activeType={result.type || type}
        query={tabQuery}
      />

      <AccountQuickContentToolbar
        basePath="/account/content"
        activeType={result.type || type}
        initialSearch={search || ""}
        activeCompletionStatus={completionStatus || "all"}
        activeLiveClassStatus={liveClassStatus || "all"}
        activeResultStatus={resultStatus || "all"}
        preserveQuery={{
          limit: String(limit),
          ...(courseId ? { courseId } : {}),
          ...(packageId ? { packageId } : {}),
        }}
      />

      {result.items.length === 0 ? (
        <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-6 py-12 text-center">
          <p className="text-body text-[var(--account-text-muted)]">
            No content matches these filters.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {result.items.map((item) => {
            const href = item.takeUrl
              ? withSsoToken(item.takeUrl, ssoToken)
              : "";
            return (
              <li key={item.id}>
                <AccountCourseContentCard item={item} href={href} />
              </li>
            );
          })}
        </ul>
      )}

      {result.totalPages > 1 ? (
        <AccountPagination
          currentPage={result.page}
          totalPages={result.totalPages}
          basePath="/account/content"
          query={paginationQuery}
          className="pt-8"
        />
      ) : null}
    </div>
  );
}
