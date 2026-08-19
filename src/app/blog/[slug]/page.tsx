import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Icon } from "@/components/ui/Icon";
import { BlogCard } from "@/components/cards/BlogCard";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { CTABandV2Decorative } from "@/components/sections/CTABandV2Decorative";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { BlogCategories } from "@/components/sections/blog/BlogCategories";
import { ShareBlog } from "@/components/sections/blog/ShareBlog";
import { breadcrumbJsonLd, blogPostingJsonLd } from "@/lib/structured-data";
import { SITE_URL, EXTERNAL_URLS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import {
  blogPosts,
  getBlogBySlug,
  getBlogCategory,
  getRelatedPosts,
} from "@/data/blog";

// ---------------------------------------------------------------------------


interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    return { title: "Blog — Rodha" };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.metaKeywords,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      images: post.thumbnail
        ? [{ url: `${SITE_URL}${post.thumbnail}` }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const categoryMeta = getBlogCategory(post.category);
  const categoryLabel = categoryMeta?.label ?? post.category;
  const relatedPosts = getRelatedPosts(slug, 4);
  const shareUrl = `${SITE_URL}/blog/${post.slug}`;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blogs", href: "/blog" },
    { label: post.title },
  ];

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbItems)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            blogPostingJsonLd({
              title: post.metaTitle,
              description: post.metaDescription,
              url: `/blog/${post.slug}`,
              image: post.thumbnail,
              publishedDate: post.publishedDate,
            })
          ),
        }}
      />


      {/* Body + sidebar */}
      <section className="home-section-spacing bg-section-white home-on-light">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Main content */}
            <div className="lg:col-span-8">
              {/* Blog header */}
              <section className="bg-section-white home-on-light pb-8 md:pb-10">
                <Container>
                  <Breadcrumb
                    className="pt-0 pb-4 md:pb-5"
                    items={breadcrumbItems}
                  />

                  <div className="max-w-3xl">
                    <Link
                      href={`/blog?category=${post.category}`}
                      className="inline-flex items-center rounded-full bg-orange-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-600 hover:bg-orange-500/20 transition-colors w-fit"
                    >
                      {categoryLabel}
                    </Link>

                    <h1 className="mt-3 text-[28px] sm:text-[34px] md:text-[40px] font-montserrat font-bold leading-[1.15] tracking-tight text-neutral-900">
                      {post.title}
                    </h1>

                    <p className="mt-3 text-body-lg text-neutral-600 leading-relaxed">
                      {post.shortDescription}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-body-sm text-neutral-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon
                          src="/assets/icons/calendar.svg"
                          size={15}
                          className="text-orange-500"
                        />
                        {formatDate(post.publishedDate, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Icon
                          src="/assets/icons/clock.svg"
                          size={15}
                          className="text-orange-500"
                        />
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Hero image */}
                  <div className="relative mt-7 aspect-[16/7] md:aspect-[16/6] w-full overflow-hidden rounded-xl">
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 1280px"
                      fetchPriority="high"
                    />
                  </div>
                </Container>
              </section>
              <div
                className="blog-prose text-body"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-8">
                <div className="rounded-xl border shadow-sm shadow-[#fbdfd1]/50 border-[#fbdfd1] bg-[#fdf8f5a0] p-5">
                  <BlogCategories activeCategory={post.category} />
                </div>
                <div className="rounded-xl border shadow-sm shadow-[#fbdfd1]/50 border-[#fbdfd1] bg-[#fdf8f5a0] p-5">
                  <ShareBlog url={shareUrl} title={post.title} />
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <section className="home-section-spacing bg-section-white !pt-0 home-on-light">
          <Container>
            <SectionHeaderV2
              title="Related Posts"
              viewAllHref="/blog"
              viewAllLabel="View All Blogs"
              align="left"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedPosts.map((rp) => (
                <BlogCard key={rp.id} post={rp} variant="article" />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
        <CTABandV2Decorative
          title="Ready to Take the Next Step?"
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
    </>
  );
}
