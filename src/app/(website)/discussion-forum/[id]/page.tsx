import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { DiscussionForumDetail } from "@/components/sections/discussion-forum/DiscussionForumDetail";
import { FORUM_PREVIEW_QUESTIONS } from "@/data/discussion-forum";
import { buildPageMetadata } from "@/lib/seo";

type DiscussionForumDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: DiscussionForumDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const questionId = Number.parseInt(id, 10);
  const question = FORUM_PREVIEW_QUESTIONS.find((item) => item.id === questionId);
  if (!question) {
    return buildPageMetadata({
      title: "Question — Rodha Forum",
      description: "Discussion Forum question.",
      path: `/discussion-forum/${id}`,
    });
  }
  return buildPageMetadata({
    title: `${question.title} — Rodha Forum`,
    description: question.excerpt,
    path: `/discussion-forum/${question.id}`,
  });
}

export default async function DiscussionForumDetailPage({
  params,
}: DiscussionForumDetailPageProps) {
  const { id } = await params;
  const questionId = Number.parseInt(id, 10);
  if (!Number.isFinite(questionId)) notFound();

  const exists = FORUM_PREVIEW_QUESTIONS.some((item) => item.id === questionId);
  if (!exists) notFound();

  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <DiscussionForumDetail questionId={questionId} />
      </Container>
    </section>
  );
}
