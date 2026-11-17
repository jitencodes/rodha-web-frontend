import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  /** `light` for white / cream surfaces (e.g. Discussion Forum). */
  variant?: "dark" | "light";
}

export function Breadcrumb({ items, className, variant = "dark" }: BreadcrumbProps) {
  const isLight = variant === "light";
  return (
    <nav aria-label="Breadcrumb" className={cn("py-4 md:py-5", className)}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-1.5 text-caption md:text-body-sm",
          isLight ? "text-neutral-500" : "text-text-dimmed"
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={`${item.label}-${index}`}
              className={cn(
                "flex items-center gap-1.5",
                isLast ? "min-w-0" : "shrink-0"
              )}
            >
              {index > 0 && (
                <svg
                  className="h-3 w-3 text-text-dimmed/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors",
                    isLight ? "hover:text-orange-600" : "hover:text-orange-400"
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    isLast &&
                      cn(
                        "min-w-0 break-words font-medium",
                        isLight ? "text-neutral-800" : "text-text-muted"
                      )
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
