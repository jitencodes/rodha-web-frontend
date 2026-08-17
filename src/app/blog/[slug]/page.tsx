import { Container } from "@/components/layout/Container";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  return {
    title: `${slug} — Rodha Blog`,
    description: `Read this article on Rodha Blog.`,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  return (
    <article className="home-section-spacing-lg bg-section-beige home-on-light">
      <Container>
        <p className="section-header-badge text-body-sm uppercase tracking-wider text-white bg-[#F06B23] rounded-full px-4 py-1.5 w-fit font-semibold mb-5">
          Blog
        </p>
        <h1 className="home-light-heading text-h1 md:text-hero font-bold">
          Blog Post
        </h1>
        <p className="home-light-body mt-4 text-body-lg">Article: {slug}</p>
        <p className="home-light-muted mt-8">Full blog post coming soon...</p>
      </Container>
    </article>
  );
}
