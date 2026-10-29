"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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

      router.push(listingHref(basePath, params));
    });
  }

  return (
    <div className="mt-5 flex flex-col gap-4 rounded-md border border-[#fee8dd] bg-white p-6 shadow-sm shadow-[#fee8dd] md:flex-row md:items-center md:justify-between lg:mt-0 lg:-translate-y-1/2">
      <div
        className="flex max-w-full gap-2 overflow-x-auto scrollbar-hide pb-1"
        role="tablist"
        aria-label={tablistLabel}
      >
        {/* All category */}
        <Link
          href={listingHref(basePath, withExtraParams(extraParams))}
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