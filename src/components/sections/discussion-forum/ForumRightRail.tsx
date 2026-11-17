import Link from "next/link";
import { ArrowRight, Clock, Flame, MessageSquareText } from "lucide-react";

import type { ForumTopicViewModel } from "@/lib/api/modules/groups/types";
import { formatForumCountLabel, formatForumRelativeTime } from "@/lib/forum/format";
import { forumGroupPath, forumTopicPath } from "@/lib/forum/paths";

type RailGroup = { name: string; slug: string };

type ForumRightRailProps = {
  /** Group the lists are scoped to. Null on the homepage (no cross-group API). */
  group: RailGroup | null;
  latest: ForumTopicViewModel[];
  /** Ranked by the API (`sort_by=messageCount`); never re-ranked client-side. */
  best: ForumTopicViewModel[];
};

const PENDING_FEED_COPY =
  "Shows here once the cross-group discussion feed API is available.";

function RailPanel({
  title,
  icon: Icon,
  moreHref,
  children,
}: {
  title: string;
  icon: typeof Clock;
  moreHref?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
      <header className="flex items-center gap-2.5 border-b border-neutral-100 px-5 py-4">
        <Icon className="size-5 text-orange-500" aria-hidden />
        <h2 className="text-h4 font-bold text-neutral-900">{title}</h2>
      </header>
      {children}
      {moreHref ? (
        <div className="px-5 pb-4 pt-2">
          <Link
            href={moreHref}
            className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
          >
            View More
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      ) : null}
    </section>
  );
}

function RailList({
  topics,
  group,
  metric,
}: {
  topics: ForumTopicViewModel[];
  group: RailGroup;
  metric: "activity" | "replies";
}) {
  if (!topics.length) {
    return <p className="px-5 py-5 text-body-sm text-neutral-500">No topics yet.</p>;
  }

  return (
    <ol className="px-2 pt-1">
      {topics.map((topic) => {
        const stamp = topic.lastPost?.createdAt || topic.lastActivityAt || topic.createdAt;
        const by = topic.lastPost?.authorName ?? topic.author.fullName;
        return (
          <li key={topic.id} className="border-b border-neutral-100 last:border-b-0">
            <Link
              href={forumTopicPath(group.slug, topic.slug)}
              className="group flex gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-orange-50"
            >
              <MessageSquareText className="mt-0.5 size-4 shrink-0 text-orange-500" aria-hidden />
              <span className="min-w-0">
                <span className="line-clamp-2 text-body-sm font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-orange-600 group-hover:underline group-hover:decoration-orange-300 group-hover:underline-offset-2">
                  {topic.title}
                </span>
                <span className="mt-0.5 block truncate text-caption text-neutral-500">
                  {group.name} ·{" "}
                  {metric === "replies"
                    ? formatForumCountLabel(topic.replyCount, "reply", "replies")
                    : `by ${by}`}
                  {stamp ? ` · ${formatForumRelativeTime(stamp)}` : null}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/** Latest Posts + Best Posts (dashboard right rail) from real API data only. */
export function ForumRightRail({ group, latest, best }: ForumRightRailProps) {
  const groupHref = group ? forumGroupPath(group.slug) : undefined;

  return (
    <>
      <RailPanel title="Latest Posts" icon={Clock} moreHref={groupHref}>
        {group ? (
          <RailList topics={latest} group={group} metric="activity" />
        ) : (
          <p className="px-5 py-5 text-body-sm text-neutral-500">{PENDING_FEED_COPY}</p>
        )}
      </RailPanel>

      <RailPanel
        title="Best Posts"
        icon={Flame}
        moreHref={groupHref ? `${groupHref}?sort=discussed` : undefined}
      >
        {group ? (
          <RailList topics={best} group={group} metric="replies" />
        ) : (
          <p className="px-5 py-5 text-body-sm text-neutral-500">{PENDING_FEED_COPY}</p>
        )}
      </RailPanel>
    </>
  );
}
