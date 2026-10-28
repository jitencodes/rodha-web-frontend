import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { DiscussionForumSpacesList } from "@/components/sections/discussion-forum/DiscussionForumSpacesList";
import { FORUM_PREVIEW_CHANNELS } from "@/data/discussion-forum";
import { getAccessToken } from "@/lib/auth/server-session";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Channels — Rodha Forum",
  description: "Topic channels for announcements, mocks, and DILR on Rodha Discussion Forum.",
  path: "/discussion-forum/channels",
});

export default async function DiscussionForumChannelsPage() {
  const token = await getAccessToken();
  if (!token) {
    redirect(`/login?next=${encodeURIComponent("/discussion-forum/channels")}`);
  }

  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <DiscussionForumSpacesList
          title="Channels"
          description="Topic channels for announcements, mock analysis, and section practice."
          items={FORUM_PREVIEW_CHANNELS}
          kind="channels"
        />
      </Container>
    </section>
  );
}
