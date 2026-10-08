"use client";

import Link from "next/link";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import { categoriesAtom } from "@/lib/store/categories";

interface BlogCategoriesProps {
  activeCategory?: string;
  className?: string;
}

/** Category tags from the same header category list (`categoriesAtom`). */
export function BlogCategories({ activeCategory, className }: BlogCategoriesProps) {
  const categories = useAtomValue(categoriesAtom);
  if (categories.length === 0) return null;

  return (
    <div
      className={cn(
        "space-y-3 rounded-xl border border-[#fbdfd1] bg-[#fdf8f5a0] p-5 shadow-sm shadow-[#fbdfd1]/50",
        className
      )}
    >
      <h3 className="text-h4 font-semibold text-neutral-900">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive =
            activeCategory === cat.slug || activeCategory === cat.id;
          return (
            <Link
              key={cat.id}
              href={`/blog?category=${encodeURIComponent(cat.slug)}`}
              className={cn(
                "inline-flex items-center px-3 py-1.5 text-body-sm rounded-full border transition-colors font-medium",
                isActive
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-neutral-600 border-section-beige hover:border-orange-300 hover:text-orange-600"
              )}
            >
              {cat.menuLabel || cat.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
