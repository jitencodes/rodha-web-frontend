"use client";

import { useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

import { DropdownSelect, type DropdownSelectOption } from "@/components/ui/DropdownSelect";

type ForumSortSelectProps = {
  options: DropdownSelectOption[];
  value: string;
  defaultValue: string;
  /** Page path the sort applies to (group topics listing). */
  basePath: string;
  /** Current search term to keep in the URL. */
  search?: string;
};

/** Topic sort dropdown. Writes `?sort=` (and keeps `?q=`), resetting to page 1. */
export function ForumSortSelect({
  options,
  value,
  defaultValue,
  basePath,
  search,
}: ForumSortSelectProps) {
  const router = useRouter();

  const onChange = (next: string) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (next !== defaultValue) params.set("sort", next);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  return (
    <DropdownSelect
      value={value}
      onChange={onChange}
      options={options}
      aria-label="Sort topics"
      prefixIcon={<ArrowUpDown className="size-4 text-orange-500" aria-hidden />}
      className="w-full min-w-0 sm:w-auto sm:min-w-[11rem]"
      variant="light"
    />
  );
}
