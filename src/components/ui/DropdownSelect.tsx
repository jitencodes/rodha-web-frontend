"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
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
   * `dark` — marketing/counselling dark UI.
   * `light` — public light UI (hardcoded white).
   * `account` — follows account shell light/dark tokens (portal mounts into `.account-shell`).
   */
  variant?: "dark" | "light" | "account";
}

/**
 * Custom select. Menu renders in a portal so ancestor transforms / stacking
 * contexts (e.g. catalog toolbar `-translate-y-1/2`) cannot bury options under
 * sibling filters or page content.
 */
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
  const menuRef = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);
  const displayLabel = selected?.label ?? placeholder;
  const isLight = variant === "light";
  const isAccount = variant === "account";

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateCoords = () => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const longest = options.reduce(
      (max, option) => Math.max(max, option.label.length),
      0
    );
    const width = Math.min(
      Math.max(rect.width, longest * 7.5 + 32, 140),
      window.innerWidth - 16
    );
    let left = rect.left;
    if (left + width > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - 8 - width);
    }
    if (left < 8) left = 8;
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
    const onReposition = () => updateCoords();
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointer(e: MouseEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const portalParent =
    typeof document !== "undefined"
      ? isAccount
        ? (document.querySelector(".account-shell") as HTMLElement | null) ??
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
        }}
        className={cn(
          // Above ConfirmDialog / Modal overlays (z-[100]) so options stay clickable
          "z-[110] min-w-[140px] max-h-60 overflow-y-auto animate-[dropdown-in_180ms_var(--ease-premium)]",
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
                "whitespace-nowrap",
                isAccount
                  ? cn(
                      "block w-full cursor-pointer px-4 py-2.5 text-left text-body-sm text-[var(--account-text-secondary)] transition-colors",
                      "hover:bg-[var(--account-nav-active-bg)] hover:text-[var(--account-accent)]",
                      isActive &&
                        "bg-[var(--account-nav-active-bg)] font-medium text-[var(--account-accent)]"
                    )
                  : isLight
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
      </div>,
      portalParent
    );

  return (
    <div ref={rootRef} className={cn("relative w-full max-w-full shrink-0 md:w-max", className)}>
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
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={resolvedAriaLabel}
        aria-invalid={Boolean(error)}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between gap-2 h-9 min-w-[140px] px-3 text-body-sm font-medium border rounded-[6px] transition-colors whitespace-nowrap md:w-max md:max-w-[min(100vw-2rem,28rem)]",
          isAccount
            ? "bg-[var(--account-input-bg)] text-[var(--account-text)] border-[var(--account-input-border)] hover:border-[var(--account-accent)]/60"
            : isLight
              ? "bg-white text-neutral-900 border-neutral-200 hover:border-orange-500/60"
              : "bg-bg-tertiary text-text-primary border-white/30 hover:border-orange-500/60 hover:text-orange-400",
          triggerClassName,
          error && "border-accent-red hover:border-accent-red"
        )}
      >
        <span className="flex min-w-0 items-center gap-2.5 md:min-w-max">
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
          <span className="truncate md:overflow-visible md:whitespace-nowrap">{displayLabel}</span>
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
        <p className="mt-1 text-caption text-accent-red">{error}</p>
      )}
    </div>
  );
}
