"use client";

import { SearchInput } from "@/components/ui/SearchInput";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import {
  FACULTY_EXPERIENCE_BUCKETS,
  FACULTY_SORT_OPTIONS,
  FACULTY_SUBJECTS,
  type FacultySortKey,
} from "@/data/faculty";

export interface FacultyFiltersState {
  query: string;
  subject: string;
  experience: string;
  sort: FacultySortKey;
}

interface FacultyFiltersBarProps {
  filters: FacultyFiltersState;
  onFiltersChange: (filters: FacultyFiltersState) => void;
  onReset: () => void;
}

export function FacultyFiltersBar({
  filters,
  onFiltersChange,
  onReset,
}: FacultyFiltersBarProps) {
  function update(partial: Partial<FacultyFiltersState>) {
    onFiltersChange({ ...filters, ...partial });
  }

  return (
    <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8">
      <div className="w-full max-w-sm">
        <SearchInput
          value={filters.query}
          onChange={(e) => update({ query: e.target.value })}
          onClear={() => update({ query: "" })}
          placeholder="Search faculty..."
          aria-label="Search faculty"
          variant="light"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
        <DropdownSelect
          options={[...FACULTY_SUBJECTS]}
          value={filters.subject}
          onChange={(subject) => update({ subject })}
          placeholder="All Subjects"
          aria-label="Filter by subject"
          variant="light"
          className="w-full sm:w-auto sm:min-w-[160px]"
        />
        <DropdownSelect
          options={[...FACULTY_EXPERIENCE_BUCKETS]}
          value={filters.experience}
          onChange={(experience) => update({ experience })}
          placeholder="All Experience"
          aria-label="Filter by experience"
          variant="light"
          className="w-full sm:w-auto sm:min-w-[160px]"
        />

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-3 text-body-sm font-medium text-neutral-600 border border-neutral-300 rounded-[6px] bg-white hover:border-orange-500/60 hover:text-orange-500 transition-colors whitespace-nowrap"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset Filters
        </button>

        <div className="flex items-center gap-2 sm:ml-auto w-full sm:w-auto">
          <span className="text-body-sm text-neutral-600 whitespace-nowrap shrink-0">
            Sort by:
          </span>
          <DropdownSelect
            options={FACULTY_SORT_OPTIONS.map((opt) => ({
              value: opt.value,
              label: opt.label,
            }))}
            value={filters.sort}
            onChange={(sort) => update({ sort: sort as FacultySortKey })}
            aria-label="Sort faculty"
            variant="light"
            className="flex-1 sm:flex-initial sm:min-w-[200px]"
          />
        </div>
      </div>
    </div>
  );
}
