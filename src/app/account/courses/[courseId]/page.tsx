import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AccountPagination } from "@/components/account/AccountPagination";
import { AccountCourseContentCard } from "@/components/account/course-detail/AccountCourseContentCard";
import { AccountCourseContentToolbar } from "@/components/account/course-detail/AccountCourseContentToolbar";
import { AccountCourseContentTypeNav } from "@/components/account/course-detail/AccountCourseContentTypeNav";
import { AccountCourseDetailHeader } from "@/components/account/course-detail/AccountCourseDetailHeader";
import { AccountCourseProgressCard } from "@/components/account/course-detail/AccountCourseProgressCard";
import {
  COURSE_CONTENT_PAGE_SIZE,
} from "@/lib/account/course-content-filters";
import { parsePageParam } from "@/lib/account/pagination";
import {
  getStudentCourseChapterOptions,
  getStudentCourseDetail,
} from "@/lib/api/modules/student/courses/service";
import { getGraphySso } from "@/lib/api/modules/student/profile/service";
import {
  isUnauthorizedError,
  redirectSessionExpired,
  withStudentAuth,
} from "@/lib/auth/require-student";
import {
  getSessionGraphy,
  withSsoToken,
} from "@/lib/auth/server-session";
import { buildPageMetadata } from "@/lib/seo";

interface AccountCourseDetailPageProps {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{
    type?: string;
    search?: string;
    q?: string;
    page?: string;
    completionStatus?: string;
    liveClassStatus?: string;
    resultStatus?: string;
    chapterId?: string;
    chapter?: string;
  }>;
}

const VALID_TYPES = new Set([
  "videos",
  "quizzes",
  "pdfs",
  "live-classes",
]);

export async function generateMetadata({
  params,
}: AccountCourseDetailPageProps): Promise<Metadata> {
  const { courseId } = await params;
  return buildPageMetadata({
    title: `Course Details — Rodha`,
    description: "Your assigned course content.",
    path: `/account/courses/${courseId}`,
  });
}

export default async function AccountCourseDetailPage({
  params,
  searchParams,
}: AccountCourseDetailPageProps) {
  const { courseId } = await params;
  const sp = await searchParams;

  const contentType =
    sp.type?.trim() && VALID_TYPES.has(sp.type.trim())
      ? sp.type.trim()
      : undefined;
  const search = (sp.search ?? sp.q)?.trim() || undefined;
  const page = parsePageParam(sp.page);
  const completionStatus =
    sp.completionStatus?.trim() && sp.completionStatus !== "all"
      ? sp.completionStatus.trim()
      : undefined;
  const liveClassStatus =
    sp.liveClassStatus?.trim() && sp.liveClassStatus !== "all"
      ? sp.liveClassStatus.trim()
      : undefined;
  const resultStatus =
    sp.resultStatus?.trim() && sp.resultStatus !== "all"
      ? sp.resultStatus.trim()
      : undefined;
  const chapterId =
    sp.chapterId?.trim() && sp.chapterId !== "all"
      ? sp.chapterId.trim()
      : undefined;
  const chapter =
    !chapterId && sp.chapter?.trim() && sp.chapter !== "all"
      ? sp.chapter.trim()
      : undefined;

  const { detail, chapters, ssoToken } = await withStudentAuth(
    async (accessToken) => {
      let detail = null;
      let chapters: Awaited<
        ReturnType<typeof getStudentCourseChapterOptions>
      > = [];

      try {
        const [detailResult, chapterOptions] = await Promise.all([
          getStudentCourseDetail(accessToken, courseId, {
            type: contentType,
            search,
            page,
            limit: COURSE_CONTENT_PAGE_SIZE,
            completionStatus,
            liveClassStatus,
            resultStatus,
            chapterId,
            chapter,
          }),
          getStudentCourseChapterOptions(accessToken, { courseId }),
        ]);
        detail = detailResult;
        chapters =
          chapterOptions.length > 0
            ? chapterOptions
            : detailResult?.chapters ?? [];
      } catch (error) {
        if (isUnauthorizedError(error)) {
          redirectSessionExpired(`/account/courses/${courseId}`);
        }
        detail = null;
      }

      let ssoToken = (await getSessionGraphy())?.ssoToken || "";
      if (!ssoToken) {
        try {
          const fresh = await getGraphySso(accessToken);
          ssoToken = fresh?.ssoToken || "";
        } catch (error) {
          if (isUnauthorizedError(error)) {
            redirectSessionExpired(`/account/courses/${courseId}`);
          }
          ssoToken = "";
        }
      }

      return { detail, chapters, ssoToken };
    },
    `/account/courses/${courseId}`
  );

  if (!detail) {
    notFound();
  }

  const openCourseHref = detail.courseTakeUrl
    ? withSsoToken(detail.courseTakeUrl, ssoToken)
    : "";

  const paginationQuery: Record<string, string> = {};
  if (contentType) paginationQuery.type = contentType;
  if (search) paginationQuery.search = search;
  if (chapterId) paginationQuery.chapterId = chapterId;
  if (chapter) paginationQuery.chapter = chapter;
  if (completionStatus) paginationQuery.completionStatus = completionStatus;
  if (liveClassStatus) paginationQuery.liveClassStatus = liveClassStatus;
  if (resultStatus) paginationQuery.resultStatus = resultStatus;

  const navQuery = { ...paginationQuery };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <AccountCourseDetailHeader
        title={detail.title}
        language={detail.language}
        categoryLabel={detail.categoryLabel}
        openCourseHref={openCourseHref || undefined}
      />

      <AccountCourseProgressCard
        progressPercent={detail.progressPercent}
        contentTotal={detail.contentTotal}
        completed={detail.completed}
        learningStatus={detail.learningStatus}
        totalTimeLabel={detail.totalTimeLabel}
        validTill={detail.validTill}
        startDate={detail.startDate}
        lastAccessDate={detail.lastAccessDate}
      />

      {detail.syllabus ? (
        <section className="mb-5 rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4 sm:p-5">
          <h2 className="font-montserrat text-[15px] font-bold text-[var(--account-text)]">
            Description
          </h2>
          <p className="mt-2 text-body-sm leading-relaxed text-[var(--account-text-muted)] whitespace-pre-wrap">
            {detail.syllabus}
          </p>
        </section>
      ) : null}

      <AccountCourseContentTypeNav
        courseId={courseId}
        activeType={contentType || ""}
        contentSummary={detail.contentSummary}
        query={navQuery}
      />

      <AccountCourseContentToolbar
        courseId={courseId}
        activeType={contentType || ""}
        initialSearch={search || ""}
        activeChapterId={chapterId || "all"}
        activeCompletionStatus={completionStatus || "all"}
        activeLiveClassStatus={liveClassStatus || "all"}
        activeResultStatus={resultStatus || "all"}
        chapters={chapters}
      />

      {detail.items.length === 0 ? (
        <p className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-6 py-10 text-center text-body-sm text-[var(--account-text-muted)]">
          No content items for this filter.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {detail.items.map((item) => {
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

      {detail.pagination.totalPages > 1 ? (
        <AccountPagination
          currentPage={detail.pagination.page}
          totalPages={detail.pagination.totalPages}
          basePath={`/account/courses/${courseId}`}
          query={paginationQuery}
          className="pt-8"
        />
      ) : null}
    </div>
  );
}
