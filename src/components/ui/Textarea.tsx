"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixIcon?: React.ReactNode;
  /** Default stays dark for existing forms. */
  variant?: "dark" | "light";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, prefixIcon, variant = "dark", ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const isLight = variant === "light";

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "block text-body-sm font-medium mb-1.5",
              isLight ? "text-neutral-700" : "text-text-secondary"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefixIcon && (
            <span
              className={cn(
                "absolute left-3 top-3",
                isLight ? "text-neutral-400" : "text-text-dimmed"
              )}
            >
              {prefixIcon}
            </span>
          )}
          <textarea
            ref={ref}
            id={textareaId}
            className={cn(
              "input-base min-h-[120px] resize-y",
              isLight &&
                "bg-white text-neutral-900 border-neutral-200 placeholder:text-neutral-400",
              prefixIcon && "pl-11",
              error && "border-accent-red focus:border-accent-red",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-caption text-accent-red">{error}</p>}
        {helperText && !error && <p className="mt-1 text-caption text-accent-red">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
