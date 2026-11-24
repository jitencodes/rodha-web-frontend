"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { SearchInput } from "@/components/ui/SearchInput";
import { COURSE_CHANGE_STATUS_OPTIONS } from "@/lib/api/modules/student/course-changes/mapper";

const BASE_PATH = "/account/course-changes";
const SEARCH_DEBOUNCE_MS = 300;

type CourseChangeRequestsToolbarProps = {
  initialSearch: string;
  activeStatus: string;
};

export function CourseChangeRequestsToolbar({
  initialSearch,
  activeStatus,
}: CourseChangeRequestsToolbarProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(initialSearch);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function navigate(search: string, status: string) {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (status) params.set("status", status);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${BASE_PATH}?${qs}` : BASE_PATH, { scroll: false });
    });
  }

  function handleSearch(value: string) {
    setQuery(value);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(
      () => navigate(value, activeStatus),
      SEARCH_DEBOUNCE_MS
    );
  }

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <DropdownSelect
          value={activeStatus}
          onChange={(status) => navigate(query, status)}
          options={[
            { value: "", label: "All statuses" },
            ...COURSE_CHANGE_STATUS_OPTIONS,
          ]}
          aria-label="Status"
          className="w-full sm:w-auto"
          triggerWidth="full"
          variant="account"
        />
        {query || activeStatus ? (
          <button
            type="button"
            onClick={() => {
              window.clearTimeout(timerRef.current);
              setQuery("");
              navigate("", "");
            }}
            className="h-9 shrink-0 cursor-pointer rounded-[var(--account-radius)] border border-[var(--account-border)] px-3 text-[13px] font-medium text-[var(--account-text-secondary)] transition-colors hover:border-[var(--account-accent)] hover:text-[var(--account-accent)]"
          >
            Reset Filters
          </button>
        ) : null}
      </div>
      <div className="w-full sm:w-64">
        <SearchInput
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onClear={() => handleSearch("")}
          placeholder="Search courses..."
          aria-label="Search course switch requests"
          variant="account"
        />
      </div>
    </div>
  );
}
