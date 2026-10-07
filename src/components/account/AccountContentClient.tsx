"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

import { AccountContentListingSkeleton } from "@/components/account/AccountContentListingSkeleton";
import { AccountContentTypeTabs } from "@/components/account/AccountContentTypeTabs";
import { AccountPagination } from "@/components/account/AccountPagination";
import { AccountQuickContentToolbar } from "@/components/account/AccountQuickContentToolbar";
import { AccountCourseContentCard } from "@/components/account/course-detail/AccountCourseContentCard";
import {
  DEFAULT_CONTENT_TYPE,
  QUICK_CONTENT_PAGE_SIZE,
  parseQuickActionType,
} from "@/lib/account/course-content-filters";
import { parsePageParam } from "@/lib/account/pagination";
import type { AccountCourseContentItem } from "@/lib/api/modules/student/courses/mapper";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { withSsoToken } from "@/lib/auth/sso";

type FilterOption = { value: string; label: string };

type AccountContentClientProps = {
  courseOptions: FilterOption[];
  packageOptions: FilterOption[];
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
};

export function AccountContentClient({
  courseOptions,
  packageOptions,
}: AccountContentClientProps) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const type = parseQuickActionType(searchParams.get("type"));
  const search =
    (searchParams.get("search") ?? searchParams.get("q"))?.trim() || undefined;
  const page = parsePageParam(searchParams.get("page") ?? undefined);
  const limit =
    Number.parseInt(
      searchParams.get("limit") || String(QUICK_CONTENT_PAGE_SIZE),
      10
    ) || QUICK_CONTENT_PAGE_SIZE;
  const courseId =
    searchParams.get("courseId")?.trim() &&
    searchParams.get("courseId") !== "all"
      ? searchParams.get("courseId")!.trim()
      : undefined;
  const packageId =
    searchParams.get("packageId")?.trim() &&
    searchParams.get("packageId") !== "all"
      ? searchParams.get("packageId")!.trim()
      : undefined;
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

  const queryKey = useMemo(
    () =>
      JSON.stringify({
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
    [
      type,
      search,
      page,
      limit,
      courseId,
      packageId,
      completionStatus,
      liveClassStatus,
      resultStatus,
    ]
  );

  const [items, setItems] = useState<AccountCourseContentItem[]>([]);
  const [resultType, setResultType] = useState<string>(type);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [ssoToken, setSsoToken] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams();
    qs.set("type", type);
    qs.set("page", String(page));
    qs.set("limit", String(limit));
    if (search) qs.set("search", search);
    if (courseId) qs.set("courseId", courseId);
    if (packageId) qs.set("packageId", packageId);
    if (completionStatus) qs.set("completionStatus", completionStatus);
    if (liveClassStatus) qs.set("liveClassStatus", liveClassStatus);
    if (resultStatus) qs.set("resultStatus", resultStatus);

    try {
      const [listRes, ssoRes] = await Promise.all([
        fetchAuthed(`/api/account/courses/quick-actions?${qs.toString()}`),
        fetchAuthed("/api/graphy/sso"),
      ]);
      const listJson = (await listRes.json()) as QuickActionsApiResponse;
      const ssoJson = (await ssoRes.json()) as SsoApiResponse;

      if (!listRes.ok || !listJson.ok) {
        setItems([]);
        setPagination({ page: 1, totalPages: 1 });
        setResultType(type);
        return;
      }

      setItems(listJson.items ?? []);
      setResultType(listJson.type || type);
      setPagination({
        page: listJson.page ?? page,
        totalPages: listJson.totalPages ?? 1,
      });
      setSsoToken(ssoJson.ok ? ssoJson.graphy?.ssoToken || "" : "");
    } catch {
      setItems([]);
      setPagination({ page: 1, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [
    type,
    search,
    page,
    limit,
    courseId,
    packageId,
    completionStatus,
    liveClassStatus,
    resultStatus,
  ]);

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, [load, queryKey]);

  const paginationQuery = useMemo(() => {
    const q: Record<string, string> = {
      type: resultType || type || DEFAULT_CONTENT_TYPE,
      limit: String(limit),
    };
    if (search) q.search = search;
    if (courseId) q.courseId = courseId;
    if (packageId) q.packageId = packageId;
    if (completionStatus) q.completionStatus = completionStatus;
    if (liveClassStatus) q.liveClassStatus = liveClassStatus;
    if (resultStatus) q.resultStatus = resultStatus;
    return q;
  }, [
    resultType,
    type,
    limit,
    search,
    courseId,
    packageId,
    completionStatus,
    liveClassStatus,
    resultStatus,
  ]);

  const showShimmer = loading || isPending;

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
        activeType={resultType || type}
        query={paginationQuery}
      />

      <AccountQuickContentToolbar
        basePath="/account/content"
        activeType={resultType || type}
        initialSearch={search || ""}
        activeCompletionStatus={completionStatus || "all"}
        activeLiveClassStatus={liveClassStatus || "all"}
        activeResultStatus={resultStatus || "all"}
        activeCourseId={courseId || "all"}
        activePackageId={packageId || "all"}
        courseOptions={courseOptions}
        packageOptions={packageOptions}
        showCoursePackageFilters
        preserveQuery={{ limit: String(limit) }}
      />

      {showShimmer ? (
        <AccountContentListingSkeleton />
      ) : items.length === 0 ? (
        <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-6 py-12 text-center">
          <p className="text-body text-[var(--account-text-muted)]">
            No content matches these filters.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {items.map((item) => {
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

      {!showShimmer && pagination.totalPages > 1 ? (
        <AccountPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          basePath="/account/content"
          query={paginationQuery}
          className="pt-8"
        />
      ) : null}
    </div>
  );
}
