import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DiscussionForumAsk } from "@/components/sections/discussion-forum/DiscussionForumAsk";
import { ForumPageLayout } from "@/components/sections/discussion-forum/ForumPageLayout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getAccessToken } from "@/lib/auth/server-session";
import {
  FORUM_HOME_PATH,
  forumGroupAskPath,
  forumGroupPath,
  forumLoginHref,
} from "@/lib/forum/paths";
import { buildPageMetadata } from "@/lib/seo";

import { loadDoubtForum } from "../load-forum";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const forum = await loadDoubtForum(slug);

  return buildPageMetadata({
    title: `Create Topic — ${forum.name}`,
    description: `Start a discussion in ${forum.name}.`,
    path: forumGroupAskPath(forum.slug),
  });
}

export default async function DiscussionForumGroupAskPage({ params }: PageProps) {
  const { slug } = await params;
  const forum = await loadDoubtForum(slug);
  const accessToken = await getAccessToken();

  if (!accessToken) {
    redirect(forumLoginHref(forumGroupAskPath(forum.slug)));
  }

  return (
    <ForumPageLayout>
      <Breadcrumb
        variant="light"
        className="mb-3 py-0 md:py-0"
        items={[
          { label: "Forum Home", href: FORUM_HOME_PATH },
          { label: forum.name, href: forumGroupPath(forum.slug) },
          { label: "Create Topic" },
        ]}
      />
      <DiscussionForumAsk
        groups={[{ id: forum.id, name: forum.name, slug: forum.slug }]}
        initialGroupId={forum.id}
        cancelHref={forumGroupPath(forum.slug)}
      />
    </ForumPageLayout>
  );
}
