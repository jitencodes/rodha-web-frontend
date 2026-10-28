import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { DiscussionForumAsk } from "@/components/sections/discussion-forum/DiscussionForumAsk";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Ask a Question — Rodha Forum",
  description: "Start a discussion in the Rodha CAT Open Forum.",
  path: "/discussion-forum/ask",
});

export default function DiscussionForumAskPage() {
  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <DiscussionForumAsk />
      </Container>
    </section>
  );
}
