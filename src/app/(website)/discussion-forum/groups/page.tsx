import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { DiscussionForumSpacesList } from "@/components/sections/discussion-forum/DiscussionForumSpacesList";
import { FORUM_PREVIEW_GROUPS } from "@/data/discussion-forum";
import { getAccessToken } from "@/lib/auth/server-session";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Groups — Rodha Forum",
  description: "Study groups for CAT aspirants on Rodha Discussion Forum.",
  path: "/discussion-forum/groups",
});

export default async function DiscussionForumGroupsPage() {
  const token = await getAccessToken();
  if (!token) {
    redirect(`/login?next=${encodeURIComponent("/discussion-forum/groups")}`);
  }

  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <DiscussionForumSpacesList
          title="Groups"
          description="Private study circles and mentor-led group chats for logged-in members."
          items={FORUM_PREVIEW_GROUPS}
          kind="groups"
        />
      </Container>
    </section>
  );
}
