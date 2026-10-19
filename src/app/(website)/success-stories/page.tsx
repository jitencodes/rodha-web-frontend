import type { Metadata } from "next";
import Link from "next/link";

import { BlogToolbar } from "@/app/(website)/blog/BlogToolbar";
import { YoutubeStoryCard } from "@/components/cards/YoutubeStoryCard";
import { Container } from "@/components/layout/Container";
import { StoriesModal } from "@/components/layout/VideoModal";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
import { BlogHeroSection } from "@/components/sections/blog/BlogHeroSection";
import { ListingEmptyState } from "@/components/sections/listings/ListingEmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { getSuccessStories } from "@/lib/api/modules/success-stories/service";
import { EXTERNAL_URLS } from "@/lib/constants";
import { listingPaginationQuery, readListingQuery } from "@/lib/content-listings";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = buildPageMetadata({
  title: "Success Stories — Rodha",
  description:
    "Watch Rodha student success stories — short films on the plan, the setbacks, and the result.",
  path: "/success-stories",
});

const PAGE_SIZE = 6;

interface SuccessStoriesPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function SuccessStoriesPage({
  searchParams,
}: SuccessStoriesPageProps) {
  const params = await searchParams;
  const { category, query, currentPage } = readListingQuery(params);
  const listing = await getSuccessStories({
    page: currentPage,
    limit: PAGE_SIZE,
    search: query,
    category,
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
              { label: "Success Stories" },
            ])
          ),
        }}
      />

      <BlogHeroSection
        eyebrow="Success Stories"
        title="Watch how they"
        accent="did it"
        description="Short films from Rodha students — the setbacks, the plan, and the result, in their own words."
        breadcrumbLabel="Success Stories"
        imageAlt="Student success stories"
      />

      <section className="bg-section-white home-on-light">
        <Container>
          <BlogToolbar
            basePath="/success-stories"
            activeCategory={category}
            initialQuery={query}
            searchPlaceholder="Search stories..."
            searchAriaLabel="Search success stories"
            tablistLabel="Success story categories"
          />
        </Container>
      </section>

      <section className="home-section-spacing bg-section-white home-on-light !pt-0">
        <Container>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-h3 font-semibold text-neutral-900">
              {total} {total === 1 ? "Story" : "Stories"}
            </h2>
            {!isDefaultView && (
              <Link
                href="/success-stories"
                className="text-body-sm font-medium text-orange-500 transition-colors hover:text-orange-600"
              >
                Clear filters
              </Link>
            )}
          </div>

          {pageItems.length > 0 ? (
            <div className="flex flex-wrap gap-5">
              {pageItems.map((story) => (
                <YoutubeStoryCard
                  key={`${story.categorySlug}-${story.id}`}
                  youtubeId={story.youtubeId}
                  student={story.student}
                  subtitle={story.subtitle}
                />
              ))}
            </div>
          ) : (
            <ListingEmptyState
              href="/success-stories"
              query={query}
              hasCategory={category !== "all"}
              noun="stories"
            />
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              basePath="/success-stories"
              query={listingPaginationQuery({ category, query })}
              variant="light"
              className="pt-8"
            />
          )}
        </Container>
      </section>

      <StoriesModal />

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
