"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useAtomValue } from "jotai";

import { SearchInput } from "@/components/ui/SearchInput";
import { cn } from "@/lib/utils";
import { categoriesAtom } from "@/lib/store/categories";

interface BlogToolbarProps {
  activeCategory: string;
  initialQuery: string;
  basePath?: string;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  tablistLabel?: string;
  /** Extra query params kept when the category or search changes (for example `type`). */
  extraParams?: Record<string, string>;
}

function listingHref(basePath: string, params: URLSearchParams) {
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Gap kept between the sticky site header and the toolbar after scrolling. */
const TOOLBAR_SCROLL_GAP = 16;

/**
 * Next scrolls to the top of the page on every query-string navigation, which
 * jumps users back to the hero. Navigations here opt out (`scroll: false`) and
 * this brings the toolbar back into view only when it has left the viewport
 * (e.g. after paginating from the bottom of the grid).
 */
function scrollToolbarIntoView(toolbar: HTMLElement) {
  const header = document.querySelector<HTMLElement>(".site-header");
  const headerHeight = header?.getBoundingClientRect().height ?? 0;
  const top = toolbar.getBoundingClientRect().top;
  const maxVisibleTop = window.innerHeight - toolbar.offsetHeight;

  if (top >= headerHeight && top <= maxVisibleTop) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({
    top: window.scrollY + top - headerHeight - TOOLBAR_SCROLL_GAP,
    behavior: reduceMotion ? "auto" : "smooth",
  });
}

function withExtraParams(extraParams?: Record<string, string>) {
  const params = new URLSearchParams();
  if (!extraParams) return params;
  for (const [key, value] of Object.entries(extraParams)) {
    if (value) params.set(key, value);
  }
  return params;
}

export function BlogToolbar({
  activeCategory,
  initialQuery,
  basePath = "/blog",
  searchPlaceholder = "Search blogs...",
  searchAriaLabel = "Search blog articles",
  tablistLabel = "Blog categories",
  extraParams,
}: BlogToolbarProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);

  const categories = useAtomValue(categoriesAtom);

  const toolbarRef = useRef<HTMLDivElement>(null);
  const searchParamsKey = useSearchParams().toString();
  const lastParamsKey = useRef(searchParamsKey);

  // Runs once the new listing has rendered for the updated query string.
  useEffect(() => {
    if (lastParamsKey.current === searchParamsKey) return;
    lastParamsKey.current = searchParamsKey;
    if (toolbarRef.current) scrollToolbarIntoView(toolbarRef.current);
  }, [searchParamsKey]);

  function handleSearch(value: string) {
    setQuery(value);

    startTransition(() => {
      const params = withExtraParams(extraParams);

      if (activeCategory && activeCategory !== "all") {
        params.set("category", activeCategory);
      }

      const trimmedValue = value.trim();

      if (trimmedValue) {
        params.set("q", trimmedValue);
      }

      router.push(listingHref(basePath, params), { scroll: false });
    });
  }

  return (
    <div
      ref={toolbarRef}
      className="mt-5 flex flex-col gap-4 rounded-md border border-[#fee8dd] bg-white p-6 shadow-sm shadow-[#fee8dd] md:flex-row md:items-center md:justify-between lg:mt-0 lg:-translate-y-1/2"
    >
      <div
        className="flex max-w-full gap-2 overflow-x-auto scrollbar-hide pb-1"
        role="tablist"
        aria-label={tablistLabel}
      >
        {/* All category */}
        <Link
          href={listingHref(basePath, withExtraParams(extraParams))}
          scroll={false}
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

        {/* API categories */}
        {categories.map((cat) => {
          const categorySlug = cat.slug;
          const isActive = activeCategory === categorySlug;

          const params = withExtraParams(extraParams);
          params.set("category", categorySlug);
          const href = listingHref(basePath, params);

          return (
            <Link
              key={cat.id}
              href={href}
              scroll={false}
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
          placeholder={searchPlaceholder}
          aria-label={searchAriaLabel}
          variant="light"
        />
      </div>
    </div>
  );
}