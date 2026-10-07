"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AccountContentTypeTabs } from "@/components/account/AccountContentTypeTabs";
import { AccountLiveClassesSection } from "@/components/account/AccountLiveClassesSection";
import { AccountPagination } from "@/components/account/AccountPagination";
import { AccountQuickContentToolbar } from "@/components/account/AccountQuickContentToolbar";
import { AccountCourseContentCard } from "@/components/account/course-detail/AccountCourseContentCard";
import { AccountCourseDetailHeader } from "@/components/account/course-detail/AccountCourseDetailHeader";
import { AccountCourseProgressCard } from "@/components/account/course-detail/AccountCourseProgressCard";
import {
  DEFAULT_CONTENT_TYPE,
  QUICK_CONTENT_PAGE_SIZE,
  parseQuickActionType,
} from "@/lib/account/course-content-filters";
import { parsePageParam } from "@/lib/account/pagination";
import type {
  AccountCourseContentItem,
  AccountCourseDetailViewModel,
} from "@/lib/api/modules/student/courses/mapper";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { withSsoToken } from "@/lib/auth/sso";

type DetailApiResponse = {
  ok: boolean;
  detail?: AccountCourseDetailViewModel;
  error?: string;
};

type QuickActionsApiResponse = {
  ok: boolean;
  type?: string;
  items?: AccountCourseContentItem[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
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

  const contentType = parseQuickActionType(searchParams.get("type"));
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

  const [detail, setDetail] = useState<AccountCourseDetailViewModel | null>(
    null
  );
  const [contentItems, setContentItems] = useState<AccountCourseContentItem[]>(
    []
  );
  const [contentPagination, setContentPagination] = useState({
    page: 1,
    totalPages: 1,
  });
  const [ssoToken, setSsoToken] = useState("");
  const [detailLoading, setDetailLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const listingKey = useMemo(
    () =>
      JSON.stringify({
        courseId,
        contentType,
        search,
        page,
        completionStatus,
        liveClassStatus,
        resultStatus,
      }),
    [
      courseId,
      contentType,
      search,
      page,
      completionStatus,
      liveClassStatus,
      resultStatus,
    ]
  );

  const loadDetail = useCallback(async () => {
    if (!courseId) return;
    setDetailLoading(true);
    setError(null);

    try {
      const [detailRes, ssoRes] = await Promise.all([
        fetchAuthed(
          `/api/account/courses/${encodeURIComponent(courseId)}`
        ),
        fetchAuthed("/api/graphy/sso"),
      ]);

      const detailJson = (await detailRes.json()) as DetailApiResponse;
      const ssoJson = (await ssoRes.json()) as SsoApiResponse;

      if (!detailRes.ok || !detailJson.ok || !detailJson.detail) {
        setDetail(null);
        setError(detailJson.error || "Unable to load course");
        return;
      }

      setDetail(detailJson.detail);
      setSsoToken(ssoJson.ok ? ssoJson.graphy?.ssoToken || "" : "");
    } catch (err) {
      setDetail(null);
      setError(
        err instanceof Error ? err.message : "Unable to load course"
      );
    } finally {
      setDetailLoading(false);
    }
  }, [courseId]);

  const loadListing = useCallback(async () => {
    if (!courseId) return;
    setListLoading(true);

    const qs = new URLSearchParams();
    qs.set("type", contentType);
    qs.set("courseId", courseId);
    qs.set("page", String(page));
    qs.set("limit", String(QUICK_CONTENT_PAGE_SIZE));
    if (search) qs.set("search", search);
    if (completionStatus) qs.set("completionStatus", completionStatus);
    if (liveClassStatus) qs.set("liveClassStatus", liveClassStatus);
    if (resultStatus) qs.set("resultStatus", resultStatus);

    try {
      const res = await fetchAuthed(
        `/api/account/courses/quick-actions?${qs.toString()}`
      );
      const json = (await res.json()) as QuickActionsApiResponse;
      if (!res.ok || !json.ok) {
        setContentItems([]);
        setContentPagination({ page: 1, totalPages: 1 });
        return;
      }
      setContentItems(json.items ?? []);
      setContentPagination({
        page: json.page ?? page,
        totalPages: json.totalPages ?? 1,
      });
    } catch {
      setContentItems([]);
      setContentPagination({ page: 1, totalPages: 1 });
    } finally {
      setListLoading(false);
    }
  }, [
    courseId,
    contentType,
    search,
    page,
    completionStatus,
    liveClassStatus,
    resultStatus,
  ]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    void loadListing();
  }, [loadListing, listingKey]);

  const paginationQuery = useMemo(() => {
    const q: Record<string, string> = {
      type: contentType || DEFAULT_CONTENT_TYPE,
      limit: String(QUICK_CONTENT_PAGE_SIZE),
    };
    if (search) q.search = search;
    if (completionStatus) q.completionStatus = completionStatus;
    if (liveClassStatus) q.liveClassStatus = liveClassStatus;
    if (resultStatus) q.resultStatus = resultStatus;
    return q;
  }, [
    contentType,
    search,
    completionStatus,
    liveClassStatus,
    resultStatus,
  ]);

  if (detailLoading && !detail) {
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
            onClick={() => void loadDetail()}
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
  const basePath = `/account/courses/${courseId}`;

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

      <AccountLiveClassesSection
        items={detail.productContents}
        title="Live / Recent Content"
        titleId="product-contents-heading"
      />

      <h2 className="mb-3 font-montserrat text-[15px] font-bold text-[var(--account-text)]">
        Course Content
      </h2>

      <AccountContentTypeTabs
        basePath={basePath}
        activeType={contentType}
        query={paginationQuery}
      />

      <AccountQuickContentToolbar
        basePath={basePath}
        activeType={contentType}
        initialSearch={search || ""}
        activeCompletionStatus={completionStatus || "all"}
        activeLiveClassStatus={liveClassStatus || "all"}
        activeResultStatus={resultStatus || "all"}
        preserveQuery={{ limit: String(QUICK_CONTENT_PAGE_SIZE) }}
      />

      {listLoading ? (
        <p className="mb-3 text-[12px] text-[var(--account-text-muted)]">
          Loading content…
        </p>
      ) : null}

      {contentItems.length === 0 && !listLoading ? (
        <p className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-6 py-10 text-center text-body-sm text-[var(--account-text-muted)]">
          No content items for this filter.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {contentItems.map((item) => {
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

      {contentPagination.totalPages > 1 ? (
        <AccountPagination
          currentPage={contentPagination.page}
          totalPages={contentPagination.totalPages}
          basePath={basePath}
          query={paginationQuery}
          className="pt-8"
        />
      ) : null}
    </div>
  );
}
