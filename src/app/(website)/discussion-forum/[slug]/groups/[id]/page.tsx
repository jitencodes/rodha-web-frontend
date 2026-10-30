import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { DiscussionForumSpaceDetail } from "@/components/sections/discussion-forum/DiscussionForumSpaceDetail";
import {
  getGroupChatById,
  getGroupMembership,
  getGroupMessages,
  getGroupTopics,
} from "@/lib/api/modules/groups/service";
import {
  toForumPreviewQuestions,
  toForumSpaceItem,
  toForumSpaceMembers,
  toForumSpaceMessages,
} from "@/lib/api/modules/groups/ui";
import {
  getAccessToken,
  getSessionUser,
} from "@/lib/auth/server-session";
import { buildPageMetadata } from "@/lib/seo";

import { forumBasePath, loadDoubtForum } from "../../load-forum";

type PageProps = {
  params: Promise<{ slug: string; id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, id } = await params;
  const forum = await loadDoubtForum(slug);
  const token = await getAccessToken();
  const spaceId = Number.parseInt(id, 10);
  const membership =
    token && Number.isFinite(spaceId)
      ? await getGroupMembership(spaceId, token)
      : null;

  return buildPageMetadata({
    title: membership?.isMember
      ? `${membership.groupName} — Groups`
      : `Group — ${forum.name}`,
    description: membership?.isMember
      ? `Group chat in ${forum.name}.`
      : `Group chat in ${forum.name}.`,
    path: `${forumBasePath(forum.slug)}/groups/${id}`,
  });
}

export default async function DiscussionForumGroupDetailPage({ params }: PageProps) {
  const { slug, id } = await params;
  const forum = await loadDoubtForum(slug);
  const base = forumBasePath(forum.slug);
  const [token, sessionUser] = await Promise.all([
    getAccessToken(),
    getSessionUser(),
  ]);

  if (!token) {
    redirect(`/login?next=${encodeURIComponent(`${base}/groups/${id}`)}`);
  }

  const spaceId = Number.parseInt(id, 10);
  if (!Number.isFinite(spaceId)) notFound();

  // Membership check first — non-members never load chat/messages.
  const membership = await getGroupMembership(spaceId, token);
  if (!membership?.isMember) notFound();

  const [group, topics, messageList] = await Promise.all([
    getGroupChatById(spaceId, token),
    getGroupTopics(forum.id, { page: 1, limit: 20 }),
    getGroupMessages({
      groupId: spaceId,
      page: 1,
      limit: 50,
      accessToken: token,
    }),
  ]);

  if (!group) notFound();

  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <DiscussionForumSpaceDetail
          space={toForumSpaceItem(group)}
          kind="groups"
          basePath={base}
          forum={forum}
          questions={toForumPreviewQuestions(topics?.items ?? [])}
          messages={toForumSpaceMessages(messageList?.items ?? [], group.id)}
          members={toForumSpaceMembers(group.members)}
          currentUserId={sessionUser?.id ?? null}
          initiallyArchived={membership.isArchived}
        />
      </Container>
    </section>
  );
}
