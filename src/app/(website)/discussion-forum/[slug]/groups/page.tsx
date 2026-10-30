import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { DiscussionForumSpacesList } from "@/components/sections/discussion-forum/DiscussionForumSpacesList";
import {
  getGroupChats,
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
    title: `Groups — ${forum.name}`,
    description: `Study groups inside ${forum.name}.`,
    path: `${forumBasePath(forum.slug)}/groups`,
  });
}

export default async function DiscussionForumGroupsPage({ params }: PageProps) {
  const { slug } = await params;
  const forum = await loadDoubtForum(slug);
  const base = forumBasePath(forum.slug);
  const token = await getAccessToken();

  if (!token) {
    redirect(`/login?next=${encodeURIComponent(`${base}/groups`)}`);
  }

  const [groups, topics] = await Promise.all([
    getGroupChats({ page: 1, limit: 20, accessToken: token }),
    getGroupTopics(forum.id, { page: 1, limit: 20 }),
  ]);

  const items = toForumSpaceItems(groups?.items ?? []);

  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <DiscussionForumSpacesList
          title="Groups"
          description="Private study circles and mentor-led group chats for logged-in members."
          items={items}
          kind="groups"
          basePath={base}
          forum={forum}
          questions={toForumPreviewQuestions(topics?.items ?? [])}
        />
      </Container>
    </section>
  );
}
