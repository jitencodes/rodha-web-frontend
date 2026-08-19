"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  value?: string;
  variant?: "dark" | "light";
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, variant = "dark", ...props }, ref) => {
    const isLight = variant === "light";
    return (
      <div className="relative">
        <svg
          className={cn(
            "absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4",
            isLight ? "text-neutral-400" : "text-text-dimmed"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            "input-base pl-11 pr-10",
            isLight && "!bg-white text-neutral-600 !border-[#fee8dd] hover:text-neutral-900 hover:!border-orange-300",
            className
          )}
          {...props}
        />
        {value && onClear && (
          <button
            onClick={onClear}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
              isLight
                ? "text-neutral-400 hover:text-neutral-700"
                : "text-text-dimmed hover:text-text-primary"
            )}
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
