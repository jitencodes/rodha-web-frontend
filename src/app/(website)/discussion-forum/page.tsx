import { Suspense } from "react";
import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { DiscussionForumsDirectory } from "@/components/sections/discussion-forum/DiscussionForumsDirectory";
import { getDoubtForums } from "@/lib/api/modules/groups/service";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Discussion Forum — Rodha",
  description:
    "Browse Rodha discussion forums, then open a forum to see questions and topics.",
  path: "/discussion-forum",
});

type DiscussionForumPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function DiscussionForumPage({
  searchParams,
}: DiscussionForumPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const list = await getDoubtForums({ page, limit: 20 });

  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <Suspense
          fallback={
            <div className="rounded-2xl border border-border-default bg-bg-surface px-4 py-16 text-center text-body-sm text-text-muted">
              Loading forums…
            </div>
          }
        >
          <DiscussionForumsDirectory list={list} />
        </Suspense>
      </Container>
    </section>
  );
}
