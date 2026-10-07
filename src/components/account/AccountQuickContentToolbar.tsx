"use client";

import { ListFilter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  COMPLETION_STATUS_OPTIONS,
  DEFAULT_CONTENT_TYPE,
  LIVE_CLASS_STATUS_OPTIONS,
  RESULT_STATUS_OPTIONS,
} from "@/lib/account/course-content-filters";

type FilterOption = { value: string; label: string };

type AccountQuickContentToolbarProps = {
  basePath: string;
  activeType: string;
  initialSearch: string;
  activeCompletionStatus: string;
  activeLiveClassStatus: string;
  activeResultStatus: string;
  activeCourseId?: string;
  activePackageId?: string;
  courseOptions?: FilterOption[];
  packageOptions?: FilterOption[];
  /** When false, hide course/package filters (e.g. course detail already scoped). */
  showCoursePackageFilters?: boolean;
  /** Extra query keys preserved on navigation (e.g. limit). */
  preserveQuery?: Record<string, string>;
};

function FilterIconButton({
  onClick,
  activeCount = 0,
}: {
  onClick: () => void;
  activeCount?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] text-[var(--account-text)] transition-colors hover:border-[var(--account-accent)]/50 hover:text-[var(--account-accent)]"
      aria-label={
        activeCount > 0 ? `Filters (${activeCount} active)` : "Open filters"
      }
    >
      <ListFilter className="h-4 w-4" aria-hidden />
      {activeCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--account-accent)] px-1 text-[10px] font-semibold leading-none text-white">
          {activeCount}
        </span>
      ) : null}
    </button>
  );
}

export function AccountQuickContentToolbar({
  basePath,
  activeType,
  initialSearch,
  activeCompletionStatus,
  activeLiveClassStatus,
  activeResultStatus,
  activeCourseId = "all",
  activePackageId = "all",
  courseOptions = [],
  packageOptions = [],
  showCoursePackageFilters = true,
  preserveQuery = {},
}: AccountQuickContentToolbarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialSearch);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  const type = activeType || DEFAULT_CONTENT_TYPE;
  const showLiveStatus = type === "live-classes";
  const showResultStatus = type === "quizzes";
  const showCourses =
    showCoursePackageFilters && courseOptions.length > 0;
  const showPackages =
    showCoursePackageFilters && packageOptions.length > 0;

  function hrefFor(next: {
    search?: string;
    completionStatus?: string;
    liveClassStatus?: string;
    resultStatus?: string;
    courseId?: string;
    packageId?: string;
  } = {}): string {
    const params = new URLSearchParams();
    Object.entries(preserveQuery).forEach(([key, value]) => {
      if (
        !value ||
        key === "courseId" ||
        key === "packageId" ||
        key === "search" ||
        key === "page"
      ) {
        return;
      }
      params.set(key, value);
    });
    params.set("type", type);
    params.set("page", "1");

    const search = next.search !== undefined ? next.search : query;
    const completionStatus =
      next.completionStatus !== undefined
        ? next.completionStatus
        : activeCompletionStatus;
    const liveClassStatus =
      next.liveClassStatus !== undefined
        ? next.liveClassStatus
        : activeLiveClassStatus;
    const resultStatus =
      next.resultStatus !== undefined
        ? next.resultStatus
        : activeResultStatus;
    const courseId =
      next.courseId !== undefined ? next.courseId : activeCourseId;
    const packageId =
      next.packageId !== undefined ? next.packageId : activePackageId;

    const trimmed = search.trim();
    if (trimmed) params.set("search", trimmed);
    if (completionStatus && completionStatus !== "all") {
      params.set("completionStatus", completionStatus);
    }
    if (showLiveStatus && liveClassStatus && liveClassStatus !== "all") {
      params.set("liveClassStatus", liveClassStatus);
    }
    if (showResultStatus && resultStatus && resultStatus !== "all") {
      params.set("resultStatus", resultStatus);
    }
    if (showCourses && courseId && courseId !== "all") {
      params.set("courseId", courseId);
    }
    if (showPackages && packageId && packageId !== "all") {
      params.set("packageId", packageId);
    }

    return `${basePath}?${params.toString()}`;
  }

  function navigate(next?: Parameters<typeof hrefFor>[0]) {
    startTransition(() => {
      router.push(hrefFor(next));
    });
  }

  function handleSearch(value: string) {
    setQuery(value);
    navigate({ search: value });
  }

  function clearFilters() {
    setQuery("");
    navigate({
      search: "",
      completionStatus: "all",
      liveClassStatus: "all",
      resultStatus: "all",
      courseId: "all",
      packageId: "all",
    });
  }

  const activeFilterCount = [
    activeCompletionStatus && activeCompletionStatus !== "all",
    showLiveStatus && activeLiveClassStatus && activeLiveClassStatus !== "all",
    showResultStatus && activeResultStatus && activeResultStatus !== "all",
    showCourses && activeCourseId && activeCourseId !== "all",
    showPackages && activePackageId && activePackageId !== "all",
  ].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0 || Boolean(query.trim());

  const filterDropdowns = (
    <>
      {showCourses ? (
        <DropdownSelect
          value={activeCourseId || "all"}
          onChange={(value) => navigate({ courseId: value })}
          options={[
            { value: "all", label: "All Courses" },
            ...courseOptions,
          ]}
          aria-label="Course"
          className="w-full min-w-0 md:w-auto md:min-w-[11rem]"
          variant="account"
        />
      ) : null}
      {showPackages ? (
        <DropdownSelect
          value={activePackageId || "all"}
          onChange={(value) => navigate({ packageId: value })}
          options={[
            { value: "all", label: "All Packages" },
            ...packageOptions,
          ]}
          aria-label="Package"
          className="w-full min-w-0 md:w-auto md:min-w-[11rem]"
          variant="account"
        />
      ) : null}
      <DropdownSelect
        value={activeCompletionStatus || "all"}
        onChange={(value) => navigate({ completionStatus: value })}
        options={COMPLETION_STATUS_OPTIONS.map((o) => ({
          value: o.value,
          label: o.label,
        }))}
        aria-label="Completion status"
        className="w-full min-w-0 md:w-auto md:min-w-[10rem]"
        variant="account"
      />
      {showLiveStatus ? (
        <DropdownSelect
          value={activeLiveClassStatus || "all"}
          onChange={(value) => navigate({ liveClassStatus: value })}
          options={LIVE_CLASS_STATUS_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
          }))}
          aria-label="Live class status"
          className="w-full min-w-0 md:w-auto md:min-w-[10rem]"
          variant="account"
        />
      ) : null}
      {showResultStatus ? (
        <DropdownSelect
          value={activeResultStatus || "all"}
          onChange={(value) => navigate({ resultStatus: value })}
          options={RESULT_STATUS_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
          }))}
          aria-label="Result status"
          className="w-full min-w-0 md:w-auto md:min-w-[10rem]"
          variant="account"
        />
      ) : null}
    </>
  );

  return (
    <div
      className="mb-5 flex flex-col gap-3"
      data-pending={isPending ? "true" : undefined}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative hidden min-w-0 flex-1 flex-wrap items-center gap-3 md:flex">
          {filterDropdowns}
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => clearFilters()}
              className="h-9 shrink-0 rounded-[var(--account-radius)] border border-[var(--account-border)] px-3 text-[13px] font-medium text-[var(--account-text-secondary)] transition-colors hover:border-[var(--account-accent)] hover:text-[var(--account-accent)]"
            >
              Reset Filters
            </button>
          ) : null}
        </div>

        <div className="flex min-w-0 items-center gap-3 md:hidden">
          <FilterIconButton
            onClick={() => setFilterSheetOpen(true)}
            activeCount={activeFilterCount}
          />
          <div className="min-w-0 flex-1">
            <SearchInput
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onClear={() => handleSearch("")}
              placeholder="Search content..."
              aria-label="Search content"
              variant="account"
            />
          </div>
        </div>

        <div className="hidden w-full shrink-0 md:block md:w-64 lg:w-72">
          <SearchInput
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onClear={() => handleSearch("")}
            placeholder="Search content..."
            aria-label="Search content"
            variant="account"
          />
        </div>
      </div>

      <BottomSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        title="Filters"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">{filterDropdowns}</div>
          <div className="sticky bottom-0 flex gap-3 border-t border-[var(--account-border)] bg-[var(--account-surface)] pt-4 pb-1">
            <button
              type="button"
              onClick={() => clearFilters()}
              className="h-11 flex-1 rounded-[var(--account-radius)] border border-[var(--account-border)] text-body-sm font-medium text-[var(--account-text)]"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={() => setFilterSheetOpen(false)}
              className="h-11 flex-1 rounded-[var(--account-radius)] bg-[var(--account-accent)] text-body-sm font-semibold text-white"
            >
              Apply
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
