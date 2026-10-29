import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { DiscussionForumTags } from "@/components/sections/discussion-forum/DiscussionForumTags";
import { getGroupTopics } from "@/lib/api/modules/groups/service";
import { toForumPreviewQuestions } from "@/lib/api/modules/groups/ui";
import { buildPageMetadata } from "@/lib/seo";

import { forumBasePath, loadDoubtForum } from "../load-forum";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const forum = await loadDoubtForum(slug);

  return buildPageMetadata({
    title: `Tags — ${forum.name}`,
    description: `Browse tags in ${forum.name}.`,
    path: `${forumBasePath(forum.slug)}/tags`,
  });
}

export default async function DiscussionForumTagsPage({ params }: PageProps) {
  const { slug } = await params;
  const forum = await loadDoubtForum(slug);
  const topics = await getGroupTopics(forum.id, { page: 1, limit: 20 });

  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <DiscussionForumTags
          basePath={forumBasePath(forum.slug)}
          forum={forum}
          questions={toForumPreviewQuestions(topics?.items ?? [])}
        />
      </Container>
    </section>
  );
}
