import type { Metadata } from "next";

import { ForumErrorState } from "@/components/sections/discussion-forum/ForumErrorState";
import { ForumGroupList } from "@/components/sections/discussion-forum/ForumGroupList";
import { ForumPageHeading } from "@/components/sections/discussion-forum/ForumPageHeading";
import { ForumPageLayout } from "@/components/sections/discussion-forum/ForumPageLayout";
import { ForumRightRail } from "@/components/sections/discussion-forum/ForumRightRail";
import { ForumSearchForm } from "@/components/sections/discussion-forum/ForumSearchForm";
import { Pagination } from "@/components/ui/Pagination";
import { getDoubtForums } from "@/lib/api/modules/groups/service";
import { formatForumCount } from "@/lib/forum/format";
import { FORUM_ASK_PATH, FORUM_GROUPS_PATH } from "@/lib/forum/paths";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Discussion Groups — Rodha Forum",
  description: "Browse every Rodha discussion group and jump into its topics.",
  path: FORUM_GROUPS_PATH,
});

const PAGE_SIZE = 20;

type PageProps = {
  searchParams: Promise<{ page?: string; q?: string }>;
};

export default async function DiscussionForumGroupsPage({ searchParams }: PageProps) {
  const { page: pageParam, q } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const search = q?.trim() ?? "";

  const list = await getDoubtForums({
    page,
    limit: PAGE_SIZE,
    search,
    sortBy: "name",
    sortOrder: "asc",
  });
  const query: Record<string, string> = search ? { q: search } : {};

  return (
    <ForumPageLayout rightRail={<ForumRightRail group={null} latest={[]} best={[]} />}>
      <ForumPageHeading
        title="Discussion Groups"
        description="Pick a group to browse its topics, or start a new discussion."
        meta={list ? `${formatForumCount(list.total)} groups` : undefined}
        createHref={FORUM_ASK_PATH}
      />

      <div className="mt-5 overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-section-beige bg-section-cream px-4 py-3">
          <ForumSearchForm
            action={FORUM_GROUPS_PATH}
            defaultValue={search}
            placeholder="Search discussion groups…"
          />
        </div>

        {!list ? (
          <div className="p-4">
            <ForumErrorState retryHref={FORUM_GROUPS_PATH} />
          </div>
        ) : (
          <>
            {search ? (
              <p className="border-b border-neutral-100 bg-white px-4 py-2 text-caption text-neutral-500">
                {formatForumCount(list.total)} result{list.total === 1 ? "" : "s"} for “{search}”
              </p>
            ) : null}
            <ForumGroupList
              groups={list.items}
              emptyLabel={search ? `No groups match “${search}”.` : "No discussion groups yet."}
            />
          </>
        )}
      </div>

      {list && list.totalPages > 1 ? (
        <Pagination
          variant="light"
          className="mt-5"
          currentPage={list.page}
          totalPages={list.totalPages}
          basePath={FORUM_GROUPS_PATH}
          query={query}
        />
      ) : null}
    </ForumPageLayout>
  );
}
