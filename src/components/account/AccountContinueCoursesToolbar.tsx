"use client";

import { ListFilter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { SearchInput } from "@/components/ui/SearchInput";
import { CONTINUE_SORT_OPTIONS } from "@/lib/account/course-content-filters";

type FilterOption = { value: string; label: string };

type AccountContinueCoursesToolbarProps = {
  initialSearch: string;
  activeCategoryId: string;
  categoryOptions: FilterOption[];
  activeSubCategory1: string;
  subCategoryOptions: FilterOption[];
  activePackageId: string;
  packageOptions: FilterOption[];
  activeSort: string;
  validTillFrom: string;
  validTillTo: string;
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

export function AccountContinueCoursesToolbar({
  initialSearch,
  activeCategoryId,
  categoryOptions,
  activeSubCategory1,
  subCategoryOptions,
  activePackageId,
  packageOptions,
  activeSort,
  validTillFrom,
  validTillTo,
}: AccountContinueCoursesToolbarProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(initialSearch);
  const [fromDate, setFromDate] = useState(validTillFrom);
  const [toDate, setToDate] = useState(validTillTo);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setFromDate(validTillFrom);
    setToDate(validTillTo);
  }, [validTillFrom, validTillTo]);

  function hrefFor(next: {
    q?: string;
    categoryId?: string;
    subCategory1?: string;
    packageId?: string;
    sortBy?: string;
    validTillFrom?: string;
    validTillTo?: string;
  } = {}): string {
    const params = new URLSearchParams();
    params.set("tab", "continue");

    const search = next.q !== undefined ? next.q : query;
    const categoryId =
      next.categoryId !== undefined ? next.categoryId : activeCategoryId;
    const subCategory1 =
      next.subCategory1 !== undefined ? next.subCategory1 : activeSubCategory1;
    const packageId =
      next.packageId !== undefined ? next.packageId : activePackageId;
    const sortBy = next.sortBy !== undefined ? next.sortBy : activeSort;
    const from =
      next.validTillFrom !== undefined ? next.validTillFrom : fromDate;
    const to = next.validTillTo !== undefined ? next.validTillTo : toDate;

    const trimmed = search.trim();
    if (trimmed) params.set("q", trimmed);
    if (categoryId && categoryId !== "all") params.set("categoryId", categoryId);
    if (subCategory1 && subCategory1 !== "all") {
      params.set("subCategory1", subCategory1);
    }
    if (packageId && packageId !== "all") params.set("packageId", packageId);
    if (sortBy && sortBy !== "continue_watching") params.set("sortBy", sortBy);
    if (from) params.set("validTillFrom", from);
    if (to) params.set("validTillTo", to);

    return `/account/courses?${params.toString()}`;
  }

  function navigate(next?: Parameters<typeof hrefFor>[0]) {
    startTransition(() => {
      router.push(hrefFor(next));
    });
  }

  function handleSearch(value: string) {
    setQuery(value);
    navigate({ q: value });
  }

  function clearFilters() {
    setQuery("");
    setFromDate("");
    setToDate("");
    navigate({
      q: "",
      categoryId: "all",
      subCategory1: "all",
      packageId: "all",
      sortBy: "continue_watching",
      validTillFrom: "",
      validTillTo: "",
    });
  }

  const activeFilterCount = [
    activeCategoryId && activeCategoryId !== "all",
    activeSubCategory1 && activeSubCategory1 !== "all",
    activePackageId && activePackageId !== "all",
    activeSort && activeSort !== "continue_watching",
    Boolean(validTillFrom),
    Boolean(validTillTo),
  ].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0 || Boolean(query.trim());

  const dateInputs = (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center md:w-auto">
      <label className="flex min-w-0 flex-1 flex-col gap-1 text-[12px] font-medium text-[var(--account-text-muted)] md:flex-none">
        Valid from
        <input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            navigate({ validTillFrom: e.target.value });
          }}
          className="h-9 rounded-[var(--account-radius)] border border-[var(--account-input-border)] bg-[var(--account-input-bg)] px-3 text-[13px] text-[var(--account-text)] [color-scheme:inherit]"
        />
      </label>
      <label className="flex min-w-0 flex-1 flex-col gap-1 text-[12px] font-medium text-[var(--account-text-muted)] md:flex-none">
        Valid to
        <input
          type="date"
          value={toDate}
          onChange={(e) => {
            setToDate(e.target.value);
            navigate({ validTillTo: e.target.value });
          }}
          className="h-9 rounded-[var(--account-radius)] border border-[var(--account-input-border)] bg-[var(--account-input-bg)] px-3 text-[13px] text-[var(--account-text)] [color-scheme:inherit]"
        />
      </label>
    </div>
  );

  const filterDropdowns = (
    <>
      {categoryOptions.length > 0 ? (
        <DropdownSelect
        value={activeCategoryId || "all"}
        onChange={(value) => navigate({ categoryId: value })}
        options={[
          { value: "all", label: "All Categories" },
          ...categoryOptions,
        ]}
        aria-label="Category"
        className="w-full min-w-0 md:w-auto md:min-w-[10rem]"
        triggerWidth="auto"
        menuWidth="trigger"
        variant="account"
      />
      ) : null}
      {subCategoryOptions.length > 0 ? (
        <DropdownSelect
        value={activeSubCategory1 || "all"}
        onChange={(value) => navigate({ subCategory1: value })}
        options={[
          { value: "all", label: "All Sub-categories" },
          ...subCategoryOptions,
        ]}
        aria-label="Sub-category"
        className="w-full min-w-0 md:w-auto md:min-w-[11rem]"
        triggerWidth="auto"
        menuWidth="trigger"
        variant="account"
      />
      ) : null}
      {packageOptions.length > 0 ? (
        <DropdownSelect
        value={activePackageId || "all"}
        onChange={(value) => navigate({ packageId: value })}
        options={[
          { value: "all", label: "All Packages" },
          ...packageOptions,
        ]}
        aria-label="Package"
        className="w-full min-w-0 md:w-auto md:min-w-[10rem]"
        triggerWidth="auto"
        triggerMinWidth={160}
        menuWidth="content"
        menuMaxWidth={420}
        variant="account"
      />
      ) : null}
      <DropdownSelect
        value={activeSort || "continue_watching"}
        onChange={(value) => navigate({ sortBy: value })}
        options={CONTINUE_SORT_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        aria-label="Sort by"
        className="w-full min-w-0 md:w-auto md:min-w-[11rem]"
        triggerWidth="auto"
        menuWidth="trigger"
        variant="account"
      />
      {dateInputs}
    </>
  );

  return (
    <div className="mb-5 flex flex-col gap-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="relative hidden min-w-0 flex-1 flex-wrap items-end gap-3 md:flex">
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
              placeholder="Search courses..."
              aria-label="Search continue watching"
              variant="account"
            />
          </div>
        </div>

        <div className="hidden w-full shrink-0 md:block md:w-64 lg:w-72">
          <SearchInput
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onClear={() => handleSearch("")}
            placeholder="Search courses..."
            aria-label="Search continue watching"
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
