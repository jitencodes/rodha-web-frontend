"use client";

import { ListFilter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  COURSE_SORT_PRESETS,
  DEFAULT_COURSE_SORT,
} from "@/lib/course-sort";

type FilterOption = { value: string; label: string };

type AccountBuyCoursesToolbarProps = {
  initialSearch: string;
  activeCategoryId: string;
  categoryOptions: FilterOption[];
  activeType: string;
  typeOptions: FilterOption[];
  activeSubCategory1: string;
  subCategoryOptions: FilterOption[];
  activeSort: string;
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

export function AccountBuyCoursesToolbar({
  initialSearch,
  activeCategoryId,
  categoryOptions,
  activeType,
  typeOptions,
  activeSubCategory1,
  subCategoryOptions,
  activeSort,
}: AccountBuyCoursesToolbarProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(initialSearch);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  useEffect(() => {
    setQuery(initialSearch);
  }, [initialSearch]);

  function hrefFor(next: {
    q?: string;
    categoryId?: string;
    type?: string;
    subCategory1?: string;
    sort?: string;
  } = {}): string {
    const params = new URLSearchParams();
    params.set("tab", "buy");

    const search = next.q !== undefined ? next.q : query;
    const categoryId =
      next.categoryId !== undefined ? next.categoryId : activeCategoryId;
    const type = next.type !== undefined ? next.type : activeType;
    const subCategory1 =
      next.subCategory1 !== undefined ? next.subCategory1 : activeSubCategory1;
    const sort = next.sort !== undefined ? next.sort : activeSort;

    const trimmed = search.trim();
    if (trimmed) params.set("q", trimmed);
    if (categoryId && categoryId !== "all") params.set("categoryId", categoryId);
    if (type && type !== "all") params.set("type", type);
    if (subCategory1 && subCategory1 !== "all") {
      params.set("subCategory1", subCategory1);
    }
    if (sort && sort !== DEFAULT_COURSE_SORT) params.set("sort", sort);

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
    navigate({
      categoryId: "all",
      type: "all",
      subCategory1: "all",
      sort: DEFAULT_COURSE_SORT,
    });
  }

  const activeFilterCount = [
    activeCategoryId && activeCategoryId !== "all",
    activeType && activeType !== "all",
    activeSubCategory1 && activeSubCategory1 !== "all",
    activeSort && activeSort !== DEFAULT_COURSE_SORT,
  ].filter(Boolean).length;

  const filterDropdowns = (
    <>
      {categoryOptions.length > 0 ? (
        <DropdownSelect
          value={activeCategoryId || "all"}
          onChange={(value) =>
            navigate({
              categoryId: value,
              type: "all",
              subCategory1: "all",
            })
          }
          options={[
            { value: "all", label: "All Categories" },
            ...categoryOptions,
          ]}
          aria-label="Category"
          className="w-full min-w-0 md:w-auto md:min-w-[10rem]"
          variant="light"
        />
      ) : null}
      {typeOptions.length > 0 ? (
        <DropdownSelect
          value={activeType || "all"}
          onChange={(value) =>
            navigate({ type: value, subCategory1: "all" })
          }
          options={[
            { value: "all", label: "All Types" },
            ...typeOptions,
          ]}
          aria-label="Type"
          className="w-full min-w-0 md:w-auto md:min-w-[10rem]"
          variant="light"
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
          variant="light"
        />
      ) : null}
      <DropdownSelect
        value={activeSort || DEFAULT_COURSE_SORT}
        onChange={(value) => navigate({ sort: value })}
        options={COURSE_SORT_PRESETS.map((preset) => ({
          value: preset.value,
          label: preset.label,
        }))}
        aria-label="Sort by"
        className="w-full min-w-0 md:w-auto md:min-w-[11rem]"
        variant="light"
      />
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
              placeholder="Search packages..."
              aria-label="Search packages to buy"
              variant="light"
            />
          </div>
        </div>

        <div className="hidden w-full shrink-0 md:block md:w-64 lg:w-72">
          <SearchInput
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onClear={() => handleSearch("")}
            placeholder="Search packages..."
            aria-label="Search packages to buy"
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
          <div className="flex flex-col gap-3">{filterDropdowns}</div>
          <div className="sticky bottom-0 flex gap-3 border-t border-[var(--account-border)] bg-[var(--account-surface)] pt-4 pb-1">
            <button
              type="button"
              onClick={() => clearFilters()}
              className="h-11 flex-1 rounded-[var(--account-radius)] border border-[var(--account-border)] text-body-sm font-medium text-[var(--account-text)]"
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
