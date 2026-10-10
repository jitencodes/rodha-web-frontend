"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListFilter } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { SearchInput } from "@/components/ui/SearchInput";
import { PRICE_FILTERS } from "@/lib/course-filters";
import {
  COURSE_SORT_PRESETS,
  DEFAULT_COURSE_SORT,
} from "@/lib/course-sort";
import { cn } from "@/lib/utils";

export interface CatalogFilterOption {
  value: string;
  label: string;
}

interface CatalogToolbarBaseProps {
  basePath: string;
  initialQuery: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
}

/** Legacy toolbar used by test-series (graphy category tabs + price). */
interface CatalogToolbarLegacyProps extends CatalogToolbarBaseProps {
  variant?: "legacy";
  activeCategory: string;
  categoryOptions?: CatalogFilterOption[];
  activeType: string;
  courseTypeOptions?: CatalogFilterOption[];
  activePrice: string;
  showCourseType?: boolean;
  showPrice?: boolean;
  categoryAriaLabel: string;
}

/** Packages listing toolbar — master-driven filters. */
interface CatalogToolbarPackagesProps extends CatalogToolbarBaseProps {
  variant: "packages";
  activeCategoryId: string;
  categoryOptions?: CatalogFilterOption[];
  activeType: string;
  typeOptions?: CatalogFilterOption[];
  activeSubCategory1: string;
  subCategoryOptions?: CatalogFilterOption[];
  activeFacultyId: string;
  facultyOptions?: CatalogFilterOption[];
  activeSubjectId: string;
  subjectOptions?: CatalogFilterOption[];
  activeSort: string;
  tabsAriaLabel?: string;
}

export type CatalogToolbarProps =
  | CatalogToolbarLegacyProps
  | CatalogToolbarPackagesProps;

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
      className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-neutral-200 bg-white text-neutral-700 transition-colors hover:border-orange-500/60 hover:text-orange-600"
      aria-label={
        activeCount > 0 ? `Filters (${activeCount} active)` : "Open filters"
      }
    >
      <ListFilter className="h-4 w-4" aria-hidden />
      {activeCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold leading-none text-white">
          {activeCount}
        </span>
      ) : null}
    </button>
  );
}

function PackagesCatalogToolbar({
  basePath,
  activeCategoryId,
  categoryOptions = [],
  initialQuery,
  activeType,
  typeOptions = [],
  activeSubCategory1,
  subCategoryOptions = [],
  activeFacultyId,
  facultyOptions = [],
  activeSubjectId,
  subjectOptions = [],
  activeSort,
  searchPlaceholder,
  searchAriaLabel,
  tabsAriaLabel = "Course types",
}: CatalogToolbarPackagesProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    scrollLeft: number;
    moved: boolean;
  }>({ active: false, startX: 0, scrollLeft: 0, moved: false });

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const measureOverflow = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    setOverflowing(el.scrollWidth > el.clientWidth + 2);
  }, []);

  useEffect(() => {
    measureOverflow();
    const el = tabsRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measureOverflow());
    ro.observe(el);
    window.addEventListener("resize", measureOverflow);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureOverflow);
    };
  }, [measureOverflow, subCategoryOptions.length]);

  function hrefFor(
    next: {
      categoryId?: string;
      q?: string;
      type?: string;
      subCategory1?: string;
      facultyId?: string;
      subjectId?: string;
      sort?: string;
    } = {}
  ): string {
    const params = new URLSearchParams();
    const categoryId = next.categoryId ?? activeCategoryId;
    const search = next.q !== undefined ? next.q : query;
    const type = next.type ?? activeType;
    const subCategory1 = next.subCategory1 ?? activeSubCategory1;
    const facultyId = next.facultyId ?? activeFacultyId;
    const subjectId = next.subjectId ?? activeSubjectId;
    const sort = next.sort ?? activeSort;

    if (categoryId && categoryId !== "all") {
      params.set("categoryId", categoryId);
    }
    const trimmedSearch = search.trim();
    if (trimmedSearch) {
      params.set("q", trimmedSearch);
    }
    if (type && type !== "all") {
      params.set("type", type);
    }
    if (subCategory1 && subCategory1 !== "all") {
      params.set("subCategory1", subCategory1);
    }
    if (facultyId && facultyId !== "all") {
      params.set("facultyId", facultyId);
    }
    if (subjectId && subjectId !== "all") {
      params.set("subjectId", subjectId);
    }
    if (sort && sort !== DEFAULT_COURSE_SORT) {
      params.set("sort", sort);
    }

    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function navigate(
    next?: Parameters<typeof hrefFor>[0]
  ) {
    startTransition(() => {
      router.push(hrefFor(next));
    });
  }

  function handleSearch(value: string) {
    setQuery(value);
    navigate({ q: value });
  }

  function clearDropdownFilters() {
    navigate({
      categoryId: "all",
      type: "all",
      facultyId: "all",
      subjectId: "all",
      sort: DEFAULT_COURSE_SORT,
    });
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = tabsRef.current;
    if (!el || !overflowing) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = tabsRef.current;
    if (!el || !dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) dragRef.current.moved = true;
    el.scrollLeft = dragRef.current.scrollLeft - dx;
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const el = tabsRef.current;
    dragRef.current.active = false;
    el?.releasePointerCapture(e.pointerId);
  }

  const tabOptions = [
    { value: "all", label: "All" },
    ...subCategoryOptions,
  ];
  const showTabs = subCategoryOptions.length > 0;

  const activeFilterCount = [
    activeCategoryId && activeCategoryId !== "all",
    // graphyCategory / Type temporarily hidden from UI — do not count
    activeFacultyId && activeFacultyId !== "all",
    activeSubjectId && activeSubjectId !== "all",
    activeSort && activeSort !== DEFAULT_COURSE_SORT,
  ].filter(Boolean).length;

  const filterDropdowns = (
    <>
      <DropdownSelect
        value={activeCategoryId || "all"}
        onChange={(value) =>
          navigate({
            categoryId: value,
            type: "all",
            subCategory1: "all",
            facultyId: "all",
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
      {/* Temporarily disabled: graphyCategory (Type) filter UI — keep API/nav support */}
      {false ? (
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
      <DropdownSelect
        value={activeFacultyId || "all"}
        onChange={(value) => navigate({ facultyId: value })}
        options={[
          { value: "all", label: "All Faculty" },
          ...facultyOptions,
        ]}
        aria-label="Faculty"
        className="w-full min-w-0 md:w-auto md:min-w-[10rem]"
        variant="light"
      />
      <DropdownSelect
        value={activeSubjectId || "all"}
        onChange={(value) => navigate({ subjectId: value })}
        options={[
          { value: "all", label: "All Subjects" },
          ...subjectOptions,
        ]}
        aria-label="Subject"
        className="w-full min-w-0 md:w-auto md:min-w-[10rem]"
        variant="light"
      />
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
    <div className="relative z-30 mt-5 flex flex-col gap-4 overflow-visible rounded-md border border-[#fee8dd] bg-white p-4 shadow-sm shadow-[#fee8dd] sm:p-6 lg:mt-0 lg:-translate-y-1/2">
      {showTabs ? (
        <div
          ref={tabsRef}
          className={cn(
            "min-w-0 flex max-w-full gap-2 overflow-x-auto scrollbar-hide pb-1",
            overflowing && "cursor-grab active:cursor-grabbing"
          )}
          role="tablist"
          aria-label={tabsAriaLabel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={(e) => {
            if (!dragRef.current.moved) return;
            e.preventDefault();
            e.stopPropagation();
            dragRef.current.moved = false;
          }}
        >
          {tabOptions.map((tab) => {
            const isActive = activeSubCategory1 === tab.value;
            return (
              <Link
                key={tab.value}
                href={hrefFor({ subCategory1: tab.value })}
                role="tab"
                aria-selected={isActive}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-body-sm font-medium transition-colors whitespace-nowrap border",
                  isActive
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-neutral-600 border-section-beige hover:text-neutral-900 hover:border-orange-300"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        {/* Desktop / tablet: inline filter dropdowns */}
        <div className="relative hidden min-w-0 flex-1 flex-wrap items-center gap-3 md:flex">
          {filterDropdowns}
        </div>

        {/* Mobile: filter button + search (search stays outside sheet) */}
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
              placeholder={searchPlaceholder}
              aria-label={searchAriaLabel}
              variant="light"
            />
          </div>
        </div>

        {/* Desktop search */}
        <div className="hidden w-full shrink-0 md:block md:w-64 lg:w-72">
          <SearchInput
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onClear={() => handleSearch("")}
            placeholder={searchPlaceholder}
            aria-label={searchAriaLabel}
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
          <div className="sticky bottom-0 flex gap-3 border-t border-neutral-100 bg-white pt-4 pb-1">
            <button
              type="button"
              onClick={() => {
                clearDropdownFilters();
              }}
              className="h-11 flex-1 rounded-[6px] border border-neutral-200 bg-white text-body-sm font-medium text-neutral-700 transition-colors hover:border-orange-300 hover:text-orange-600"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setFilterSheetOpen(false)}
              className="btn-primary h-11 flex-1 rounded-[6px] text-body-sm"
            >
              Apply
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

function LegacyCatalogToolbar({
  basePath,
  activeCategory,
  categoryOptions = [],
  initialQuery,
  activeType,
  courseTypeOptions = [],
  activePrice,
  showCourseType = true,
  showPrice = true,
  searchPlaceholder,
  searchAriaLabel,
  categoryAriaLabel,
}: CatalogToolbarLegacyProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    scrollLeft: number;
    moved: boolean;
  }>({ active: false, startX: 0, scrollLeft: 0, moved: false });

  const measureOverflow = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    setOverflowing(el.scrollWidth > el.clientWidth + 2);
  }, []);

  useEffect(() => {
    measureOverflow();
    const el = tabsRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measureOverflow());
    ro.observe(el);
    window.addEventListener("resize", measureOverflow);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureOverflow);
    };
  }, [measureOverflow, categoryOptions.length]);

  function hrefFor(next: {
    category?: string;
    q?: string;
    type?: string;
    price?: string;
  } = {}): string {
    const params = new URLSearchParams();
    const category = next.category ?? activeCategory;
    const search = next.q !== undefined ? next.q : query;
    const type = next.type ?? activeType;
    const price = next.price ?? activePrice;

    if (category && category !== "all") {
      params.set("category", category);
    }
    const trimmedSearch = search.trim();
    if (trimmedSearch) {
      params.set("q", trimmedSearch);
    }
    if (type && type !== "all") {
      params.set("type", type);
    }
    if (price && price !== "all") {
      params.set("price", price);
    }

    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function navigate(next?: {
    category?: string;
    q?: string;
    type?: string;
    price?: string;
  }) {
    startTransition(() => {
      router.push(hrefFor(next));
    });
  }

  function handleSearch(value: string) {
    setQuery(value);
    navigate({ q: value });
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = tabsRef.current;
    if (!el || !overflowing) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = tabsRef.current;
    if (!el || !dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) dragRef.current.moved = true;
    el.scrollLeft = dragRef.current.scrollLeft - dx;
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const el = tabsRef.current;
    dragRef.current.active = false;
    el?.releasePointerCapture(e.pointerId);
  }

  const priceOptions = PRICE_FILTERS.map((filter) => ({
    value: filter.id,
    label: filter.label,
  }));

  const typeDropdownOptions = [
    { value: "all", label: "All Types" },
    ...courseTypeOptions,
  ];

  const showFilterRow = showCourseType || showPrice;
  const activeFilterCount = [
    showPrice && activePrice && activePrice !== "all",
    // Course type UI remains commented out
  ].filter(Boolean).length;

  const filterDropdowns = (
    <>
      {showCourseType && typeDropdownOptions.length > 1 ? (
        // Temporarily disabled alongside packages graphyCategory Type UI
        false ? (
          <DropdownSelect
            value={activeType}
            onChange={(value) => navigate({ type: value })}
            options={typeDropdownOptions}
            aria-label="Course type"
            className="w-full min-w-0 md:w-auto md:min-w-[10rem]"
            variant="light"
          />
        ) : null
      ) : null}
      {showPrice ? (
        <DropdownSelect
          value={activePrice}
          onChange={(value) => navigate({ price: value })}
          options={priceOptions}
          aria-label="Price"
          className="w-full min-w-0 md:w-auto md:min-w-[9rem]"
          variant="light"
        />
      ) : null}
    </>
  );

  return (
    <div className="relative z-30 mt-5 flex flex-col gap-4 overflow-visible rounded-md border border-[#fee8dd] bg-white p-4 shadow-sm shadow-[#fee8dd] sm:p-6 lg:mt-0 lg:-translate-y-1/2">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
        <div
          ref={tabsRef}
          className={cn(
            "min-w-0 flex-1 flex max-w-full gap-2 overflow-x-auto scrollbar-hide pb-1",
            overflowing && "cursor-grab active:cursor-grabbing"
          )}
          role="tablist"
          aria-label={categoryAriaLabel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={(e) => {
            if (!dragRef.current.moved) return;
            e.preventDefault();
            e.stopPropagation();
            dragRef.current.moved = false;
          }}
        >
          <Link
            href={hrefFor({ category: "all", q: "" })}
            role="tab"
            aria-selected={activeCategory === "all"}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-body-sm font-medium transition-colors whitespace-nowrap border",
              activeCategory === "all"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-neutral-600 border-section-beige hover:text-neutral-900 hover:border-orange-300"
            )}
          >
            All
          </Link>

          {categoryOptions.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <Link
                key={cat.value}
                href={hrefFor({ category: cat.value, q: "" })}
                role="tab"
                aria-selected={isActive}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-body-sm font-medium transition-colors whitespace-nowrap border",
                  isActive
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-neutral-600 border-section-beige hover:text-neutral-900 hover:border-orange-300"
                )}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        <div className="flex min-w-0 items-center gap-3 md:contents">
          {showFilterRow ? (
            <div className="md:hidden">
              <FilterIconButton
                onClick={() => setFilterSheetOpen(true)}
                activeCount={activeFilterCount}
              />
            </div>
          ) : null}
          <div className="min-w-0 flex-1 md:w-64 md:flex-none lg:w-72">
            <SearchInput
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onClear={() => handleSearch("")}
              placeholder={searchPlaceholder}
              aria-label={searchAriaLabel}
              variant="light"
            />
          </div>
        </div>
      </div>

      {showFilterRow ? (
        <>
          <div className="relative hidden flex-wrap items-center gap-3 md:flex">
            {filterDropdowns}
          </div>

          <BottomSheet
            open={filterSheetOpen}
            onClose={() => setFilterSheetOpen(false)}
            title="Filters"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">{filterDropdowns}</div>
              <div className="sticky bottom-0 flex gap-3 border-t border-neutral-100 bg-white pt-4 pb-1">
                <button
                  type="button"
                  onClick={() => navigate({ price: "all", type: "all" })}
                  className="h-11 flex-1 rounded-[6px] border border-neutral-200 bg-white text-body-sm font-medium text-neutral-700 transition-colors hover:border-orange-300 hover:text-orange-600"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setFilterSheetOpen(false)}
                  className="btn-primary h-11 flex-1 rounded-[6px] text-body-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </BottomSheet>
        </>
      ) : null}
    </div>
  );
}

export function CatalogToolbar(props: CatalogToolbarProps) {
  if (props.variant === "packages") {
    return <PackagesCatalogToolbar {...props} />;
  }
  return <LegacyCatalogToolbar {...props} />;
}
