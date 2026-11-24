"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRightLeft, X } from "lucide-react";
import { toast } from "sonner";
import { AccountContinueWatchingCard } from "@/components/account/AccountContinueWatchingCard";
import { AccountThemedPortal } from "@/components/account/AccountThemedPortal";
import { useAccountTheme } from "@/components/account/AccountThemeProvider";
import {
  accountInputClassName,
  accountLabelClassName,
} from "@/components/account/forms/accountFieldStyles";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ContinueWatchingItem } from "@/lib/account/types";
import {
  COURSE_CHANGE_PAGE_SIZE,
  COURSE_CHANGE_REASON_MAX,
} from "@/lib/api/modules/student/course-changes/mapper";
import type { CourseChangeOptionsViewModel } from "@/lib/api/modules/student/course-changes/types";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { cn } from "@/lib/utils";

type Filters = {
  search: string;
  packageId: string;
  language: string;
  sort: string;
  page: number;
};

type CourseChangeDialogProps = {
  courseId: string;
  courseTitle: string;
  initial: CourseChangeOptionsViewModel;
  onClose: () => void;
};

const SEARCH_DEBOUNCE_MS = 300;

const SORT_OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "title_asc", label: "Title: A to Z" },
  { value: "title_desc", label: "Title: Z to A" },
];

const EMPTY_FILTERS: Filters = {
  search: "",
  packageId: "",
  language: "",
  sort: "",
  page: 1,
};

/** Pick a course to switch to, then confirm with an optional reason. */
export function CourseChangeDialog({
  courseId,
  courseTitle,
  initial,
  onClose,
}: CourseChangeDialogProps) {
  const titleId = useId();
  const reasonId = useId();
  const { theme } = useAccountTheme();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [target, setTarget] = useState<ContinueWatchingItem | null>(null);
  const [reason, setReason] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const requestRef = useRef(0);
  const isFirstLoadRef = useRef(true);
  const bodyRef = useRef<HTMLDivElement>(null);

  const load = useCallback(
    async (next: Filters) => {
      const request = ++requestRef.current;
      setLoading(true);
      setLoadError("");
      const params = new URLSearchParams({
        courseId,
        page: String(next.page),
        limit: String(COURSE_CHANGE_PAGE_SIZE),
      });
      if (next.search) params.set("search", next.search);
      if (next.packageId) params.set("packageId", next.packageId);
      if (next.language) params.set("language", next.language);
      if (next.sort) params.set("sort", next.sort);
      try {
        const res = await fetchAuthed(
          `/api/account/course-changes/options?${params.toString()}`
        );
        const json = (await res.json().catch(() => null)) as {
          ok?: boolean;
          error?: string;
          data?: CourseChangeOptionsViewModel;
        } | null;
        if (request !== requestRef.current) return;
        if (!res.ok || !json?.ok || !json.data) {
          setLoadError(json?.error || "Unable to load courses.");
          return;
        }
        setData(json.data);
      } catch {
        if (request === requestRef.current) {
          setLoadError("Something went wrong. Check your connection and try again.");
        }
      } finally {
        if (request === requestRef.current) setLoading(false);
      }
    },
    [courseId]
  );

  // The first page is already loaded by the CTA.
  useEffect(() => {
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      return;
    }
    void load(filters);
    bodyRef.current?.scrollTo({ top: 0 });
  }, [filters, load]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const search = searchText.trim();
      setFilters((prev) =>
        prev.search === search ? prev : { ...prev, search, page: 1 }
      );
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const confirmOpen = target != null;
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      // The confirmation (or an open filter menu) handles Escape first.
      if (event.key !== "Escape" || confirmOpen) return;
      if (document.querySelector('[role="listbox"]')) return;
      onClose();
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [confirmOpen, onClose]);

  const { summary } = data;
  const blocked = !summary.canRequest;
  const hasFilters = Boolean(
    searchText || filters.packageId || filters.language || filters.sort
  );

  function applyFilter(patch: Partial<Filters>) {
    setFilters((prev) => ({ ...prev, page: 1, ...patch }));
  }

  function resetFilters() {
    setSearchText("");
    setFilters(EMPTY_FILTERS);
  }

  function chooseTarget(item: ContinueWatchingItem) {
    setTarget(item);
    setReason("");
    setSubmitError("");
  }

  const cancelConfirm = useCallback(() => {
    setTarget(null);
    setSubmitError("");
  }, []);

  async function submit() {
    if (!target || submitting) return;
    if (reason.trim().length > COURSE_CHANGE_REASON_MAX) {
      setSubmitError(`Keep the reason within ${COURSE_CHANGE_REASON_MAX} characters.`);
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetchAuthed("/api/account/course-changes/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: data.packageId,
          fromCourseId: courseId,
          toCourseId: target.id,
          reason,
        }),
      });
      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        errors?: Record<string, string>;
      } | null;
      if (!res.ok || !json?.ok) {
        const fieldError =
          json?.errors?.toCourseId ||
          json?.errors?.fromCourseId ||
          json?.errors?.packageId ||
          json?.errors?.reason;
        // On a 409 `errors` holds the blocked code; the message is the readable part.
        setSubmitError(
          (res.status === 409 ? json?.error : fieldError || json?.error) ||
            "Unable to submit your request."
        );
        // Blocked meanwhile: show why here, with the fresh state behind it.
        if (res.status === 409) void load(filters);
        return;
      }
      toast.success("Course change request submitted", {
        description: "We will review it and update you here.",
      });
      onClose();
    } catch {
      setSubmitError("Something went wrong. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const showFilters = !blocked && (data.changeable || hasFilters);

  return (
    <AccountThemedPortal>
      <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
        <button
          type="button"
          aria-label="Close"
          tabIndex={-1}
          className="absolute inset-0 cursor-default bg-black/50"
          onClick={onClose}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative z-[101] flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl border border-[var(--account-border)] bg-[var(--account-surface)] shadow-xl sm:rounded-2xl"
        >
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--account-border)] px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <h2
                id={titleId}
                className="font-montserrat text-h4 font-bold text-[var(--account-text)]"
              >
                Request course change
              </h2>
              <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
                Switch from{" "}
                <span className="font-semibold text-[var(--account-text-secondary)]">
                  {courseTitle}
                </span>
                {data.packageTitle ? ` in ${data.packageTitle}` : ""}
              </p>
              {summary.max > 0 ? (
                <p className="mt-2 inline-flex rounded-full bg-[var(--account-nav-active-bg)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--account-accent)]">
                  {summary.remaining} of {summary.max} changes left
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="cursor-pointer rounded-lg p-1.5 text-[var(--account-text-muted)] hover:bg-[var(--account-nav-hover)]"
            >
              <X className="size-5" aria-hidden />
            </button>
          </header>

          {showFilters ? (
            <div className="flex shrink-0 flex-col gap-3 border-b border-[var(--account-border)] px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:px-6">
              <div className="w-full sm:w-64">
                <SearchInput
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onClear={() => setSearchText("")}
                  placeholder="Search courses..."
                  aria-label="Search courses to switch to"
                  variant="account"
                />
              </div>
              {data.packageOptions.length > 1 ? (
                <DropdownSelect
                  value={filters.packageId || String(data.packageId ?? "")}
                  onChange={(packageId) => applyFilter({ packageId, language: "" })}
                  options={data.packageOptions}
                  aria-label="Package"
                  className="w-full sm:w-auto"
                  triggerWidth="full"
                  triggerMaxWidth={260}
                  menuWidth="content"
                  menuMaxWidth={420}
                  variant="account"
                />
              ) : null}
              {data.languageOptions.length > 1 ? (
                <DropdownSelect
                  value={filters.language}
                  onChange={(language) => applyFilter({ language })}
                  options={[
                    { value: "", label: "All languages" },
                    ...data.languageOptions,
                  ]}
                  aria-label="Language"
                  className="w-full sm:w-auto"
                  triggerWidth="full"
                  variant="account"
                />
              ) : null}
              <DropdownSelect
                value={filters.sort}
                onChange={(sort) => applyFilter({ sort })}
                options={SORT_OPTIONS}
                aria-label="Sort by"
                className="w-full sm:w-auto"
                triggerWidth="full"
                variant="account"
              />
              {hasFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-9 shrink-0 cursor-pointer rounded-[var(--account-radius)] border border-[var(--account-border)] px-3 text-[13px] font-medium text-[var(--account-text-secondary)] transition-colors hover:border-[var(--account-accent)] hover:text-[var(--account-accent)]"
                >
                  Reset Filters
                </button>
              ) : null}
            </div>
          ) : null}

          <div
            ref={bodyRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--account-bg)] px-4 py-5 sm:px-6"
            aria-busy={loading}
          >
            {blocked ? (
              <Notice>
                <p>
                  {summary.blockedMessage ||
                    "You cannot request a course change right now."}
                </p>
                {summary.blockedReason === "COOLDOWN" && summary.nextAllowedLabel ? (
                  <p className="mt-1 font-semibold text-[var(--account-text)]">
                    You can request again on {summary.nextAllowedLabel}.
                  </p>
                ) : null}
                <Link
                  href="/account/course-changes"
                  className="mt-4 inline-block text-[13px] font-semibold text-[var(--account-accent)]"
                >
                  View my requests →
                </Link>
              </Notice>
            ) : loadError ? (
              <Notice>
                <p role="alert">{loadError}</p>
                <button
                  type="button"
                  onClick={() => void load(filters)}
                  className="mt-3 cursor-pointer text-[13px] font-semibold text-[var(--account-accent)]"
                >
                  Retry
                </button>
              </Notice>
            ) : loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton
                    key={index}
                    className="h-72 w-full rounded-[var(--account-radius)]"
                  />
                ))}
              </div>
            ) : data.items.length === 0 ? (
              <Notice>
                <p>
                  {hasFilters
                    ? "No courses match these filters."
                    : "No courses in your packages can be changed."}
                </p>
              </Notice>
            ) : (
              <>
                <p className="mb-3 text-[12px] text-[var(--account-text-muted)]">
                  {data.total} course{data.total === 1 ? "" : "s"} available
                </p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {data.items.map((item) => (
                    <AccountContinueWatchingCard
                      key={item.id}
                      item={item}
                      action={{
                        label: "Change",
                        icon: <ArrowRightLeft className="size-3.5" aria-hidden />,
                        onClick: () => chooseTarget(item),
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            {!blocked && !loading && !loadError && data.totalPages > 1 ? (
              <Pagination
                currentPage={data.page}
                totalPages={data.totalPages}
                onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                variant={theme === "dark" ? "dark" : "light"}
                className="pt-6"
              />
            ) : null}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm course change"
        description="Our team will review this request. When it is approved you get the new course, lose the current one, and start fresh: progress is not carried over."
        confirmLabel="Submit request"
        cancelLabel="Back"
        confirming={submitting}
        onConfirm={() => void submit()}
        onCancel={() => {
          if (!submitting) cancelConfirm();
        }}
        disableDismiss={submitting}
      >
        <div className="mt-4 space-y-4">
          <div className="rounded-md border border-[var(--account-border)] bg-[var(--account-nav-hover)] p-3 text-[13px]">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--account-text-muted)]">
              Current course
            </p>
            <p className="font-semibold text-[var(--account-text)]">{courseTitle}</p>
            <ArrowDown
              className="my-1.5 size-4 text-[var(--account-accent)]"
              aria-hidden
            />
            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--account-text-muted)]">
              New course
            </p>
            <p className="font-semibold text-[var(--account-accent)]">
              {target?.title}
            </p>
          </div>

          <div>
            <label htmlFor={reasonId} className={accountLabelClassName}>
              Reason (optional)
            </label>
            <textarea
              id={reasonId}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setSubmitError("");
              }}
              rows={3}
              maxLength={COURSE_CHANGE_REASON_MAX}
              placeholder="For example: batch timing clashes with college"
              disabled={submitting}
              className={cn(accountInputClassName, "resize-y")}
            />
            <p className="mt-1 text-right text-[11px] text-[var(--account-text-muted)]">
              {reason.length}/{COURSE_CHANGE_REASON_MAX}
            </p>
          </div>

          {submitError ? (
            <p className="text-[12px] text-red-500" role="alert">
              {submitError}
            </p>
          ) : null}
        </div>
      </ConfirmDialog>
    </AccountThemedPortal>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-6 py-12 text-center text-body-sm text-[var(--account-text-muted)]">
      {children}
    </div>
  );
}
