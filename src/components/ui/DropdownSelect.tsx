"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface DropdownSelectOption {
  value: string;
  label: string;
}

interface DropdownSelectProps {
  options: DropdownSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  "aria-label"?: string;
  className?: string;
  triggerClassName?: string;
  prefixIcon?: React.ReactNode;
  /** Default stays dark for counselling and existing filters. */
  variant?: "dark" | "light";
}

export function DropdownSelect({
  options,
  value,
  onChange,
  placeholder = "Select",
  label,
  "aria-label": ariaLabel,
  className,
  triggerClassName,
  prefixIcon,
  variant = "dark",
}: DropdownSelectProps) {
  const resolvedAriaLabel = ariaLabel ?? label;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);
  const displayLabel = selected?.label ?? placeholder;
  const isLight = variant === "light";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {label && (
        <label
          className={cn(
            "block text-body-sm font-medium mb-1.5",
            isLight ? "text-neutral-700" : "text-text-secondary"
          )}
        >
          {label}
        </label>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={resolvedAriaLabel}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between gap-2 h-9 w-full min-w-[140px] px-3 text-body-sm font-medium border rounded-[6px] transition-colors whitespace-nowrap",
          isLight
            ? "bg-white text-neutral-900 border-neutral-200 hover:border-orange-500/60"
            : "bg-bg-tertiary text-text-primary border-white/30 hover:border-orange-500/60 hover:text-orange-400",
          triggerClassName
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {prefixIcon && (
            <span className={cn("shrink-0 translate-y-[2px]", isLight ? "text-neutral-400" : "text-text-dimmed")}>
              {prefixIcon}
            </span>
          )}
          <span className="truncate">{displayLabel}</span>
        </span>
        <svg
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform",
            isLight ? "text-neutral-500" : "text-text-secondary",
            open && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={resolvedAriaLabel}
          className={cn(
            "absolute top-full left-0 right-0 mt-2 min-w-full max-h-60 overflow-y-auto z-[100] animate-[dropdown-in_180ms_var(--ease-premium)]",
            isLight
              ? "rounded-[6px] bg-white border border-neutral-200 shadow-lg py-1"
              : "dropdown-menu"
          )}
        >
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <button
                key={option.value || "__all__"}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  isLight
                    ? cn(
                        "block w-full text-left px-4 py-2.5 text-body-sm text-neutral-700 transition-colors cursor-pointer",
                        "hover:bg-orange-500/10 hover:text-orange-600",
                        isActive && "bg-orange-500/10 text-orange-600 font-medium"
                      )
                    : cn(
                        "dropdown-option hover:bg-orange-500/12 hover:text-orange-400",
                        isActive && "dropdown-option--active"
                      )
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
