import { Suspense } from "react";
import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { DiscussionForumFeed } from "@/components/sections/discussion-forum/DiscussionForumFeed";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Discussion Forum — Rodha",
  description:
    "CAT Open Forum — ask doubts, share strategies, and learn with Rodha mentors and aspirants.",
  path: "/discussion-forum",
});

export default function DiscussionForumPage() {
  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <Suspense
          fallback={
            <div className="rounded-2xl border border-border-default bg-bg-surface px-4 py-16 text-center text-body-sm text-text-muted">
              Loading forum…
            </div>
          }
        >
          <DiscussionForumFeed />
        </Suspense>
      </Container>
    </section>
  );
}
