import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DiscussionForumAsk } from "@/components/sections/discussion-forum/DiscussionForumAsk";
import { ForumErrorState } from "@/components/sections/discussion-forum/ForumErrorState";
import { ForumPageLayout } from "@/components/sections/discussion-forum/ForumPageLayout";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getDoubtForums } from "@/lib/api/modules/groups/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { FORUM_ASK_PATH, FORUM_HOME_PATH, forumLoginHref } from "@/lib/forum/paths";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Create Topic — Rodha Discussion Forum",
  description: "Start a new discussion in any Rodha forum group.",
  path: FORUM_ASK_PATH,
});

type PageProps = {
  searchParams: Promise<{ group?: string }>;
};

/** Create Topic from the forum home: pick a group, then post. */
export default async function DiscussionForumAskPage({ searchParams }: PageProps) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect(forumLoginHref(FORUM_ASK_PATH));
  }

  const { group } = await searchParams;
  // API max page size is 100; enough for the group picker.
  const list = await getDoubtForums({ page: 1, limit: 100, sortBy: "name", sortOrder: "asc" });
  const groups = (list?.items ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
  }));
  const initial = groups.find((item) => item.slug === group);

  return (
    <ForumPageLayout>
      <Breadcrumb
        variant="light"
        className="mb-3 py-0 md:py-0"
        items={[{ label: "Forum Home", href: FORUM_HOME_PATH }, { label: "Create Topic" }]}
      />
      {list ? (
        <DiscussionForumAsk
          groups={groups}
          initialGroupId={initial?.id}
          cancelHref={FORUM_HOME_PATH}
        />
      ) : (
        <ForumErrorState
          title="We couldn't load the groups"
          retryHref={FORUM_ASK_PATH}
        />
      )}
    </ForumPageLayout>
  );
}
