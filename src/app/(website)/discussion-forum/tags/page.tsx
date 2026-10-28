import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { DiscussionForumTags } from "@/components/sections/discussion-forum/DiscussionForumTags";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Forum Tags — Rodha",
  description: "Browse Discussion Forum tags for CAT Quant, VARC, DILR, mocks, and strategy.",
  path: "/discussion-forum/tags",
});

export default function DiscussionForumTagsPage() {
  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <DiscussionForumTags />
      </Container>
    </section>
  );
}
