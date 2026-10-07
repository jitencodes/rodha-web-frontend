"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AccountPagination } from "@/components/account/AccountPagination";
import { AccountCourseContentCard } from "@/components/account/course-detail/AccountCourseContentCard";
import { AccountCourseContentToolbar } from "@/components/account/course-detail/AccountCourseContentToolbar";
import { AccountCourseContentTypeNav } from "@/components/account/course-detail/AccountCourseContentTypeNav";
import { AccountCourseDetailHeader } from "@/components/account/course-detail/AccountCourseDetailHeader";
import { AccountCourseProgressCard } from "@/components/account/course-detail/AccountCourseProgressCard";
import { COURSE_CONTENT_PAGE_SIZE } from "@/lib/account/course-content-filters";
import { parsePageParam } from "@/lib/account/pagination";
import type {
  AccountCourseChapterOption,
  AccountCourseDetailViewModel,
} from "@/lib/api/modules/student/courses/mapper";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { withSsoToken } from "@/lib/auth/sso";

const VALID_TYPES = new Set([
  "videos",
  "quizzes",
  "pdfs",
  "live-classes",
]);

type DetailApiResponse = {
  ok: boolean;
  detail?: AccountCourseDetailViewModel;
  error?: string;
};

type ChaptersApiResponse = {
  ok: boolean;
  chapters?: AccountCourseChapterOption[];
  error?: string;
};

type SsoApiResponse = {
  ok: boolean;
  graphy?: { ssoToken?: string };
  error?: string;
};

export function AccountCourseDetailClient() {
  const params = useParams<{ courseId: string }>();
  const searchParams = useSearchParams();
  const courseId = params.courseId;

  const contentType =
    searchParams.get("type")?.trim() &&
    VALID_TYPES.has(searchParams.get("type")!.trim())
      ? searchParams.get("type")!.trim()
      : undefined;
  const search =
    (searchParams.get("search") ?? searchParams.get("q"))?.trim() || undefined;
  const page = parsePageParam(searchParams.get("page") ?? undefined);
  const completionStatus =
    searchParams.get("completionStatus")?.trim() &&
    searchParams.get("completionStatus") !== "all"
      ? searchParams.get("completionStatus")!.trim()
      : undefined;
  const liveClassStatus =
    searchParams.get("liveClassStatus")?.trim() &&
    searchParams.get("liveClassStatus") !== "all"
      ? searchParams.get("liveClassStatus")!.trim()
      : undefined;
  const resultStatus =
    searchParams.get("resultStatus")?.trim() &&
    searchParams.get("resultStatus") !== "all"
      ? searchParams.get("resultStatus")!.trim()
      : undefined;
  const chapterId =
    searchParams.get("chapterId")?.trim() &&
    searchParams.get("chapterId") !== "all"
      ? searchParams.get("chapterId")!.trim()
      : undefined;
  const chapter =
    !chapterId &&
    searchParams.get("chapter")?.trim() &&
    searchParams.get("chapter") !== "all"
      ? searchParams.get("chapter")!.trim()
      : undefined;

  const [detail, setDetail] = useState<AccountCourseDetailViewModel | null>(
    null
  );
  const [chapters, setChapters] = useState<AccountCourseChapterOption[]>([]);
  const [ssoToken, setSsoToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryKey = useMemo(
    () =>
      JSON.stringify({
        courseId,
        contentType,
        search,
        page,
        completionStatus,
        liveClassStatus,
        resultStatus,
        chapterId,
        chapter,
      }),
    [
      courseId,
      contentType,
      search,
      page,
      completionStatus,
      liveClassStatus,
      resultStatus,
      chapterId,
      chapter,
    ]
  );

  const load = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError(null);

    const detailParams = new URLSearchParams();
    if (contentType) detailParams.set("type", contentType);
    if (search) detailParams.set("search", search);
    detailParams.set("page", String(page));
    detailParams.set("limit", String(COURSE_CONTENT_PAGE_SIZE));
    if (completionStatus) {
      detailParams.set("completionStatus", completionStatus);
    }
    if (liveClassStatus) {
      detailParams.set("liveClassStatus", liveClassStatus);
    }
    if (resultStatus) detailParams.set("resultStatus", resultStatus);
    if (chapterId) detailParams.set("chapterId", chapterId);
    if (chapter) detailParams.set("chapter", chapter);

    const detailUrl = `/api/account/courses/${encodeURIComponent(courseId)}?${detailParams.toString()}`;
    const chaptersUrl = `/api/account/courses/${encodeURIComponent(courseId)}/chapters`;

    try {
      console.debug("[AccountCourseDetail] fetching", {
        detailUrl,
        chaptersUrl,
        query: {
          contentType,
          search,
          page,
          completionStatus,
          liveClassStatus,
          resultStatus,
          chapterId,
          chapter,
        },
      });

      const [detailRes, chaptersRes, ssoRes] = await Promise.all([
        fetchAuthed(detailUrl),
        fetchAuthed(chaptersUrl),
        fetchAuthed("/api/graphy/sso"),
      ]);

      const detailJson = (await detailRes.json()) as DetailApiResponse;
      const chaptersJson = (await chaptersRes.json()) as ChaptersApiResponse;
      const ssoJson = (await ssoRes.json()) as SsoApiResponse;

      console.debug("[AccountCourseDetail] responses", {
        detailStatus: detailRes.status,
        detail: detailJson,
        chaptersStatus: chaptersRes.status,
        chapters: chaptersJson,
        ssoStatus: ssoRes.status,
        ssoOk: ssoJson.ok,
      });

      if (!detailRes.ok || !detailJson.ok || !detailJson.detail) {
        setDetail(null);
        setError(detailJson.error || "Unable to load course");
        return;
      }

      setDetail(detailJson.detail);
      const chapterOptions =
        chaptersJson.ok && chaptersJson.chapters?.length
          ? chaptersJson.chapters
          : detailJson.detail.chapters ?? [];
      setChapters(chapterOptions);
      setSsoToken(ssoJson.ok ? ssoJson.graphy?.ssoToken || "" : "");
    } catch (err) {
      console.error("[AccountCourseDetail] fetch failed", err);
      setDetail(null);
      setError(
        err instanceof Error ? err.message : "Unable to load course"
      );
    } finally {
      setLoading(false);
    }
  }, [
    courseId,
    contentType,
    search,
    page,
    completionStatus,
    liveClassStatus,
    resultStatus,
    chapterId,
    chapter,
  ]);

  useEffect(() => {
    void load();
  }, [load, queryKey]);

  const paginationQuery = useMemo(() => {
    const q: Record<string, string> = {};
    if (contentType) q.type = contentType;
    if (search) q.search = search;
    if (chapterId) q.chapterId = chapterId;
    if (chapter) q.chapter = chapter;
    if (completionStatus) q.completionStatus = completionStatus;
    if (liveClassStatus) q.liveClassStatus = liveClassStatus;
    if (resultStatus) q.resultStatus = resultStatus;
    return q;
  }, [
    contentType,
    search,
    chapterId,
    chapter,
    completionStatus,
    liveClassStatus,
    resultStatus,
  ]);

  if (loading && !detail) {
    return (
      <div className="mx-auto w-full max-w-5xl py-16 text-center text-body-sm text-[var(--account-text-muted)]">
        Loading course…
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-6 py-12 text-center">
          <p className="text-body text-[var(--account-text-muted)]">
            {error || "Course not found."}
          </p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-4 text-[13px] font-semibold text-[var(--account-accent)]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const openCourseHref = detail.courseTakeUrl
    ? withSsoToken(detail.courseTakeUrl, ssoToken)
    : "";

  return (
    <div className="mx-auto w-full max-w-5xl">
      {loading ? (
        <p className="mb-3 text-[12px] text-[var(--account-text-muted)]">
          Updating…
        </p>
      ) : null}

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
        query={paginationQuery}
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
