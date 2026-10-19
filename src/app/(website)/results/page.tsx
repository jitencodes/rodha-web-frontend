import type { Metadata } from "next";
import Link from "next/link";

import { BlogToolbar } from "@/app/(website)/blog/BlogToolbar";
import { TopperCardV2 } from "@/components/cards/TopperCardV2";
import { Container } from "@/components/layout/Container";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
import { BlogHeroSection } from "@/components/sections/blog/BlogHeroSection";
import { ListingEmptyState } from "@/components/sections/listings/ListingEmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { getStudentResults } from "@/lib/api/modules/student-results/service";
import { EXTERNAL_URLS } from "@/lib/constants";
import { listingPaginationQuery, readListingQuery } from "@/lib/content-listings";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = buildPageMetadata({
  title: "Student Results — Rodha",
  description:
    "Browse Rodha student results across CAT, IPMAT, and other exams — percentiles, ranks, and college converts.",
  path: "/results",
});

const PAGE_SIZE = 10;

interface ResultsPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    page?: string;
    resultId?: string;
  }>;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const { category, query, currentPage } = readListingQuery(params);
  const listing = await getStudentResults({
    page: currentPage,
    limit: PAGE_SIZE,
    search: query,
    category,
    resultId: params.resultId,
  });
  const pageItems = listing.items;
  const total = listing.total;
  const totalPages = listing.totalPages;
  const safePage = listing.page;
  const isDefaultView = category === "all" && !query;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { label: "Home", href: "/" },
              { label: "Results" },
            ])
          ),
        }}
      />

      <BlogHeroSection
        eyebrow="Student Results"
        title="Scores, ranks, and admits from"
        accent="Rodha students"
        description="Browse CAT, IPMAT, and other exam toppers — percentiles, ranks, and the colleges they converted."
        breadcrumbLabel="Results"
        imageAlt="Student results"
      />

      <section className="bg-section-white home-on-light">
        <Container>
          <BlogToolbar
            basePath="/results"
            activeCategory={category}
            initialQuery={query}
            searchPlaceholder="Search results..."
            searchAriaLabel="Search student results"
            tablistLabel="Result categories"
          />
        </Container>
      </section>

      <section className="home-section-spacing bg-section-white home-on-light !pt-0">
        <Container>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-h3 font-semibold text-neutral-900">
              {total === 1 ? "1 Result" : `${total} Results`}
            </h2>
            {!isDefaultView && (
              <Link
                href="/results"
                className="text-body-sm font-medium text-orange-500 transition-colors hover:text-orange-600"
              >
                Clear filters
              </Link>
            )}
          </div>

          {pageItems.length > 0 ? (
            <div className="flex flex-wrap gap-5">
              {pageItems.map((topper) => (
                <div key={`${topper.categorySlug}-${topper.id}`} className="w-fit">
                  <TopperCardV2 topper={topper} />
                </div>
              ))}
            </div>
          ) : (
            <ListingEmptyState
              href="/results"
              query={query}
              hasCategory={category !== "all"}
              noun="results"
            />
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              basePath="/results"
              query={listingPaginationQuery({ category, query })}
              variant="light"
              className="pt-8"
            />
          )}
        </Container>
      </section>

      <RevealGroup>
        <CTABandV2Decorative
          title="Ready to Begin Your Journey?"
          subtitle="Explore our programs or connect with Rodha Buddy for personalised guidance."
          backgroundImage="/assets/images/background/cta background image.JPG"
          decorativeImage="/assets/images/about us/footer-cta-award 4.png"
          primaryAction={{ label: "Explore Courses", href: "/category/cat" }}
          secondaryAction={{
            label: "Ask Rodha Buddy",
            href: EXTERNAL_URLS.rodhaBuddy,
          }}
        />
      </RevealGroup>
    </>
  );
}
