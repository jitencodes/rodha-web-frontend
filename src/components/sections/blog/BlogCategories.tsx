import Link from "next/link";
import { cn } from "@/lib/utils";
import { BLOG_CATEGORIES } from "@/data/blog";

interface BlogCategoriesProps {
  activeCategory?: string;
  className?: string;
}

export function BlogCategories({ activeCategory, className }: BlogCategoriesProps) {
  const categories = BLOG_CATEGORIES.filter((c) => c.id !== "all");

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-h4 font-semibold text-neutral-900">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.id}`}
              className={cn(
                "inline-flex items-center px-3 py-1.5 text-body-sm rounded-full border transition-colors font-medium",
                isActive
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-neutral-600 border-section-beige hover:border-orange-300 hover:text-orange-600"
              )}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
