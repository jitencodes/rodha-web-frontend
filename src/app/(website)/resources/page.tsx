import type { Metadata } from "next";
import Link from "next/link";

import { BlogToolbar } from "@/app/(website)/blog/BlogToolbar";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { Container } from "@/components/layout/Container";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
import { BlogHeroSection } from "@/components/sections/blog/BlogHeroSection";
import { ListingEmptyState } from "@/components/sections/listings/ListingEmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { getResources } from "@/lib/api/modules/resources/service";
import { isResourceType } from "@/lib/api/modules/resources/types";
import { EXTERNAL_URLS } from "@/lib/constants";
import { listingPaginationQuery, readListingQuery } from "@/lib/content-listings";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

import { ResourceTypeFilter } from "./ResourceTypeFilter";

export const metadata: Metadata = buildPageMetadata({
  title: "Resource Hub — Rodha",
  description:
    "Courses, PDFs, documents, community links, and external resources for CAT, IPMAT, and other Rodha programs.",
  path: "/resources",
});

const PAGE_SIZE = 8;

interface ResourcesPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    page?: string;
    type?: string;
  }>;
}

export default async function ResourcesPage({
  searchParams,
}: ResourcesPageProps) {
  const params = await searchParams;
  const { category, query, type, currentPage } = readListingQuery(params);
  const activeType = isResourceType(type) ? type : "all";
  const listing = await getResources({
    page: currentPage,
    limit: PAGE_SIZE,
    search: query,
    category,
    type: activeType,
  });
  const pageItems = listing.items;
  const total = listing.total;
  const totalPages = listing.totalPages;
  const safePage = listing.page;
  const isDefaultView = category === "all" && !query && activeType === "all";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { label: "Home", href: "/" },
              { label: "Resource Hub" },
            ])
          ),
        }}
      />

      <BlogHeroSection
        eyebrow="Resource Hub"
        title="Guides, files, and links for"
        accent="your preparation"
        description="Courses, PDFs, documents, community links, and external resources — filtered by exam and format."
        breadcrumbLabel="Resource Hub"
        imageAlt="Resource hub"
      />

      <section className="bg-section-white home-on-light">
        <Container>
          <BlogToolbar
            basePath="/resources"
            activeCategory={category}
            initialQuery={query}
            searchPlaceholder="Search resources..."
            searchAriaLabel="Search resources"
            tablistLabel="Resource categories"
            extraParams={
              activeType !== "all" ? { type: activeType } : undefined
            }
          />
        </Container>
      </section>

      <section className="home-section-spacing bg-section-white home-on-light !pt-0">
        <Container>
          <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-3">
            <h2 className="text-h3 font-semibold text-neutral-900">
              {total === 1 ? "1 Resource" : `${total} Resources`}
            </h2>
            <ResourceTypeFilter
              activeType={activeType}
              category={category}
              query={query}
            />
            {!isDefaultView && (
              <Link
                href="/resources"
                className="text-body-sm font-medium text-orange-500 transition-colors hover:text-orange-600 sm:ml-auto"
              >
                Clear filters
              </Link>
            )}
          </div>

          {pageItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageItems.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <ListingEmptyState
              href="/resources"
              query={query}
              hasCategory={category !== "all"}
              hasType={activeType !== "all"}
              noun="resources"
            />
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              basePath="/resources"
              query={listingPaginationQuery({
                category,
                query,
                type: activeType,
              })}
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
