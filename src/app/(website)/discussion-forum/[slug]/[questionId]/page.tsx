import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { DiscussionForumDetail } from "@/components/sections/discussion-forum/DiscussionForumDetail";
import {
  getGroupTopic,
  getGroupTopicMessages,
  getGroupTopics,
} from "@/lib/api/modules/groups/service";
import {
  toForumPreviewAnswers,
  toForumPreviewQuestion,
  toForumPreviewQuestions,
} from "@/lib/api/modules/groups/ui";
import {
  getAccessToken,
  getSessionUser,
} from "@/lib/auth/server-session";
import { buildPageMetadata } from "@/lib/seo";

import { forumBasePath, loadDoubtForum } from "../load-forum";

export const dynamic = "force-dynamic";

type DiscussionForumDetailPageProps = {
  params: Promise<{ slug: string; questionId: string }>;
};

export async function generateMetadata({
  params,
}: DiscussionForumDetailPageProps): Promise<Metadata> {
  const { slug, questionId } = await params;
  const forum = await loadDoubtForum(slug);
  const topic = await getGroupTopic(forum.slug, questionId, forum.id);
  const base = forumBasePath(forum.slug);

  if (!topic) {
    return buildPageMetadata({
      title: `Question — ${forum.name}`,
      description: `Discussion in ${forum.name}.`,
      path: `${base}/${questionId}`,
    });
  }

  return buildPageMetadata({
    title: `${topic.title} — ${forum.name}`,
    description: topic.excerpt || `Discussion in ${forum.name}.`,
    path: `${base}/${topic.slug}`,
  });
}

export default async function DiscussionForumDetailPage({
  params,
}: DiscussionForumDetailPageProps) {
  const { slug, questionId } = await params;
  const forum = await loadDoubtForum(slug);
  const topicSlug = decodeURIComponent(questionId).trim();
  if (!topicSlug) notFound();

  const [topic, messages, topics] = await Promise.all([
    getGroupTopic(forum.slug, topicSlug, forum.id),
    getGroupTopicMessages({
      groupId: forum.id,
      groupSlug: forum.slug,
      topicSlug,
      page: 1,
      limit: 50,
    }),
    getGroupTopics(forum.id, { page: 1, limit: 20 }),
  ]);

  if (!topic) notFound();

  const [accessToken, sessionUser] = await Promise.all([
    getAccessToken(),
    getSessionUser(),
  ]);
  const detailPath = `${forumBasePath(forum.slug)}/${topic.slug}`;

  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <DiscussionForumDetail
          question={toForumPreviewQuestion(topic)}
          answers={toForumPreviewAnswers(messages?.items ?? [], topic.id)}
          basePath={forumBasePath(forum.slug)}
          forum={forum}
          questions={toForumPreviewQuestions(topics?.items ?? [])}
          groupId={forum.id}
          topicSlug={topic.slug}
          canAnswer={Boolean(accessToken)}
          currentUserId={sessionUser?.id ?? null}
          loginHref={`/login?next=${encodeURIComponent(detailPath)}`}
        />
      </Container>
    </section>
  );
}
