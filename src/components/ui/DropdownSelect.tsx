"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
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
  error?: string;
  "aria-label"?: string;

  className?: string;
  triggerClassName?: string;
  prefixIcon?: ReactNode;

  /**
   * Trigger width:
   * - "auto": content/intrinsic width with minimum width
   * - "full": fills parent width
   * - number: explicit width in px
   */
  triggerWidth?: "auto" | "full" | number;

  /**
   * Minimum trigger width in px.
   * Defaults to 140px.
   */
  triggerMinWidth?: number;

  /**
   * Maximum trigger width in px.
   */
  triggerMaxWidth?: number;

  /**
   * Portal/menu width:
   * - "trigger": exactly matches trigger width
   * - "content": expands to fit option content
   * - number: explicit width in px
   */
  menuWidth?: "trigger" | "content" | number;

  /**
   * Maximum portal/menu width in px.
   * Viewport width is always respected.
   */
  menuMaxWidth?: number;

  variant?: "dark" | "light" | "account";
}

export function DropdownSelect({
  options,
  value,
  onChange,
  placeholder = "Select",
  label,
  error,
  "aria-label": ariaLabel,
  className,
  triggerClassName,
  prefixIcon,

  triggerWidth = "auto",
  triggerMinWidth = 140,
  triggerMaxWidth,

  menuWidth = "trigger",
  menuMaxWidth,

  variant = "dark",
}: DropdownSelectProps) {
  const resolvedAriaLabel = ariaLabel ?? label;

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selected = options.find((option) => option.value === value);
  const displayLabel = selected?.label ?? placeholder;

  const isLight = variant === "light";
  const isAccount = variant === "account";

  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Calculate portal position and width only.
   *
   * The menu is position: fixed and rendered through a portal,
   * so its width never participates in the trigger/filter layout.
   */
  const updateCoords = () => {
    const trigger = triggerRef.current;

    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();

    const viewportPadding = 8;
    const viewportWidth = window.innerWidth;

    const triggerActualWidth = rect.width;

    let width: number;

    if (typeof menuWidth === "number") {
      // Explicit menu width.
      width = Math.max(menuWidth, triggerActualWidth);
    } else if (menuWidth === "content") {
      /**
       * Estimate the width required by the longest option.
       *
       * Padding + approximate character width keeps this lightweight
       * and avoids measuring hidden DOM elements.
       */
      const longestLabelLength = options.reduce(
        (max, option) => Math.max(max, option.label.length),
        0
      );

      const estimatedContentWidth =
        longestLabelLength * 8 + 48;

      width = Math.max(
        triggerActualWidth,
        estimatedContentWidth
      );
    } else {
      // Default: menu exactly matches trigger.
      width = triggerActualWidth;
    }

    if (menuMaxWidth !== undefined) {
      width = Math.min(width, menuMaxWidth);
    }

    // Never exceed viewport.
    width = Math.min(
      width,
      viewportWidth - viewportPadding * 2
    );

    /**
     * If the menu is wider than the trigger, keep it inside
     * the viewport without affecting surrounding layout.
     */
    let left = rect.left;

    if (
      left + width >
      viewportWidth - viewportPadding
    ) {
      left =
        viewportWidth -
        viewportPadding -
        width;
    }

    if (left < viewportPadding) {
      left = viewportPadding;
    }

    setCoords({
      top: rect.bottom + 8,
      left,
      width,
    });
  };

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }

    updateCoords();

    const handleReposition = () => {
      updateCoords();
    };

    window.addEventListener(
      "resize",
      handleReposition
    );

    window.addEventListener(
      "scroll",
      handleReposition,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleReposition
      );

      window.removeEventListener(
        "scroll",
        handleReposition,
        true
      );
    };
  }, [
    open,
    options,
    menuWidth,
    menuMaxWidth,
  ]);

  useEffect(() => {
    if (!open) return;

    function handlePointer(event: MouseEvent) {
      const target = event.target as Node;

      if (rootRef.current?.contains(target)) {
        return;
      }

      if (menuRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handlePointer
    );

    document.addEventListener(
      "keydown",
      handleKey
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointer
      );

      document.removeEventListener(
        "keydown",
        handleKey
      );
    };
  }, [open]);

  const portalParent =
    typeof document !== "undefined"
      ? isAccount
        ? (document.querySelector(
            ".account-shell"
          ) as HTMLElement | null) ??
          document.body
        : document.body
      : null;

  const menu =
    mounted &&
    open &&
    coords &&
    portalParent &&
    createPortal(
      <div
        ref={menuRef}
        role="listbox"
        aria-label={resolvedAriaLabel}
        style={{
          position: "fixed",
          top: coords.top,
          left: coords.left,
          width: coords.width,
          maxWidth: "calc(100vw - 16px)",
        }}
        className={cn(
          "z-[110] min-w-0 max-h-60 overflow-y-auto overflow-x-hidden animate-[dropdown-in_180ms_var(--ease-premium)]",
          isAccount
            ? "rounded-[6px] border border-[var(--account-border)] bg-[var(--account-surface)] py-1 shadow-[var(--account-shadow)]"
            : isLight
              ? "rounded-[6px] border border-neutral-200 bg-white py-1 shadow-lg"
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
                /**
                 * IMPORTANT:
                 * Do not use whitespace-nowrap here.
                 * Long options must wrap inside the wider menu
                 * instead of creating horizontal scrolling.
                 */
                "block w-full min-w-0 whitespace-normal break-words text-left",

                isAccount
                  ? cn(
                      "cursor-pointer px-4 py-2.5 text-body-sm text-[var(--account-text-secondary)] transition-colors",
                      "hover:bg-[var(--account-nav-active-bg)] hover:text-[var(--account-accent)]",
                      isActive &&
                        "bg-[var(--account-nav-active-bg)] font-medium text-[var(--account-accent)]"
                    )
                  : isLight
                    ? cn(
                        "cursor-pointer px-4 py-2.5 text-body-sm text-neutral-700 transition-colors",
                        "hover:bg-orange-500/10 hover:text-orange-600",
                        isActive &&
                          "bg-orange-500/10 font-medium text-orange-600"
                      )
                    : cn(
                        "dropdown-option hover:bg-orange-500/12 hover:text-orange-400",
                        isActive &&
                          "dropdown-option--active"
                      )
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>,
      portalParent
    );

  const triggerStyle: CSSProperties = {
    ...(typeof triggerWidth === "number"
      ? {
          width: `${triggerWidth}px`,
        }
      : {}),

    ...(triggerMinWidth !== undefined
      ? {
          minWidth: `${triggerMinWidth}px`,
        }
      : {}),

    ...(triggerMaxWidth !== undefined
      ? {
          maxWidth: `${triggerMaxWidth}px`,
        }
      : {}),
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative min-w-0 shrink-0",
        triggerWidth === "full"
          ? "w-full"
          : "w-fit max-w-full",
        className
      )}
    >
      {label && (
        <label
          className={cn(
            "mb-1.5 block text-body-sm font-medium",
            isAccount
              ? "text-[var(--account-text-secondary)]"
              : isLight
                ? "text-neutral-700"
                : "text-text-secondary"
          )}
        >
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={resolvedAriaLabel}
        aria-invalid={Boolean(error)}
        onClick={() =>
          setOpen((current) => !current)
        }
        style={triggerStyle}
        className={cn(
          "flex h-9 items-center justify-between gap-2 whitespace-nowrap rounded-[6px] border px-3 text-body-sm font-medium transition-colors",
          triggerWidth === "full"
            ? "w-full"
            : "w-auto max-w-full",

          isAccount
            ? "border-[var(--account-input-border)] bg-[var(--account-input-bg)] text-[var(--account-text)] hover:border-[var(--account-accent)]/60"
            : isLight
              ? "border-neutral-200 bg-white text-neutral-900 hover:border-orange-500/60"
              : "border-white/30 bg-bg-tertiary text-text-primary hover:border-orange-500/60 hover:text-orange-400",

          triggerClassName,
          error &&
            "border-accent-red hover:border-accent-red"
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {prefixIcon && (
            <span
              className={cn(
                "shrink-0 translate-y-[2px]",
                isAccount
                  ? "text-[var(--account-text-muted)]"
                  : isLight
                    ? "text-neutral-400"
                    : "text-text-dimmed"
              )}
            >
              {prefixIcon}
            </span>
          )}

          <span className="min-w-0 truncate whitespace-nowrap">
            {displayLabel}
          </span>
        </span>

        <svg
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform",
            isAccount
              ? "text-[var(--account-text-muted)]"
              : isLight
                ? "text-neutral-500"
                : "text-text-secondary",
            open && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {menu}

      {error && (
        <p className="mt-1 text-caption text-accent-red">
          {error}
        </p>
      )}
    </div>
  );
}