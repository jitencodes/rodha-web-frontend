"use client";

import { ListFilter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  COMPLETION_STATUS_OPTIONS,
  LIVE_CLASS_STATUS_OPTIONS,
  RESULT_STATUS_OPTIONS,
} from "@/lib/account/course-content-filters";
import type { AccountCourseChapterOption } from "@/lib/api/modules/student/courses/mapper";
import { cn } from "@/lib/utils";

type AccountCourseContentToolbarProps = {
  courseId: string;
  activeType: string;
  initialSearch: string;
  activeChapterId: string;
  activeCompletionStatus: string;
  activeLiveClassStatus: string;
  activeResultStatus: string;
  chapters: AccountCourseChapterOption[];
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

export function AccountCourseContentToolbar({
  courseId,
  activeType,
  initialSearch,
  activeChapterId,
  activeCompletionStatus,
  activeLiveClassStatus,
  activeResultStatus,
  chapters,
}: AccountCourseContentToolbarProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(initialSearch);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  const showChapter = chapters.length > 0;
  const showLiveStatus =
    !activeType || activeType === "live-classes" || activeType === "";
  const showResultStatus =
    !activeType || activeType === "quizzes" || activeType === "";

  function hrefFor(next: {
    search?: string;
    chapterId?: string;
    completionStatus?: string;
    liveClassStatus?: string;
    resultStatus?: string;
  } = {}): string {
    const params = new URLSearchParams();
    const search = next.search !== undefined ? next.search : query;
    const chapterId =
      next.chapterId !== undefined ? next.chapterId : activeChapterId;
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

    if (activeType) params.set("type", activeType);
    const trimmed = search.trim();
    if (trimmed) params.set("search", trimmed);
    if (chapterId && chapterId !== "all") params.set("chapterId", chapterId);
    if (completionStatus && completionStatus !== "all") {
      params.set("completionStatus", completionStatus);
    }
    if (
      showLiveStatus &&
      liveClassStatus &&
      liveClassStatus !== "all"
    ) {
      params.set("liveClassStatus", liveClassStatus);
    }
    if (
      showResultStatus &&
      resultStatus &&
      resultStatus !== "all"
    ) {
      params.set("resultStatus", resultStatus);
    }

    const qs = params.toString();
    return qs
      ? `/account/courses/${courseId}?${qs}`
      : `/account/courses/${courseId}`;
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
    navigate({
      chapterId: "all",
      completionStatus: "all",
      liveClassStatus: "all",
      resultStatus: "all",
    });
  }

  const activeFilterCount = [
    showChapter && activeChapterId && activeChapterId !== "all",
    activeCompletionStatus && activeCompletionStatus !== "all",
    showLiveStatus &&
      activeLiveClassStatus &&
      activeLiveClassStatus !== "all",
    showResultStatus &&
      activeResultStatus &&
      activeResultStatus !== "all",
  ].filter(Boolean).length;

  const filterDropdowns = (
    <>
      {showChapter ? (
        <DropdownSelect
          value={activeChapterId || "all"}
          onChange={(value) => navigate({ chapterId: value })}
          options={[
            { value: "all", label: "All Chapters" },
            ...chapters.map((c) => ({ value: c.id, label: c.title })),
          ]}
          aria-label="Chapter"
          className="w-full min-w-0 md:w-auto md:min-w-[10rem]"
          variant="light"
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
        className="w-full min-w-0 md:w-auto md:min-w-[11rem]"
        variant="light"
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
          variant="light"
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
          aria-label="Quiz result status"
          className="w-full min-w-0 md:w-auto md:min-w-[10rem]"
          variant="light"
        />
      ) : null}
    </>
  );

  return (
    <div className="mb-5 flex flex-col gap-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative hidden min-w-0 flex-1 flex-wrap items-center gap-3 md:flex">
          {filterDropdowns}
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
              aria-label="Search course content"
              variant="light"
            />
          </div>
        </div>

        <div className="hidden w-full shrink-0 md:block md:w-64 lg:w-72">
          <SearchInput
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onClear={() => handleSearch("")}
            placeholder="Search content..."
            aria-label="Search course content"
            variant="light"
          />
        </div>
      </div>

      <BottomSheet
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        title="Filters"
      >
        <div className="flex flex-col gap-4">
          <div className={cn("flex flex-col gap-3")}>{filterDropdowns}</div>
          <div className="sticky bottom-0 flex gap-3 border-t border-[var(--account-border)] bg-[var(--account-surface)] pt-4 pb-1">
            <button
              type="button"
              onClick={() => clearFilters()}
              className="h-11 flex-1 rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] text-body-sm font-medium text-[var(--account-text)]"
            >
              Clear
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
