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
}

export function BlogToolbar({
  activeCategory,
  initialQuery,
}: BlogToolbarProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);

  const categories = useAtomValue(categoriesAtom);

  function handleSearch(value: string) {
    setQuery(value);

    startTransition(() => {
      const params = new URLSearchParams();

      if (activeCategory && activeCategory !== "all") {
        params.set("category", activeCategory);
      }

      const trimmedValue = value.trim();

      if (trimmedValue) {
        params.set("q", trimmedValue);
      }

      const qs = params.toString();

      router.push(qs ? `/blog?${qs}` : "/blog");
    });
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border border-[#fee8dd] rounded-md p-6 bg-white shadow-sm -translate-y-1/2 shadow-[#fee8dd]">
      <div
        className="flex max-w-full gap-2 overflow-x-auto scrollbar-hide pb-1"
        role="tablist"
        aria-label="Blog categories"
      >
        {/* All category */}
        <Link
          href="/blog"
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

          const href = `/blog?category=${encodeURIComponent(categorySlug)}`;

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
          placeholder="Search blogs..."
          aria-label="Search blog articles"
          variant="light"
        />
      </div>
    </div>
  );
}