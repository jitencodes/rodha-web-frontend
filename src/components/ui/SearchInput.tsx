"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  variant?: "dark" | "light";
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, variant = "dark", onClear, ...props }, ref) => {
    const isLight = variant === "light";
    const showClear = Boolean(onClear && value);

    return (
      <div className="relative">
        {showClear ? (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className={cn(
              "absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4",
              isLight ? "text-neutral-400 hover:text-neutral-700" : "text-text-dimmed hover:text-text-secondary"
            )}
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : null}
        <svg
          className={cn(
            "absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none",
            isLight ? "text-neutral-400" : "text-text-dimmed"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            "input-base pl-11 pr-10",
            "[&::-webkit-search-cancel-button]:appearance-none",
            "[&::-webkit-search-decoration]:appearance-none",
            "caret-neutral-900",
            isLight && [
              "!bg-white",
              "!text-neutral-900",
              "!caret-neutral-900",
              "!border-[#fee8dd]",
              "placeholder:!text-neutral-400",
              "hover:!text-neutral-900",
              "focus:!text-neutral-900",
              "hover:!border-orange-300",
              "focus:!border-orange-300",
            ],
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
