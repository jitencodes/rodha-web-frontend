import Link from "next/link";
import { MessageSquareText } from "lucide-react";

import { ForumAvatar } from "@/components/sections/discussion-forum/ForumAvatar";
import type { ForumTopicViewModel } from "@/lib/api/modules/groups/types";
import {
  formatForumCount,
  formatForumCountLabel,
  formatForumRelativeTime,
} from "@/lib/forum/format";
import { forumTopicPath } from "@/lib/forum/paths";
import { cn } from "@/lib/utils";

type ForumTopicTableProps = {
  topics: ForumTopicViewModel[];
  groupSlug: string;
  /** Hide the column header row (e.g. very compact embeds). */
  hideHeader?: boolean;
  emptyLabel?: string;
  className?: string;
};

/*
 * Column sets. Likes / Views appear only once the API returns them for at
 * least one row (see docs/discussion-api-gaps.md); never with fake numbers.
 */
const LG_COLUMNS = {
  base: "lg:grid-cols-[minmax(0,1fr)_10.5rem_5rem_8.5rem]",
  one: "lg:grid-cols-[minmax(0,1fr)_10.5rem_5rem_5rem_8.5rem]",
  two: "lg:grid-cols-[minmax(0,1fr)_10.5rem_5rem_5rem_5rem_8.5rem]",
} as const;
const SM_COLUMNS = "sm:grid-cols-[minmax(0,1fr)_4.5rem_8.5rem]";

function formatStamp(iso: string | null | undefined): string {
  return iso ? formatForumRelativeTime(iso) : "";
}

/**
 * Topic table (dashboard design): light header row, subtle alternating rows,
 * square author initials. Hovering a row tints it and highlights the title.
 */
export function ForumTopicTable({
  topics,
  groupSlug,
  hideHeader = false,
  emptyLabel = "No topics yet. Start the first discussion.",
  className,
}: ForumTopicTableProps) {
  const showLikes = topics.some((topic) => topic.likeCount !== null);
  const showViews = topics.some((topic) => topic.viewCount !== null);
  const extraColumns = Number(showLikes) + Number(showViews);
  const lgColumns =
    extraColumns === 2 ? LG_COLUMNS.two : extraColumns === 1 ? LG_COLUMNS.one : LG_COLUMNS.base;
  const rowGrid = cn("sm:grid sm:items-center sm:gap-4", SM_COLUMNS, lgColumns);

  if (!topics.length) {
    return (
      <p className={cn("border-t border-neutral-100 bg-white px-5 py-8 text-center text-body-sm text-neutral-500", className)}>
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className={cn("min-w-0", className)} role="table" aria-label="Topics">
      {!hideHeader ? (
        <div
          role="row"
          className={cn(
            "hidden border-y border-neutral-200/70 bg-[#F7F4F1] px-4 py-2 text-body-sm font-medium text-neutral-600 sm:px-5",
            rowGrid
          )}
        >
          <span role="columnheader">Topic</span>
          <span role="columnheader" className="hidden lg:block">
            Author
          </span>
          {showLikes ? (
            <span role="columnheader" className="hidden text-center lg:block">
              Likes
            </span>
          ) : null}
          <span role="columnheader" className="text-center">
            Replies
          </span>
          {showViews ? (
            <span role="columnheader" className="hidden text-center lg:block">
              Views
            </span>
          ) : null}
          <span role="columnheader">Last Post</span>
        </div>
      ) : null}

      <ul role="rowgroup">
        {topics.map((topic) => {
          const href = forumTopicPath(groupSlug, topic.slug);
          const created = formatStamp(topic.createdAt);
          const lastPostAt = formatStamp(topic.lastPost?.createdAt);

          return (
            <li
              key={topic.id}
              role="row"
              className={cn(
                "group relative border-b border-neutral-100 px-4 py-2.5 forum-row last:border-b-0 sm:px-5",
                rowGrid
              )}
            >
              <div role="cell" className="flex min-w-0 items-start gap-3">
                <MessageSquareText
                  className="mt-0.5 size-4 shrink-0 text-orange-500"
                  aria-hidden
                />
                <div className="min-w-0">
                  {/* The title link stretches over the row so the whole row is clickable. */}
                  <Link
                    href={href}
                    className="break-words text-body-sm font-semibold leading-snug text-neutral-900 transition-colors after:absolute after:inset-0 group-hover:text-orange-600 group-hover:underline group-hover:decoration-orange-300 group-hover:underline-offset-2 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-orange-400"
                  >
                    {topic.title}
                  </Link>
                  {/* Below lg the author sits under the title; phones also get counts. */}
                  <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-caption text-neutral-500 lg:hidden">
                    <ForumAvatar
                      name={topic.author.fullName}
                      src={topic.author.profilePicturePath}
                      className="size-5 rounded-[4px]"
                      textClassName="text-[9px]"
                    />
                    <span className="font-medium text-neutral-700">{topic.author.fullName}</span>
                    {created ? <span>· {created}</span> : null}
                    <span className="sm:hidden">
                      · {formatForumCountLabel(topic.replyCount, "reply", "replies")}
                      {topic.lastPost ? ` · last by ${topic.lastPost.authorName} ${lastPostAt}` : null}
                    </span>
                  </div>
                </div>
              </div>

              <div role="cell" className="hidden min-w-0 items-center gap-2.5 lg:flex">
                <ForumAvatar
                  name={topic.author.fullName}
                  src={topic.author.profilePicturePath}
                  className="size-7 rounded-md"
                  textClassName="text-[10px]"
                />
                <p className="truncate text-body-sm font-medium text-neutral-800" title={created || undefined}>
                  {topic.author.fullName}
                </p>
              </div>

              {showLikes ? (
                <div
                  role="cell"
                  className="hidden text-center text-body-sm tabular-nums text-neutral-800 lg:block"
                >
                  {topic.likeCount !== null ? formatForumCount(topic.likeCount) : "—"}
                </div>
              ) : null}

              <div
                role="cell"
                className="hidden text-center text-body-sm tabular-nums text-neutral-800 sm:block"
              >
                {formatForumCount(topic.replyCount)}
              </div>

              {showViews ? (
                <div
                  role="cell"
                  className="hidden text-center text-body-sm tabular-nums text-neutral-800 lg:block"
                >
                  {topic.viewCount !== null ? formatForumCount(topic.viewCount) : "—"}
                </div>
              ) : null}

              <div role="cell" className="hidden min-w-0 sm:block">
                {topic.lastPost ? (
                  <>
                    <p className="truncate text-caption font-medium text-neutral-800">
                      by {topic.lastPost.authorName}
                    </p>
                    <p className="text-caption text-neutral-500">{lastPostAt}</p>
                  </>
                ) : (
                  <p className="text-caption text-neutral-400">No replies yet</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
