"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useAtomValue } from "jotai";

import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { Icon } from "@/components/ui/Icon";
import { SearchInput } from "@/components/ui/SearchInput";
import { PRICE_FILTERS, type CourseFilterId } from "@/lib/course-filters";
import { categoriesAtom } from "@/lib/store/categories";
import { cn } from "@/lib/utils";

interface CatalogToolbarProps {
  basePath: string;
  activeCategory: string;
  initialQuery: string;
  activeType: string;
  activePrice: string;
  showCourseType?: boolean;
  courseTypeOptions?: Array<{ value: CourseFilterId | string; label: string }>;
  searchPlaceholder: string;
  searchAriaLabel: string;
  categoryAriaLabel: string;
}

export function CatalogToolbar({
  basePath,
  activeCategory,
  initialQuery,
  activeType,
  activePrice,
  showCourseType = false,
  courseTypeOptions = [],
  searchPlaceholder,
  searchAriaLabel,
  categoryAriaLabel,
}: CatalogToolbarProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);
  const categories = useAtomValue(categoriesAtom);

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

  const priceOptions = PRICE_FILTERS.map((filter) => ({
    value: filter.id,
    label: filter.label,
  }));

  return (
    <div className="flex flex-col gap-4 border border-[#fee8dd] rounded-md p-6 bg-white shadow-sm -translate-y-1/2 shadow-[#fee8dd]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div
          className="flex max-w-full gap-2 overflow-x-auto scrollbar-hide pb-1"
          role="tablist"
          aria-label={categoryAriaLabel}
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

          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <Link
                key={cat.id}
                href={hrefFor({ category: cat.slug, q: "" })}
                role="tab"
                aria-selected={isActive}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-body-sm font-medium transition-colors whitespace-nowrap border",
                  isActive
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-neutral-600 border-section-beige hover:text-neutral-900 hover:border-orange-300"
                )}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>

        <div className="w-full md:w-64 lg:w-72">
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

      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
        {showCourseType && courseTypeOptions.length > 1 ? (
          <DropdownSelect
            options={courseTypeOptions}
            value={activeType}
            onChange={(type) => navigate({ type })}
            placeholder="All Types"
            aria-label="Filter by course type"
            variant="light"
            className="w-full sm:w-auto sm:min-w-[180px]"
            prefixIcon={
              <Icon src="/assets/icons/book.svg" size={16} alt="" />
            }
          />
        ) : null}

        <DropdownSelect
          options={priceOptions}
          value={activePrice}
          onChange={(price) => navigate({ price })}
          placeholder="All Prices"
          aria-label="Filter by price"
          variant="light"
          className="w-full sm:w-auto sm:min-w-[160px]"
          prefixIcon={
            <Icon src="/assets/icons/practice.svg" size={16} alt="" />
          }
        />
      </div>
    </div>
  );
}
