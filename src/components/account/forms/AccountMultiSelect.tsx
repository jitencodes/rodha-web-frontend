"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AccountFieldShell } from "./AccountFieldShell";
import { accountInputClassName } from "./accountFieldStyles";

export type AccountMultiSelectOption = { value: string; label: string };

type AccountMultiSelectProps = {
  id?: string;
  label: string;
  options: AccountMultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  required?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  /** When true, shows a Select all option at the top. */
  selectAll?: boolean;
  selectAllLabel?: string;
  className?: string;
};

export function AccountMultiSelect({
  id: idProp,
  label,
  options,
  value,
  onChange,
  required,
  error,
  helperText,
  placeholder = "Select",
  disabled,
  selectAll = true,
  selectAllLabel = "Select all",
  className,
}: AccountMultiSelectProps) {
  const autoId = useId();
  const id = idProp || autoId;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  const allValues = options.map((o) => o.value);
  const allSelected =
    allValues.length > 0 && allValues.every((v) => value.includes(v));

  const selectedLabels = options
    .filter((o) => value.includes(o.value))
    .map((o) => o.label);

  const summary =
    selectedLabels.length === 0
      ? placeholder
      : selectedLabels.length <= 2
        ? selectedLabels.join(", ")
        : `${selectedLabels.slice(0, 2).join(", ")} +${selectedLabels.length - 2}`;

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 120,
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle(optionValue: string) {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  }

  function toggleAll() {
    if (allSelected) onChange([]);
    else onChange(allValues);
  }

  return (
    <AccountFieldShell
      id={id}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
    >
      <div className={cn("relative w-full", className)}>
        <button
          ref={triggerRef}
          id={id}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={Boolean(error)}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            accountInputClassName,
            "flex items-center justify-between gap-2 text-left",
            selectedLabels.length === 0 && "text-[var(--account-text-muted)]"
          )}
        >
          <span className="truncate">{summary}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-[var(--account-text-muted)] transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
        {open && typeof document !== "undefined"
          ? createPortal(
              <div
                ref={menuRef}
                style={menuStyle}
                role="listbox"
                aria-multiselectable
                className="max-h-60 overflow-auto rounded-[var(--account-radius)] border border-[var(--account-input-border)] bg-[var(--account-surface)] py-1 shadow-lg"
              >
                {selectAll && options.length > 0 ? (
                  <button
                    type="button"
                    role="option"
                    aria-selected={allSelected}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-sm font-medium text-[var(--account-text)] hover:bg-[var(--account-accent)]/10"
                    onClick={toggleAll}
                  >
                    <CheckIcon checked={allSelected} />
                    {selectAllLabel}
                  </button>
                ) : null}
                {options.map((option) => {
                  const selected = value.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-sm text-[var(--account-text)] hover:bg-[var(--account-accent)]/10"
                      onClick={() => toggle(option.value)}
                    >
                      <CheckIcon checked={selected} />
                      {option.label}
                    </button>
                  );
                })}
                {options.length === 0 ? (
                  <p className="px-3 py-2 text-body-sm text-[var(--account-text-muted)]">
                    No options
                  </p>
                ) : null}
              </div>,
              document.body
            )
          : null}
      </div>
    </AccountFieldShell>
  );
}

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
        checked
          ? "border-[var(--account-accent)] bg-[var(--account-accent)] text-white"
          : "border-[var(--account-input-border)]"
      )}
    >
      {checked ? <Check className="h-3 w-3" /> : null}
    </span>
  );
}
