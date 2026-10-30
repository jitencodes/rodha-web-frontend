import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { DiscussionForumSpacesList } from "@/components/sections/discussion-forum/DiscussionForumSpacesList";
import {
  getBroadcastChannels,
  getGroupTopics,
} from "@/lib/api/modules/groups/service";
import {
  toForumPreviewQuestions,
  toForumSpaceItems,
} from "@/lib/api/modules/groups/ui";
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
    title: `Channels — ${forum.name}`,
    description: `Topic channels inside ${forum.name}.`,
    path: `${forumBasePath(forum.slug)}/channels`,
  });
}

export default async function DiscussionForumChannelsPage({ params }: PageProps) {
  const { slug } = await params;
  const forum = await loadDoubtForum(slug);
  const base = forumBasePath(forum.slug);
  const token = await getAccessToken();

  if (!token) {
    redirect(`/login?next=${encodeURIComponent(`${base}/channels`)}`);
  }

  const [channels, topics] = await Promise.all([
    getBroadcastChannels({ page: 1, limit: 20, accessToken: token }),
    getGroupTopics(forum.id, { page: 1, limit: 20 }),
  ]);

  const items = toForumSpaceItems(channels?.items ?? []);

  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <DiscussionForumSpacesList
          title="Channels"
          description="Topic channels for announcements, mock analysis, and section practice."
          items={items}
          kind="channels"
          basePath={base}
          forum={forum}
          questions={toForumPreviewQuestions(topics?.items ?? [])}
        />
      </Container>
    </section>
  );
}
