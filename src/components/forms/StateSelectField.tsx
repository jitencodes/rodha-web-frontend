"use client";

import { useEffect, useState } from "react";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { cn } from "@/lib/utils";

type StateSelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Auth forms use light; account dialogs use light as well. */
  variant?: "dark" | "light";
  className?: string;
  required?: boolean;
};

type StatesApiResponse = {
  ok: boolean;
  items?: Array<{ value: string; label: string; stateId: number }>;
  error?: string;
};

/** Loads states from BFF and renders a DropdownSelect. */
export function StateSelectField({
  value,
  onChange,
  error,
  label = "State",
  placeholder = "Select your state",
  disabled = false,
  variant = "light",
  className,
  required = false,
}: StateSelectFieldProps) {
  const [options, setOptions] = useState<Array<{ value: string; label: string }>>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError("");
    void fetch("/api/states/dropdown?limit=50")
      .then(async (res) => {
        const data = (await res.json()) as StatesApiResponse;
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Unable to load states");
        }
        if (cancelled) return;
        setOptions(
          (data.items ?? []).map((item) => ({
            value: item.value,
            label: item.label,
          }))
        );
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoadError(
          err instanceof Error ? err.message : "Unable to load states"
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={cn("w-full", className)}>
      <DropdownSelect
        variant={variant}
        label={required ? `${label} *` : label}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={loading ? "Loading states…" : placeholder}
        error={error || loadError || undefined}
        aria-label={label}
        className={disabled ? "pointer-events-none opacity-60" : undefined}
      />
    </div>
  );
}
