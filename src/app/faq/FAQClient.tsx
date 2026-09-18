"use client";

import { useAtomValue } from "jotai";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AccordionV2 } from "@/components/ui/AccordionV2";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { cn } from "@/lib/utils";
import { categoriesAtom } from "@/lib/store/categories";

import type { FaqListViewModel } from "@/lib/api/modules/faqs/types";

interface FAQClientProps {
  data: FaqListViewModel | null;
  search: string;
  category: string;
  page: number;
}

const GENERAL_CATEGORY = "general";
const SEARCH_DEBOUNCE_MS = 500;

export function FAQClient({
  data,
  search,
  category,
  page,
}: FAQClientProps) {
  const categories = useAtomValue(categoriesAtom);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state controls the input while typing.
  const [searchValue, setSearchValue] = useState(search);

  // Keeps track of the last search value that we intentionally
  // pushed to the URL.
  const committedSearchRef = useRef(search);

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  const total = pagination?.total ?? 0;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const safePage = Math.min(page, totalPages);

  const activeCategory = category || "all";

  function updateFilters({
    search: nextSearch,
    category: nextCategory = activeCategory,
    page: nextPage = 1,
  }: {
    search?: string;
    category?: string;
    page?: number;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    const normalizedSearch = nextSearch?.trim() ?? "";

    if (normalizedSearch) {
      params.set("search", normalizedSearch);
    } else {
      params.delete("search");
    }

    if (nextCategory && nextCategory !== "all") {
      params.set("category", nextCategory);
    } else {
      params.delete("category");
    }

    if (nextPage > 1) {
      params.set("page", String(nextPage));
    } else {
      params.delete("page");
    }

    const query = params.toString();

    router.push(
      query ? `${pathname}?${query}` : pathname,
      { scroll: false }
    );
  }

  function handleCategoryChange(nextCategory: string) {
    // Category changes always clear the search.
    setSearchValue("");
    committedSearchRef.current = "";

    updateFilters({
      search: "",
      category: nextCategory,
      page: 1,
    });
  }

  function handleSearchChange(value: string) {
    // Only update local input state here.
    // Do NOT navigate while the user is typing.
    setSearchValue(value);
  }

  function handleSearchClear() {
    setSearchValue("");
    committedSearchRef.current = "";

    updateFilters({
      search: "",
      category: activeCategory,
      page: 1,
    });
  }

  function handlePageChange(nextPage: number) {
    updateFilters({
      search,
      category: activeCategory,
      page: nextPage,
    });
  }

  /*
   * Debounced server search.
   *
   * The input remains completely local while typing.
   * Only after the user stops typing for 500ms do we update
   * the URL and trigger the server-side FAQ request.
   */
  useEffect(() => {
    const normalizedSearch = searchValue.trim();

    if (normalizedSearch === committedSearchRef.current) {
      return;
    }

    const timer = window.setTimeout(() => {
      committedSearchRef.current = normalizedSearch;

      updateFilters({
        search: normalizedSearch,
        category: activeCategory,
        page: 1,
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchValue]);

  /*
   * Sync local input only when the committed server search
   * changes externally (for example browser back/forward).
   *
   * Do not blindly sync on every render.
   */
  useEffect(() => {
    if (search !== committedSearchRef.current) {
      committedSearchRef.current = search;
      setSearchValue(search);
    }
  }, [search]);

  const activeCategoryLabel =
    activeCategory === "all"
      ? null
      : activeCategory === GENERAL_CATEGORY
        ? "General"
        : categories.find(
            (item) => item.name === activeCategory
          )?.name ?? activeCategory;

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="mx-auto max-w-2xl">
        <SearchInput
          value={searchValue}
          onChange={(e) =>
            handleSearchChange(e.target.value)
          }
          onClear={handleSearchClear}
          placeholder="Search questions..."
          aria-label="Search FAQ questions"
          className="bg-white! text-neutral-900! border-section-beige! placeholder:text-neutral-400!"
        />
      </div>

      <div className="flex justify-center">
        <div
          className="flex max-w-full gap-2 overflow-x-auto scrollbar-hide pb-1"
          role="tablist"
          aria-label="FAQ categories"
        >
          {/* All */}
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === "all"}
            onClick={() => handleCategoryChange("all")}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-body-sm font-medium transition-colors whitespace-nowrap border",
              activeCategory === "all"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-neutral-600 border-section-beige hover:text-neutral-900 hover:border-orange-300"
            )}
          >
            All
          </button>

          {/* General */}
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === GENERAL_CATEGORY}
            onClick={() =>
              handleCategoryChange(GENERAL_CATEGORY)
            }
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-body-sm font-medium transition-colors whitespace-nowrap border",
              activeCategory === GENERAL_CATEGORY
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-neutral-600 border-section-beige hover:text-neutral-900 hover:border-orange-300"
            )}
          >
            General
          </button>

          {/* API categories */}
          {categories.map((categoryItem) => {
            const categoryName = categoryItem.name;
            const isActive =
              activeCategory === categoryName;

            return (
              <button
                key={categoryItem.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() =>
                  handleCategoryChange(categoryName)
                }
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-body-sm font-medium transition-colors whitespace-nowrap border",
                  isActive
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-neutral-600 border-section-beige hover:text-neutral-900 hover:border-orange-300"
                )}
              >
                {categoryItem.name}
              </button>
            );
          })}
        </div>
      </div>

      <p className="home-light-muted text-center text-body-sm">
        Showing {items.length} of {total} question
        {total === 1 ? "" : "s"}
        {activeCategoryLabel &&
          ` in ${activeCategoryLabel}`}
      </p>

      {items.length > 0 ? (
        <AccordionV2
          key={`${activeCategory}-${safePage}-${search}`}
          items={items.map(
            ({ id, question, answer }) => ({
              id,
              question,
              answer,
            })
          )}
          className="mx-auto max-w-3xl"
        />
      ) : (
        <div className="mx-auto max-w-3xl rounded-[6px] border border-section-beige bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-h4 font-semibold text-neutral-900">
            No FAQs found
          </p>

          <p className="mt-2 text-body text-neutral-500">
            {search
              ? "We couldn't find any FAQs matching your search. Try a different keyword or browse the available categories."
              : activeCategory === GENERAL_CATEGORY
                ? "There are no general FAQs available at the moment. Please explore another category."
                : activeCategory !== "all"
                  ? `There are no FAQs available in ${activeCategoryLabel ?? "this category"} at the moment. Please explore another category.`
                  : "There are no FAQs available at the moment. Please check back soon for helpful answers."}
          </p>

          <button
            type="button"
            onClick={() =>
              handleCategoryChange("all")
            }
            className="btn-secondary btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline mt-5 text-body-sm px-5 py-2.5"
          >
            Clear filters
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="pt-2"
        />
      )}

      <p
        className="sr-only"
        aria-live="polite"
      >
        Page {safePage} of {totalPages}. {total} total FAQ
        items available.
      </p>
    </div>
  );
}