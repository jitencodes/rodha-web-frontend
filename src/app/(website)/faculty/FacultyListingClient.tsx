"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect, useTransition } from "react";
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
import type { Faculty } from "@/lib/types";

interface FilterOption {
  value: string;
  label: string;
}

interface FacultyListingClientProps {
  featured: Faculty[];
  items: Faculty[];
  total: number;
  totalPages: number;
  currentPage: number;
  filters: FacultyFiltersState;
  categoryOptions: FilterOption[];
  subjectOptions: FilterOption[];
}

function buildFacultyHref(filters: FacultyFiltersState, page = 1): string {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.category) params.set("category", filters.category);
  if (filters.subject) params.set("subject", filters.subject);
  if (filters.sort && filters.sort !== "experience-desc") {
    params.set("sort", filters.sort);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/faculty?${qs}` : "/faculty";
}

export function FacultyListingClient({
  featured,
  items,
  total,
  totalPages,
  currentPage,
  filters,
  categoryOptions,
  subjectOptions,
}: FacultyListingClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function navigate(next: FacultyFiltersState, page = 1) {
    startTransition(() => {
      router.push(buildFacultyHref(next, page), { scroll: false });
    });
  }

  const hasActiveFilters =
    Boolean(filters.query.trim()) ||
    Boolean(filters.category) ||
    Boolean(filters.subject) ||
    currentPage > 1;

  useLayoutEffect(() => {
    if (!hasActiveFilters) return;
    document
      .getElementById("faculty-list")
        ?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [hasActiveFilters]);

  return (
    <>
      <FeaturedFacultySection members={featured} />

      <section
        id="faculty-list"
        className="home-section-spacing bg-section-white home-on-light scroll-mt-24"
      >
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-2">
            <SectionHeaderV2
              title="All Faculty"
              subtitle={`${total} Faculty Member${total === 1 ? "" : "s"}`}
              align="left"
              className="mb-0"
            />
          </div>

          <FacultyFiltersBar
            filters={filters}
            categoryOptions={categoryOptions}
            subjectOptions={subjectOptions}
            onFiltersChange={(next) => navigate(next, 1)}
            onReset={() =>
              navigate(
                {
                  query: "",
                  subject: "",
                  category: "",
                  sort: "experience-desc",
                },
                1
              )
            }
          />

          {items.length > 0 ? (
            <RevealGroup>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((member, index) => (
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
                onClick={() =>
                  navigate(
                    {
                      query: "",
                      subject: "",
                      category: "",
                      sort: "experience-desc",
                    },
                    1
                  )
                }
                className="mt-5 inline-flex items-center gap-1.5 rounded-[6px] border border-orange-500 bg-orange-500/10 px-5 py-2.5 text-body-sm font-medium text-orange-600 hover:bg-orange-500/20 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => navigate(filters, page)}
              variant="light"
              className="mt-8 md:mt-10"
            />
          )}

          <p className="sr-only" aria-live="polite">
            Page {currentPage} of {totalPages}. {total} faculty members shown.
          </p>
        </Container>
      </section>
    </>
  );
}
