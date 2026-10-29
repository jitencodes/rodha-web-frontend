import { Suspense } from "react";
import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { DiscussionForumFeed } from "@/components/sections/discussion-forum/DiscussionForumFeed";
import { getGroupTopics } from "@/lib/api/modules/groups/service";
import { toForumPreviewQuestions } from "@/lib/api/modules/groups/ui";
import { buildPageMetadata } from "@/lib/seo";

import { forumBasePath, loadDoubtForum } from "./load-forum";

type DiscussionForumQuestionsPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
}: DiscussionForumQuestionsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const forum = await loadDoubtForum(slug);

  return buildPageMetadata({
    title: `${forum.name} — Discussion Forum`,
    description:
      forum.description ||
      `Questions and topics in ${forum.name} on the Rodha Discussion Forum.`,
    path: forumBasePath(forum.slug),
  });
}

export default async function DiscussionForumQuestionsPage({
  params,
  searchParams,
}: DiscussionForumQuestionsPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const forum = await loadDoubtForum(slug);
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const topics = await getGroupTopics(forum.id, { page, limit: 20 });
  const questions = toForumPreviewQuestions(topics?.items ?? []);

  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <Suspense
          fallback={
            <div className="rounded-2xl border border-border-default bg-bg-surface px-4 py-16 text-center text-body-sm text-text-muted">
              Loading questions…
            </div>
          }
        >
          <DiscussionForumFeed
            basePath={forumBasePath(forum.slug)}
            forum={forum}
            questions={questions}
            page={topics?.page ?? page}
            totalPages={topics?.totalPages ?? 1}
          />
        </Suspense>
      </Container>
    </section>
  );
}
