"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { getAccountPortalParent } from "@/lib/account/portal-parent";
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

  /**
   * Shows a filter input at the top of the open menu (long lists such as
   * states). Typing narrows options; ↑/↓ + Enter select.
   */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Shown when the filter matches nothing. */
  emptySearchLabel?: string;
}

function normaliseSearch(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
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
  searchable = false,
  searchPlaceholder = "Type to search…",
  emptySearchLabel = "No matches found",
}: DropdownSelectProps) {
  const resolvedAriaLabel = ariaLabel ?? label;

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = `${useId()}-listbox`;

  // Focus the filter as soon as the searchable menu is positioned.
  useEffect(() => {
    if (!open || !searchable) return;
    const frame = window.requestAnimationFrame(() => {
      searchRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, searchable]);

  const normalisedQuery = searchable ? normaliseSearch(query) : "";
  const visibleOptions = normalisedQuery
    ? (() => {
        const matches = options.filter((option) =>
          normaliseSearch(option.label).includes(normalisedQuery)
        );
        // Prefix matches first ("ma" → Maharashtra before Himachal).
        return [
          ...matches.filter((option) =>
            normaliseSearch(option.label).startsWith(normalisedQuery)
          ),
          ...matches.filter(
            (option) =>
              !normaliseSearch(option.label).startsWith(normalisedQuery)
          ),
        ];
      })()
    : options;

  const closeMenu = () => {
    setOpen(false);
    setQuery("");
    setHighlightIndex(0);
  };

  const selectOption = (next: string) => {
    onChange(next);
    closeMenu();
    triggerRef.current?.focus();
  };

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
      // Explicit menu width, but never smaller than the trigger.
      width = Math.max(menuWidth, triggerActualWidth);
    } else if (menuWidth === "content") {
      /**
       * Estimate the width required by the longest option.
       * The portal must always be at least as wide as the trigger.
       */
      const longestLabelLength = options.reduce(
        (max, option) => Math.max(max, option.label.length),
        0
      );
  
      const estimatedContentWidth = longestLabelLength * 8 + 48;
  
      width = Math.max(
        triggerActualWidth,
        estimatedContentWidth
      );
    } else {
      // Default: menu exactly matches trigger.
      width = triggerActualWidth;
    }
  
    /**
     * IMPORTANT:
     * Never allow the portal to become narrower than the trigger,
     * regardless of menuWidth/menuMaxWidth configuration.
     */
    width = Math.max(width, triggerActualWidth);
  
    if (menuMaxWidth !== undefined) {
      width = Math.min(width, menuMaxWidth);
  
      /**
       * If menuMaxWidth is smaller than the trigger, the trigger
       * still wins. The menu should never be narrower than it.
       */
      width = Math.max(width, triggerActualWidth);
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
      setQuery("");
      setHighlightIndex(0);
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
        setHighlightIndex(0);
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
        ? getAccountPortalParent(triggerRef.current)
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
        role={searchable ? undefined : "listbox"}
        aria-label={searchable ? undefined : resolvedAriaLabel}
        style={{
          position: "fixed",
          top: coords.top,
          left: coords.left,
          width: coords.width,
          maxWidth: "calc(100vw - 16px)",
        }}
        className={cn(
          "z-[1000] min-w-0 overflow-x-hidden animate-[dropdown-in_180ms_var(--ease-premium)]",
          searchable
            ? "flex max-h-72 flex-col overflow-y-hidden"
            : "max-h-60 overflow-y-auto",
          isAccount
            ? "rounded-[6px] border border-[var(--account-border,#ebe7e0)] bg-[var(--account-surface,#ffffff)] py-1 shadow-[var(--account-shadow,0_1px_3px_rgba(0,0,0,0.12))]"
            : isLight
              ? "rounded-[6px] border border-neutral-200 bg-white py-1 shadow-lg"
              : "dropdown-menu",
          searchable && "!pt-0"
        )}
      >
        {searchable && (
          <div
            className={cn(
              "shrink-0 border-b p-2",
              isAccount
                ? "border-[var(--account-border,#ebe7e0)]"
                : isLight
                  ? "border-neutral-200"
                  : "border-white/10"
            )}
          >
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setHighlightIndex(0);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setHighlightIndex((index) =>
                    Math.min(index + 1, Math.max(visibleOptions.length - 1, 0))
                  );
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setHighlightIndex((index) => Math.max(index - 1, 0));
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  const match = visibleOptions[highlightIndex];
                  if (match) selectOption(match.value);
                } else if (event.key === "Tab") {
                  closeMenu();
                }
              }}
              placeholder={searchPlaceholder}
              aria-label={`Search ${resolvedAriaLabel ?? "options"}`}
              aria-controls={listboxId}
              aria-activedescendant={
                visibleOptions[highlightIndex]
                  ? `${listboxId}-${highlightIndex}`
                  : undefined
              }
              role="combobox"
              aria-expanded
              aria-autocomplete="list"
              autoComplete="off"
              spellCheck={false}
              className={cn(
                "h-9 w-full rounded-[6px] border px-3 text-body-sm outline-none transition-colors",
                isAccount
                  ? "border-[var(--account-input-border,#e5e5e5)] bg-[var(--account-input-bg,#ffffff)] text-[var(--account-text,#171717)] placeholder:text-[var(--account-text-muted,#737373)] focus:border-[var(--account-accent,#f97316)]"
                  : isLight
                    ? "border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-orange-500"
                    : "border-white/20 bg-bg-tertiary text-text-primary placeholder:text-text-dimmed focus:border-orange-500"
              )}
            />
          </div>
        )}

        <div
          id={listboxId}
          role={searchable ? "listbox" : undefined}
          aria-label={searchable ? resolvedAriaLabel : undefined}
          className={cn(searchable && "min-h-0 flex-1 overflow-y-auto py-1")}
        >
        {searchable && visibleOptions.length === 0 ? (
          <p
            className={cn(
              "px-4 py-3 text-body-sm",
              isAccount
                ? "text-[var(--account-text-muted,#737373)]"
                : isLight
                  ? "text-neutral-500"
                  : "text-text-dimmed"
            )}
          >
            {emptySearchLabel}
          </p>
        ) : null}
        {visibleOptions.map((option, index) => {
          const isActive = option.value === value;
          const isHighlighted = searchable && index === highlightIndex;

          return (
            <button
              key={option.value || "__all__"}
              id={`${listboxId}-${index}`}
              ref={
                isHighlighted
                  ? (node) => node?.scrollIntoView({ block: "nearest" })
                  : undefined
              }
              type="button"
              role="option"
              tabIndex={searchable ? -1 : undefined}
              aria-selected={isActive}
              onMouseEnter={
                searchable ? () => setHighlightIndex(index) : undefined
              }
              onClick={() => selectOption(option.value)}
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
                      "cursor-pointer px-4 py-2.5 text-body-sm text-[var(--account-text-secondary,#404040)] transition-colors",
                      "hover:bg-[var(--account-nav-active-bg,#fff3e8)] hover:text-[var(--account-accent,#f97316)]",
                      isActive &&
                        "bg-[var(--account-nav-active-bg,#fff3e8)] font-medium text-[var(--account-accent,#f97316)]"
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
                      ),
                isHighlighted &&
                  (isAccount
                    ? "bg-[var(--account-nav-active-bg,#fff3e8)] text-[var(--account-accent,#f97316)]"
                    : isLight
                      ? "bg-orange-500/10 text-orange-600"
                      : "bg-orange-500/12 text-orange-400")
              )}
            >
              {option.label}
            </button>
          );
        })}
        </div>
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
        onClick={() => {
          if (open) {
            closeMenu();
          } else {
            setOpen(true);
          }
        }}
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