"use client";

import { Pagination } from "@/components/ui/Pagination";
import { useAccountTheme } from "@/components/account/AccountThemeProvider";

type AccountPaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string>;
  className?: string;
};

/** URL pagination styled for the current account light/dark theme. */
export function AccountPagination({
  currentPage,
  totalPages,
  basePath,
  query,
  className,
}: AccountPaginationProps) {
  const { theme } = useAccountTheme();

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      basePath={basePath}
      query={query}
      variant={theme === "dark" ? "dark" : "light"}
      className={className}
    />
  );
}
