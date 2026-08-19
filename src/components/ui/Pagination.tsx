"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationBaseProps {
  currentPage: number;
  totalPages: number;
  className?: string;
  variant?: "dark" | "light";
}

interface CallbackPaginationProps extends PaginationBaseProps {
  onPageChange: (page: number) => void;
  basePath?: never;
  query?: never;
}

interface UrlPaginationProps extends PaginationBaseProps {
  onPageChange?: never;
  basePath: string;
  query?: Record<string, string>;
}

type PaginationProps = CallbackPaginationProps | UrlPaginationProps;

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  basePath,
  query,
  variant = "dark",
  className,
}: PaginationProps) {
  const pages = generatePageNumbers(currentPage, totalPages);
  const isLight = variant === "light";

  function buildHref(page: number) {
    if (!basePath) return "#";
    const params = new URLSearchParams(query ?? {});
    if (page > 1) params.set("page", String(page));
    else params.delete("page");
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const arrowBase = cn(
    "h-9 w-9 flex items-center justify-center rounded transition-colors",
    isLight
      ? "text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
      : "text-text-muted hover:text-text-primary hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed"
  );

  const pageBase = (active: boolean) =>
    cn(
      "h-9 w-9 flex items-center justify-center rounded text-body-sm font-medium transition-colors",
      active
        ? "bg-orange-500 text-white"
        : isLight
          ? "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
          : "text-text-muted hover:text-text-primary hover:bg-bg-hover"
    );

  const ellipsisClass = cn(
    "h-9 w-9 flex items-center justify-center",
    isLight ? "text-neutral-400" : "text-text-dimmed"
  );

  const PrevArrow = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
  const NextArrow = (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );

  if (basePath) {
    return (
      <nav className={cn("flex items-center justify-center gap-1", className)} aria-label="Pagination">
        {currentPage <= 1 ? (
          <span className={cn(arrowBase, "opacity-30 cursor-not-allowed")} aria-hidden>{PrevArrow}</span>
        ) : (
          <Link href={buildHref(currentPage - 1)} className={arrowBase} aria-label="Previous page">{PrevArrow}</Link>
        )}

        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`ellipsis-${i}`} className={ellipsisClass}>...</span>
          ) : (
            <Link
              key={page}
              href={buildHref(page as number)}
              className={pageBase(page === currentPage)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Link>
          )
        )}

        {currentPage >= totalPages ? (
          <span className={cn(arrowBase, "opacity-30 cursor-not-allowed")} aria-hidden>{NextArrow}</span>
        ) : (
          <Link href={buildHref(currentPage + 1)} className={arrowBase} aria-label="Next page">{NextArrow}</Link>
        )}
      </nav>
    );
  }

  return (
    <nav className={cn("flex items-center justify-center gap-1", className)} aria-label="Pagination">
      <button
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
        className={arrowBase}
        aria-label="Previous page"
      >
        {PrevArrow}
      </button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className={ellipsisClass}>...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange?.(page as number)}
            className={pageBase(page === currentPage)}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={arrowBase}
        aria-label="Next page"
      >
        {NextArrow}
      </button>
    </nav>
  );
}

function generatePageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 3) return [1, 2, 3, 4, "...", total];
  if (current >= total - 2) return [1, "...", total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}
