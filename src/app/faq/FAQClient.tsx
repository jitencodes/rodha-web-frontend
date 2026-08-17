"use client";

import { useMemo, useState } from "react";
import { AccordionV2 } from "@/components/ui/AccordionV2";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { cn } from "@/lib/utils";
import {
  FAQ_CATEGORIES,
  FAQ_DATA,
  FAQ_ITEMS_PER_PAGE,
  getFaqsByCategory,
  searchFaqs,
} from "@/data/faq";

export function FAQClient() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const byCategory = getFaqsByCategory(activeCategory);
    return searchFaqs(byCategory, query);
  }, [activeCategory, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / FAQ_ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * FAQ_ITEMS_PER_PAGE;
    return filtered.slice(start, start + FAQ_ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  function handleCategoryChange(categoryId: string) {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  }

  function handleSearchChange(value: string) {
    setQuery(value);
    setCurrentPage(1);
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="mx-auto max-w-2xl">
        <SearchInput
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          onClear={() => handleSearchChange("")}
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
          {FAQ_CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-body-sm font-medium transition-colors whitespace-nowrap border",
                  isActive
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-neutral-600 border-section-beige hover:text-neutral-900 hover:border-orange-300"
                )}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="home-light-muted text-center text-body-sm">
        Showing {pageItems.length} of {filtered.length} question
        {filtered.length === 1 ? "" : "s"}
        {activeCategory !== "all" &&
          ` in ${FAQ_CATEGORIES.find((c) => c.id === activeCategory)?.label ?? activeCategory}`}
      </p>

      {pageItems.length > 0 ? (
        <AccordionV2
          key={`${activeCategory}-${safePage}-${query}`}
          items={pageItems.map(({ id, question, answer }) => ({
            id,
            question,
            answer,
          }))}
          className="mx-auto max-w-3xl"
        />
      ) : (
        <div className="mx-auto max-w-3xl rounded-[6px] border border-section-beige bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-h4 font-semibold text-neutral-900">No results found</p>
          <p className="mt-2 text-body text-neutral-500">
            Try a different keyword or browse another category.
          </p>
          <button
            type="button"
            onClick={() => {
              handleSearchChange("");
              handleCategoryChange("all");
            }}
            className="btn-secondary btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline mt-5 text-body-sm px-5 py-2.5"
          >
            Clear filters
          </button>
        </div>
      )}

      {filtered.length > FAQ_ITEMS_PER_PAGE && (
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="pt-2"
        />
      )}

      <p className="sr-only" aria-live="polite">
        Page {safePage} of {totalPages}. {FAQ_DATA.length} total FAQ items available.
      </p>
    </div>
  );
}
