import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ForumPageLayout } from "@/components/sections/discussion-forum/ForumPageLayout";
import { ForumRightRail } from "@/components/sections/discussion-forum/ForumRightRail";
import { ForumTopicThread } from "@/components/sections/discussion-forum/ForumTopicThread";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  getGroupTopic,
  getGroupTopicThread,
} from "@/lib/api/modules/groups/service";
import {
  toForumPreviewAnswers,
  toForumPreviewQuestion,
} from "@/lib/api/modules/groups/ui";
import { getAccessToken, getSessionUser } from "@/lib/auth/server-session";
import {
  FORUM_HOME_PATH,
  forumGroupAskPath,
  forumGroupPath,
  forumLoginHref,
  forumTopicPath,
} from "@/lib/forum/paths";
import { loadGroupRail } from "@/lib/forum/rail";
import { buildPageMetadata } from "@/lib/seo";

import { loadDoubtForum } from "../load-forum";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string; questionId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, questionId } = await params;
  const forum = await loadDoubtForum(slug);
  const topic = await getGroupTopic(forum.slug, questionId, forum.id);

  if (!topic) {
    return buildPageMetadata({
      title: `Discussion — ${forum.name}`,
      description: `Discussion in ${forum.name}.`,
      path: forumTopicPath(forum.slug, questionId),
    });
  }

  return buildPageMetadata({
    title: `${topic.title} — ${forum.name}`,
    description: topic.excerpt || `Discussion in ${forum.name}.`,
    path: forumTopicPath(forum.slug, topic.slug),
  });
}

export default async function DiscussionForumTopicPage({ params }: PageProps) {
  const { slug, questionId } = await params;
  const forum = await loadDoubtForum(slug);
  const topicSlug = decodeURIComponent(questionId).trim();
  if (!topicSlug) notFound();

  const [accessToken, sessionUser] = await Promise.all([getAccessToken(), getSessionUser()]);

  const [topic, thread, rail] = await Promise.all([
    getGroupTopic(forum.slug, topicSlug, forum.id),
    getGroupTopicThread({
      groupId: forum.id,
      groupSlug: forum.slug,
      topicSlug,
      page: 1,
      limit: 50,
      accessToken: accessToken ?? undefined,
    }),
    loadGroupRail(forum.id),
  ]);

  if (!topic) notFound();

  const topicPath = forumTopicPath(forum.slug, topic.slug);
  const topLevelTotal = thread?.total ?? 0;

  return (
    <ForumPageLayout
      rightRail={
        <ForumRightRail
          group={{ name: forum.name, slug: forum.slug }}
          latest={rail.latest.filter((item) => item.id !== topic.id)}
          best={rail.best.filter((item) => item.id !== topic.id)}
        />
      }
    >
      <Breadcrumb
        variant="light"
        className="mb-3 py-0 md:py-0"
        items={[
          { label: "Forum Home", href: FORUM_HOME_PATH },
          { label: forum.name, href: forumGroupPath(forum.slug) },
          { label: topic.title },
        ]}
      />
      <ForumTopicThread
        topic={toForumPreviewQuestion(topic)}
        initialPosts={toForumPreviewAnswers(thread?.items ?? [], topic.id)}
        totalTopLevel={topLevelTotal}
        groupId={forum.id}
        groupSlug={forum.slug}
        groupName={forum.name}
        canInteract={Boolean(accessToken)}
        currentUserId={sessionUser?.id ?? null}
        loginHref={forumLoginHref(topicPath)}
        signupHref="/signup"
        createTopicHref={forumGroupAskPath(forum.slug)}
      />
    </ForumPageLayout>
  );
}
