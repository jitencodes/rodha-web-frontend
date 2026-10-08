"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
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
  prefixIcon?: React.ReactNode;

  /**
   * Optional trigger width control.
   *
   * Existing behavior is preserved when omitted:
   * - mobile: full width
   * - desktop: content/max-content width
   */
  triggerWidth?: "auto" | "full" | number;

  /**
   * Minimum trigger width.
   *
   * Defaults to the existing 140px.
   */
  triggerMinWidth?: number;

  /**
   * Optional maximum trigger width.
   */
  triggerMaxWidth?: number;

  /**
   * Optional menu width control.
   *
   * Existing behavior:
   * - "trigger": menu follows trigger width
   *
   * New:
   * - "content": menu expands based on option content
   * - number: explicit menu width in px
   */
  menuWidth?: "trigger" | "content" | number;

  /**
   * Optional maximum menu width.
   *
   * Useful with menuWidth="content".
   */
  menuMaxWidth?: number;

  /**
   * `dark` — marketing/counselling dark UI.
   * `light` — public light UI.
   * `account` — account shell tokens.
   */
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

  // New props are optional so existing usages are unchanged.
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
   * Calculate only the portal position/width.
   *
   * IMPORTANT:
   * The menu is fixed-positioned and rendered through a portal,
   * so a wider menu never changes the trigger/filter layout.
   */
  const updateCoords = () => {
    const trigger = triggerRef.current;

    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();

    const viewportPadding = 8;
    const viewportWidth = window.innerWidth;

    const actualTriggerWidth = rect.width;

    let width: number;

    if (typeof menuWidth === "number") {
      /**
       * Explicit menu width.
       *
       * Never make the menu smaller than the trigger.
       */
      width = Math.max(menuWidth, actualTriggerWidth);
    } else if (menuWidth === "content") {
      /**
       * Calculate enough width for the longest option.
       *
       * This is only used when explicitly requested.
       */
      const longestLabelLength = options.reduce(
        (max, option) =>
          Math.max(max, option.label.length),
        0
      );

      const estimatedContentWidth =
        longestLabelLength * 7.5 + 48;

      width = Math.max(
        actualTriggerWidth,
        estimatedContentWidth
      );
    } else {
      /**
       * Existing/default behavior:
       * menu width = actual trigger width.
       */
      width = actualTriggerWidth;
    }

    if (menuMaxWidth !== undefined) {
      width = Math.min(width, menuMaxWidth);
    }

    /**
     * Never allow the portal to exceed the viewport.
     */
    width = Math.min(
      width,
      viewportWidth - viewportPadding * 2
    );

    let left = rect.left;

    /**
     * If the menu is wider than the trigger and would
     * overflow the viewport, shift only the portal.
     *
     * This does NOT affect the trigger or neighboring fields.
     */
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

    const onReposition = () => {
      updateCoords();
    };

    window.addEventListener(
      "resize",
      onReposition
    );

    window.addEventListener(
      "scroll",
      onReposition,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        onReposition
      );

      window.removeEventListener(
        "scroll",
        onReposition,
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
          /**
           * Keep the existing menu behavior.
           *
           * overflow-x-hidden prevents horizontal scrolling
           * when content-width mode is used.
           */
          "z-[1000] min-w-0 max-h-60 overflow-y-auto overflow-x-hidden animate-[dropdown-in_180ms_var(--ease-premium)]",

          isAccount
            ? "rounded-[6px] border border-[var(--account-border)] bg-[var(--account-surface)] py-1 shadow-[var(--account-shadow)]"
            : isLight
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
                /**
                 * Preserve old behavior for the default
                 * trigger-width menu.
                 *
                 * Only content-width mode allows wrapping.
                 */
                menuWidth === "content"
                  ? "block w-full min-w-0 whitespace-normal break-words"
                  : "block w-full whitespace-nowrap",

                isAccount
                  ? cn(
                      "cursor-pointer px-4 py-2.5 text-left text-body-sm text-[var(--account-text-secondary)] transition-colors",
                      "hover:bg-[var(--account-nav-active-bg)] hover:text-[var(--account-accent)]",
                      isActive &&
                        "bg-[var(--account-nav-active-bg)] font-medium text-[var(--account-accent)]"
                    )
                  : isLight
                    ? cn(
                        "cursor-pointer px-4 py-2.5 text-left text-body-sm text-neutral-700 transition-colors",
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

  /**
   * Trigger styles are applied only to the trigger.
   * Menu width is completely independent.
   */
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
        /**
         * Preserve old responsive behavior by default.
         */
        "relative w-full max-w-full shrink-0 md:w-max",

        /**
         * Only override the width behavior when the
         * new triggerWidth prop is explicitly used.
         */
        triggerWidth === "full" && "w-full",
        triggerWidth === "auto" && "w-full md:w-max",

        className
      )}
    >
      {label && (
        <label
          className={cn(
            "block text-body-sm font-medium mb-1.5",
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
          /**
           * Keep the original responsive behavior.
           */
          "flex w-full items-center justify-between gap-2 h-9 min-w-[140px] px-3 text-body-sm font-medium border rounded-[6px] transition-colors whitespace-nowrap md:w-max md:max-w-[min(100vw-2rem,28rem)]",

          /**
           * Explicit trigger width overrides.
           */
          triggerWidth === "full" && "w-full",
          typeof triggerWidth === "number" &&
            "w-auto md:w-auto",

          isAccount
            ? "bg-[var(--account-input-bg)] text-[var(--account-text)] border-[var(--account-input-border)] hover:border-[var(--account-accent)]/60"
            : isLight
              ? "bg-white text-neutral-900 border-neutral-200 hover:border-orange-500/60"
              : "bg-bg-tertiary text-text-primary border-white/30 hover:border-orange-500/60 hover:text-orange-400",

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

          <span className="truncate">
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