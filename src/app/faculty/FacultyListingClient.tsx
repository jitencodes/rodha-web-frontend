"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { FacultyCardV2 } from "@/components/cards/FacultyCardV2";
import { Pagination } from "@/components/ui/Pagination";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import {
  FacultyFiltersBar,
  type FacultyFiltersState,
} from "@/components/sections/FacultyFiltersBar";
import { FeaturedFacultySection } from "@/components/sections/FeaturedFacultySection";
import {
  FACULTY_ITEMS_PER_PAGE,
  filterFaculty,
  getFeaturedFaculty,
  searchFaculty,
  sortFaculty,
} from "@/data/faculty";
import type { Faculty } from "@/lib/types";

const DEFAULT_FILTERS: FacultyFiltersState = {
  query: "",
  subject: "",
  experience: "",
  sort: "experience-desc",
};

interface FacultyListingClientProps {
  faculty: Faculty[];
}

export function FacultyListingClient({ faculty: allFaculty }: FacultyListingClientProps) {
  const [filters, setFilters] = useState<FacultyFiltersState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  const featuredMembers = useMemo(() => getFeaturedFaculty(allFaculty), [allFaculty]);

  const filtered = useMemo(() => {
    const searched = searchFaculty(allFaculty, filters.query);
    const narrowed = filterFaculty(searched, {
      subject: filters.subject,
      experience: filters.experience,
    });
    return sortFaculty(narrowed, filters.sort);
  }, [allFaculty, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / FACULTY_ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * FACULTY_ITEMS_PER_PAGE;
    return filtered.slice(start, start + FACULTY_ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  function handleFiltersChange(next: FacultyFiltersState) {
    setFilters(next);
    setCurrentPage(1);
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }

  return (
    <>
      <FeaturedFacultySection members={featuredMembers} />

      <section className="home-section-spacing bg-section-white home-on-light">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-2">
            <SectionHeaderV2
              title="All Faculty"
              subtitle={`${filtered.length} Faculty Member${filtered.length === 1 ? "" : "s"}`}
              align="left"
              className="mb-0"
            />
          </div>

          <FacultyFiltersBar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleReset}
          />

          {pageItems.length > 0 ? (
            <RevealGroup>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {pageItems.map((member, index) => (
                  <div
                    key={member.id}
                    className={`reveal-child reveal-delay-${(index % 4) + 1}`}
                  >
                    <FacultyCardV2 faculty={member} className="w-full" />
                  </div>
                ))}
              </div>
            </RevealGroup>
          ) : (
            <div className="rounded-xl border border-section-beige bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-h4 font-semibold text-neutral-900">No faculty found</p>
              <p className="mt-2 text-body text-neutral-500">
                Try adjusting your search or filter criteria.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-5 inline-flex items-center gap-1.5 rounded-[6px] border border-orange-500 bg-orange-500/10 px-5 py-2.5 text-body-sm font-medium text-orange-600 hover:bg-orange-500/20 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}

          {filtered.length > FACULTY_ITEMS_PER_PAGE && (
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              variant="light"
              className="mt-8 md:mt-10"
            />
          )}

          <p className="sr-only" aria-live="polite">
            Page {safePage} of {totalPages}. {filtered.length} faculty members shown.
          </p>
        </Container>
      </section>
    </>
  );
}
