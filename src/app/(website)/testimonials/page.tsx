import type { Metadata } from "next";
import Link from "next/link";

import { BlogToolbar } from "@/app/(website)/blog/BlogToolbar";
import { Container } from "@/components/layout/Container";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
import { BlogHeroSection } from "@/components/sections/blog/BlogHeroSection";
import { TestimonialCardV2 } from "@/components/sections/home/Testimonials/TestimonialCardV2";
import { ListingEmptyState } from "@/components/sections/listings/ListingEmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { getTestimonials } from "@/lib/api/modules/testimonials/service";
import { EXTERNAL_URLS } from "@/lib/constants";
import { listingPaginationQuery, readListingQuery } from "@/lib/content-listings";
import { buildPageMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = buildPageMetadata({
  title: "Testimonials — Rodha",
  description:
    "Read reviews from Rodha students on classes, mocks, and mentorship across CAT, IPMAT, and other exams.",
  path: "/testimonials",
});

const PAGE_SIZE = 6;

interface TestimonialsPageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function TestimonialsPage({
  searchParams,
}: TestimonialsPageProps) {
  const params = await searchParams;
  const { category, query, currentPage } = readListingQuery(params);
  const listing = await getTestimonials({
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
              { label: "Testimonials" },
            ])
          ),
        }}
      />

      <BlogHeroSection
        eyebrow="Testimonials"
        title="Reviews from students who prepared"
        accent="with Rodha"
        description="Honest notes on classes, mocks, and mentorship from aspirants across exams."
        breadcrumbLabel="Testimonials"
        imageAlt="Student testimonials"
      />

      <section className="bg-section-white home-on-light">
        <Container>
          <BlogToolbar
            basePath="/testimonials"
            activeCategory={category}
            initialQuery={query}
            searchPlaceholder="Search testimonials..."
            searchAriaLabel="Search testimonials"
            tablistLabel="Testimonial categories"
          />
        </Container>
      </section>

      <section className="home-section-spacing bg-section-white home-on-light !pt-0">
        <Container>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-h3 font-semibold text-neutral-900">
              {total === 1 ? "1 Testimonial" : `${total} Testimonials`}
            </h2>
            {!isDefaultView && (
              <Link
                href="/testimonials"
                className="text-body-sm font-medium text-orange-500 transition-colors hover:text-orange-600"
              >
                Clear filters
              </Link>
            )}
          </div>

          {pageItems.length > 0 ? (
            <div className="flex flex-wrap gap-5">
              {pageItems.map((testimonial) => (
                <TestimonialCardV2
                  key={`${testimonial.categorySlug}-${testimonial.id}`}
                  testimonial={testimonial}
                  variant="light"
                />
              ))}
            </div>
          ) : (
            <ListingEmptyState
              href="/testimonials"
              query={query}
              hasCategory={category !== "all"}
              noun="testimonials"
            />
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              basePath="/testimonials"
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
