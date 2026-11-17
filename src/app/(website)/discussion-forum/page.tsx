import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ForumErrorState } from "@/components/sections/discussion-forum/ForumErrorState";
import { ForumGroupList } from "@/components/sections/discussion-forum/ForumGroupList";
import { ForumGroupSection } from "@/components/sections/discussion-forum/ForumGroupSection";
import { ForumPageHeading } from "@/components/sections/discussion-forum/ForumPageHeading";
import { ForumPageLayout } from "@/components/sections/discussion-forum/ForumPageLayout";
import { ForumRightRail } from "@/components/sections/discussion-forum/ForumRightRail";
import {
  getDoubtForums,
  getGroupTopics,
} from "@/lib/api/modules/groups/service";
import type { DoubtForumViewModel } from "@/lib/api/modules/groups/types";
import { FORUM_ASK_PATH, FORUM_GROUPS_PATH, FORUM_HOME_PATH } from "@/lib/forum/paths";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Discussion Forum — Rodha",
  description:
    "Ask doubts, share insights, and learn together with the Rodha community.",
  path: FORUM_HOME_PATH,
});

const FEATURED_GROUP_COUNT = 3;
const TOPICS_PER_SECTION = 6;
const MORE_GROUPS_LIMIT = 12;
const GROUP_FETCH_LIMIT = 50;

/**
 * Featured groups: admin-pinned (`isFeatured`, proposed API field) when the
 * backend sends it; until then the most recently active groups with topics.
 */
function pickFeatured(groups: DoubtForumViewModel[]): DoubtForumViewModel[] {
  const pinned = groups.filter((group) => group.isFeatured);
  const pool = pinned.length ? pinned : groups.filter((group) => group.topicCount > 0);
  return pool.slice(0, FEATURED_GROUP_COUNT);
}

export default async function DiscussionForumHomePage() {
  const list = await getDoubtForums({
    page: 1,
    limit: GROUP_FETCH_LIMIT,
    sortBy: "lastActivityAt",
    sortOrder: "desc",
  });

  const groups = list?.items ?? [];
  const featured = pickFeatured(groups);
  const featuredIds = new Set(featured.map((group) => group.id));
  const moreGroups = groups
    .filter((group) => !featuredIds.has(group.id))
    .slice(0, MORE_GROUPS_LIMIT);
  const hasMoreThanShown = (list?.total ?? 0) > featured.length + moreGroups.length;

  const sections = await Promise.all(
    featured.map(async (group) => ({
      group,
      topics:
        (
          await getGroupTopics(group.id, {
            page: 1,
            limit: TOPICS_PER_SECTION,
            sortBy: "lastActivityAt",
            sortOrder: "desc",
          })
        )?.items ?? [],
    }))
  );

  return (
    <ForumPageLayout
      rightRail={<ForumRightRail group={null} latest={[]} best={[]} />}
    >
      <ForumPageHeading
        title="Discussion Forum"
        description="Ask doubts, share insights, and learn together with the Rodha community."
        createHref={FORUM_ASK_PATH}
      />

      {!list ? (
        <ForumErrorState retryHref={FORUM_HOME_PATH} />
      ) : groups.length === 0 ? (
        <p className="mt-5 rounded-xl border border-orange-100 bg-white px-4 py-10 text-center text-body-sm text-neutral-600">
          No discussion groups yet. Check back soon.
        </p>
      ) : (
        <div className="mt-5 space-y-5">
          {sections.map(({ group, topics }) => (
            <ForumGroupSection key={group.id} group={group} topics={topics} />
          ))}

          {moreGroups.length ? (
            <section aria-labelledby="forum-more-groups" className="pt-2">
              <header className="mb-3 flex items-center justify-between gap-3">
                <h2 id="forum-more-groups" className="text-h3 font-bold text-neutral-900">
                  Explore More Groups
                </h2>
                <Link
                  href={FORUM_GROUPS_PATH}
                  className="inline-flex items-center gap-1 text-body-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  All groups
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </header>
              <div className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
                <ForumGroupList groups={moreGroups} />
                {hasMoreThanShown ? (
                  <div className="border-t border-neutral-100 px-5 py-3">
                    <Link
                      href={FORUM_GROUPS_PATH}
                      className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-orange-600 hover:text-orange-700"
                    >
                      See all {list.total} groups
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </ForumPageLayout>
  );
}
