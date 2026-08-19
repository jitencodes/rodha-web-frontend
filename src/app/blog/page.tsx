import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { BlogCard } from "@/components/cards/BlogCard";
import { Pagination } from "@/components/ui/Pagination";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { EXTERNAL_URLS } from "@/lib/constants";
import {
  blogPosts,
  getFilteredPosts,
  getFeaturedPost,
  getPaginatedPosts,
  BLOG_ITEMS_PER_PAGE,
} from "@/data/blog";
import { BlogHeroSection } from "@/components/sections/blog/BlogHeroSection";
import { BlogToolbar } from "./BlogToolbar";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog — Rodha",
  description:
    "Insights, tips, and strategies for MBA, Integrated Programs, Law, Banking & Government, and Skill House from Rodha's expert faculty.",
};

interface BlogPageProps {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category = "all", q = "", page = "1" } = await searchParams;

  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const filtered = getFilteredPosts({ category, query: q });

  const isDefaultView = category === "all" && !q;
  const featured = isDefaultView ? getFeaturedPost() : undefined;

  const postsForGrid = featured
    ? filtered.filter((p) => p.slug !== featured.slug)
    : filtered;

  const { items: pageItems, totalPages } = getPaginatedPosts(
    postsForGrid,
    currentPage,
    BLOG_ITEMS_PER_PAGE
  );

  const queryForPagination: Record<string, string> = {};
  if (category && category !== "all") queryForPagination.category = category;
  if (q) queryForPagination.q = q;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { label: "Home", href: "/" },
              { label: "Blogs" },
            ])
          ),
        }}
      />

      <BlogHeroSection />

      {/* Toolbar: categories + search */}
      <section className="bg-section-white home-on-light">
        <Container>
          <BlogToolbar activeCategory={category} initialQuery={q} />
        </Container>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="bg-section-white home-on-light">
          <Container>
            <SectionHeaderV2 title="Featured Post" align="left" />
            <BlogCard post={featured} featured variant="article" />
          </Container>
        </section>
      )}

      {/* Latest posts grid */}
      <section className={cn("home-section-spacing bg-section-white home-on-light", !featured && "!pt-0")}>
        <Container>
          <div className="flex items-center justify-between mb-6">
            <div className="text-h3 font-semibold text-neutral-900">
              {isDefaultView ? 
              <SectionHeaderV2 title="Latest Post" align="left" />
              
              : `${filtered.length} Result${filtered.length === 1 ? "" : "s"}`}
            </div>
            {!isDefaultView && (
              <Link
                href="/blog"
                className="text-body-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                Clear filters
              </Link>
            )}
          </div>

          {pageItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {pageItems.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  variant="article"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-section-beige bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-h4 font-semibold text-neutral-900">
                No posts found
              </p>
              <p className="mt-2 text-body text-neutral-500">
                Try a different keyword or browse another category.
              </p>
              <Link
                href="/blog"
                className="inline-block mt-5 text-body-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                Clear filters
              </Link>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/blog"
              query={queryForPagination}
              variant="light"
              className="pt-8"
            />
          )}
        </Container>
      </section>

      {/* CTA */}
      <RevealGroup>
        <CTABandV2Decorative
          title="Ready to Begin Your Journey?"
          subtitle="Explore our programs or connect with Rodha Buddy for personalised guidance."
          backgroundImage="/assets/images/background/cta background image.JPG"
          decorativeImage="/assets/images/about us/award.png"
          primaryAction={{ label: "Explore Courses", href: "/category/cat" }}
          secondaryAction={{
            label: "Ask Rodha Buddy",
            href: EXTERNAL_URLS.rodhaBuddy,
          }}
          className="reveal-child reveal-delay-1"
        />
      </RevealGroup>
    </>
  );
}
