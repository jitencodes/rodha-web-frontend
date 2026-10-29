import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { DiscussionForumSpaceDetail } from "@/components/sections/discussion-forum/DiscussionForumSpaceDetail";
import { getForumSpaceById } from "@/data/discussion-forum";
import { getGroupTopics } from "@/lib/api/modules/groups/service";
import { toForumPreviewQuestions } from "@/lib/api/modules/groups/ui";
import { getAccessToken } from "@/lib/auth/server-session";
import { buildPageMetadata } from "@/lib/seo";

import { forumBasePath, loadDoubtForum } from "../../load-forum";

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, id } = await params;
  const forum = await loadDoubtForum(slug);
  const space = getForumSpaceById(Number.parseInt(id, 10), "channels");

  return buildPageMetadata({
    title: space ? `${space.name} — Channels` : `Channel — ${forum.name}`,
    description: space?.description ?? `Channel in ${forum.name}.`,
    path: `${forumBasePath(forum.slug)}/channels/${id}`,
  });
}

export default async function DiscussionForumChannelDetailPage({ params }: PageProps) {
  const { slug, id } = await params;
  const forum = await loadDoubtForum(slug);
  const base = forumBasePath(forum.slug);
  const token = await getAccessToken();

  if (!token) {
    redirect(`/login?next=${encodeURIComponent(`${base}/channels/${id}`)}`);
  }

  const spaceId = Number.parseInt(id, 10);
  if (!Number.isFinite(spaceId)) notFound();

  const space = getForumSpaceById(spaceId, "channels");
  if (!space) notFound();

  const topics = await getGroupTopics(forum.id, { page: 1, limit: 20 });

  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <DiscussionForumSpaceDetail
          space={space}
          kind="channels"
          basePath={base}
          forum={forum}
          questions={toForumPreviewQuestions(topics?.items ?? [])}
        />
      </Container>
    </section>
  );
}
