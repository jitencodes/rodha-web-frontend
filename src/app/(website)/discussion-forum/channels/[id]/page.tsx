import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { DiscussionForumSpaceDetail } from "@/components/sections/discussion-forum/DiscussionForumSpaceDetail";
import { getForumSpaceById } from "@/data/discussion-forum";
import { getAccessToken } from "@/lib/auth/server-session";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const space = getForumSpaceById(Number.parseInt(id, 10), "channels");
  return buildPageMetadata({
    title: space ? `${space.name} — Channels` : "Channel — Rodha Forum",
    description: space?.description ?? "Rodha forum channel.",
    path: `/discussion-forum/channels/${id}`,
  });
}

export default async function DiscussionForumChannelDetailPage({ params }: PageProps) {
  const token = await getAccessToken();
  if (!token) {
    const { id } = await params;
    redirect(`/login?next=${encodeURIComponent(`/discussion-forum/channels/${id}`)}`);
  }

  const { id } = await params;
  const spaceId = Number.parseInt(id, 10);
  if (!Number.isFinite(spaceId)) notFound();

  const space = getForumSpaceById(spaceId, "channels");
  if (!space) notFound();

  return (
    <section className="bg-bg-primary pb-8 pt-6 md:pt-8">
      <Container>
        <DiscussionForumSpaceDetail space={space} kind="channels" />
      </Container>
    </section>
  );
}
