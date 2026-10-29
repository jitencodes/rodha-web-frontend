import Link from "next/link";

import {
  RESOURCE_TYPE_LABELS,
  RESOURCE_TYPES,
} from "@/lib/api/modules/resources/types";
import { cn } from "@/lib/utils";

interface ResourceTypeFilterProps {
  activeType: string;
  category: string;
  query: string;
}

const OPTIONS = [
  { value: "all", label: "All" },
  ...RESOURCE_TYPES.map((type) => ({
    value: type,
    label: RESOURCE_TYPE_LABELS[type],
  })),
];

function typeHref(type: string, category: string, query: string) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (query) params.set("q", query);
  if (type !== "all") params.set("type", type);
  const qs = params.toString();
  return qs ? `/resources?${qs}` : "/resources";
}

export function ResourceTypeFilter({
  activeType,
  category,
  query,
}: ResourceTypeFilterProps) {
  return (
    <div
      className="flex max-w-full gap-2 overflow-x-auto scrollbar-hide"
      role="group"
      aria-label="Resource type"
    >
      {OPTIONS.map((option) => {
        const isActive = activeType === option.value;
        return (
          <Link
            key={option.value}
            href={typeHref(option.value, category, query)}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-caption font-medium transition-colors",
              isActive
                ? "border-orange-500 bg-orange-500 text-white"
                : "border-section-beige bg-white text-neutral-600 hover:border-orange-300 hover:text-neutral-900"
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
