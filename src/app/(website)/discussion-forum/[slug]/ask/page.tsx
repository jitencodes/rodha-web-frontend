import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { DiscussionForumAsk } from "@/components/sections/discussion-forum/DiscussionForumAsk";
import { getAccessToken } from "@/lib/auth/server-session";
import { buildPageMetadata } from "@/lib/seo";

import { forumBasePath, loadDoubtForum } from "../load-forum";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const forum = await loadDoubtForum(slug);

  return buildPageMetadata({
    title: `Ask a Question — ${forum.name}`,
    description: `Start a discussion in ${forum.name}.`,
    path: `${forumBasePath(forum.slug)}/ask`,
  });
}

export default async function DiscussionForumAskPage({ params }: PageProps) {
  const { slug } = await params;
  const forum = await loadDoubtForum(slug);
  const base = forumBasePath(forum.slug);
  const accessToken = await getAccessToken();

  if (!accessToken) {
    redirect(`/login?next=${encodeURIComponent(`${base}/ask`)}`);
  }

  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <DiscussionForumAsk
          basePath={base}
          forum={forum}
          groupId={forum.id}
          forumSlug={forum.slug}
          canAsk
          loginHref={`/login?next=${encodeURIComponent(`${base}/ask`)}`}
        />
      </Container>
    </section>
  );
}
