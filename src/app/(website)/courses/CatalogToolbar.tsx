"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { SearchInput } from "@/components/ui/SearchInput";
import { PRICE_FILTERS } from "@/lib/course-filters";
import { cn } from "@/lib/utils";

export interface CatalogFilterOption {
  value: string;
  label: string;
}

interface CatalogToolbarProps {
  basePath: string;
  /** Active graphyCategory value (`all` when unset). */
  activeCategory: string;
  categoryOptions?: CatalogFilterOption[];
  initialQuery: string;
  /** Active subCategory1 value (`all` when unset). */
  activeType: string;
  courseTypeOptions?: CatalogFilterOption[];
  activePrice: string;
  showCourseType?: boolean;
  showPrice?: boolean;
  searchPlaceholder: string;
  searchAriaLabel: string;
  categoryAriaLabel: string;
}

export function CatalogToolbar({
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
}: CatalogToolbarProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);

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

  const typeDropdownOptions = [
    { value: "all", label: "All Types" },
    ...courseTypeOptions,
  ];

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

      {(showCourseType || showPrice) && (
        <div className="flex flex-wrap items-center gap-3">
          {showCourseType && typeDropdownOptions.length > 1 ? (
            <DropdownSelect
              value={activeType}
              onChange={(value) => navigate({ type: value })}
              options={typeDropdownOptions}
              aria-label="Course type"
              className="min-w-[10rem]"
              variant="light"
            />
          ) : null}
          {showPrice ? (
            <DropdownSelect
              value={activePrice}
              onChange={(value) => navigate({ price: value })}
              options={priceOptions}
              aria-label="Price"
              className="min-w-[9rem]"
              variant="light"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
