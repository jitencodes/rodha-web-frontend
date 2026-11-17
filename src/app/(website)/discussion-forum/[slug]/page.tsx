import type { Metadata } from "next";

import { ForumErrorState } from "@/components/sections/discussion-forum/ForumErrorState";
import { ForumGroupIcon } from "@/components/sections/discussion-forum/ForumGroupIcon";
import { ForumPageHeading } from "@/components/sections/discussion-forum/ForumPageHeading";
import { ForumPageLayout } from "@/components/sections/discussion-forum/ForumPageLayout";
import { ForumRightRail } from "@/components/sections/discussion-forum/ForumRightRail";
import { ForumSearchForm } from "@/components/sections/discussion-forum/ForumSearchForm";
import { ForumSortSelect } from "@/components/sections/discussion-forum/ForumSortSelect";
import { ForumTopicTable } from "@/components/sections/discussion-forum/ForumTopicTable";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { getGroupTopics } from "@/lib/api/modules/groups/service";
import type { ForumTopicSortBy } from "@/lib/api/modules/groups/types";
import {
  formatForumCount,
  formatForumCountLabel,
  formatForumRelativeTime,
} from "@/lib/forum/format";
import { FORUM_HOME_PATH, forumGroupAskPath, forumGroupPath } from "@/lib/forum/paths";
import { loadGroupRail } from "@/lib/forum/rail";
import { buildPageMetadata } from "@/lib/seo";

import { loadDoubtForum } from "./load-forum";

const PAGE_SIZE = 25;

/** Sort options backed by the live `sort_by` enum of the topics API. */
const SORTS: Record<
  string,
  { label: string; sortBy: ForumTopicSortBy; sortOrder: "asc" | "desc" }
> = {
  latest: { label: "Latest activity", sortBy: "lastActivityAt", sortOrder: "desc" },
  newest: { label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
  discussed: { label: "Most discussed", sortBy: "messageCount", sortOrder: "desc" },
  title: { label: "A–Z", sortBy: "title", sortOrder: "asc" },
};
const DEFAULT_SORT = "latest";
const SORT_OPTIONS = Object.entries(SORTS).map(([value, option]) => ({
  value,
  label: option.label,
}));

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; q?: string; sort?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const forum = await loadDoubtForum(slug);

  return buildPageMetadata({
    title: `${forum.name} — Discussion Forum`,
    description:
      forum.description || `Topics and discussions in ${forum.name} on the Rodha Discussion Forum.`,
    path: forumGroupPath(forum.slug),
  });
}

export default async function DiscussionForumGroupPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam, q, sort: sortParam } = await searchParams;
  const forum = await loadDoubtForum(slug);
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const search = q?.trim() ?? "";
  const sortKey = sortParam && sortParam in SORTS ? sortParam : DEFAULT_SORT;
  const sort = SORTS[sortKey];
  const basePath = forumGroupPath(forum.slug);

  const [topics, rail] = await Promise.all([
    getGroupTopics(forum.id, {
      page,
      limit: PAGE_SIZE,
      search,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    }),
    loadGroupRail(forum.id),
  ]);

  const query: Record<string, string> = {};
  if (search) query.q = search;
  if (sortKey !== DEFAULT_SORT) query.sort = sortKey;
  const lastActive = forum.lastActivityAt ? formatForumRelativeTime(forum.lastActivityAt) : "";

  return (
    <ForumPageLayout
      rightRail={
        <ForumRightRail
          group={{ name: forum.name, slug: forum.slug }}
          latest={rail.latest}
          best={rail.best}
        />
      }
    >
      <Breadcrumb
        variant="light"
        className="mb-3 py-0 md:py-0"
        items={[
          { label: "Forum Home", href: FORUM_HOME_PATH },
          { label: forum.name },
        ]}
      />

      <ForumPageHeading
        title={forum.name}
        description={forum.description || undefined}
        media={<ForumGroupIcon name={forum.name} src={forum.iconUrl} className="size-12 rounded-xl" />}
        meta={
          <>
            {formatForumCountLabel(forum.topicCount, "topic")}
            {forum.memberCount > 0 ? ` · ${formatForumCountLabel(forum.memberCount, "member")}` : null}
            {lastActive ? ` · active ${lastActive}` : null}
          </>
        }
        createHref={forumGroupAskPath(forum.slug)}
      />

      <div className="mt-5 overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-section-beige bg-section-cream px-4 py-3 sm:flex-row sm:items-center">
          <ForumSearchForm
            action={basePath}
            defaultValue={search}
            placeholder={`Search topics in ${forum.name}…`}
            hidden={sortKey !== DEFAULT_SORT ? { sort: sortKey } : undefined}
          />
          <ForumSortSelect
            options={SORT_OPTIONS}
            value={sortKey}
            defaultValue={DEFAULT_SORT}
            basePath={basePath}
            search={search}
          />
        </div>

        {!topics ? (
          <div className="p-4">
            <ForumErrorState retryHref={basePath} />
          </div>
        ) : (
          <>
            {search ? (
              <p className="border-b border-neutral-100 bg-white px-4 py-2 text-caption text-neutral-500">
                {formatForumCount(topics.total)} result{topics.total === 1 ? "" : "s"} for “{search}”
              </p>
            ) : null}
            <ForumTopicTable
              topics={topics.items}
              groupSlug={forum.slug}
              emptyLabel={
                search
                  ? `No topics match “${search}”.`
                  : "No topics yet. Start the first discussion."
              }
            />
          </>
        )}
      </div>

      {topics && topics.totalPages > 1 ? (
        <Pagination
          variant="light"
          className="mt-5"
          currentPage={topics.page}
          totalPages={topics.totalPages}
          basePath={basePath}
          query={query}
        />
      ) : null}
    </ForumPageLayout>
  );
}
