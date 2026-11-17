import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { ForumGroupIcon } from "@/components/sections/discussion-forum/ForumGroupIcon";
import type { DoubtForumViewModel } from "@/lib/api/modules/groups/types";
import { formatForumCount, formatForumRelativeTime } from "@/lib/forum/format";
import { forumGroupPath } from "@/lib/forum/paths";
import { cn } from "@/lib/utils";

type ForumGroupListProps = {
  groups: DoubtForumViewModel[];
  emptyLabel?: string;
  className?: string;
};

/** Compact group rows (alternating white / beige): icon, name, description, counts. */
export function ForumGroupList({
  groups,
  emptyLabel = "No groups found.",
  className,
}: ForumGroupListProps) {
  if (!groups.length) {
    return (
      <p className={cn("bg-white px-4 py-8 text-center text-body-sm text-neutral-500", className)}>
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className={cn("min-w-0", className)}>
      {groups.map((group) => {
        const lastActive = group.lastActivityAt
          ? formatForumRelativeTime(group.lastActivityAt)
          : "";
        return (
          <li
            key={group.id}
            className="forum-row border-b border-neutral-100 last:border-b-0"
          >
            <Link
              href={forumGroupPath(group.slug)}
              className="group flex items-center gap-3 px-4 py-3 sm:px-5"
            >
              <ForumGroupIcon name={group.name} src={group.iconUrl} className="size-10 rounded-lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-body-sm font-semibold text-neutral-900 transition-colors group-hover:text-orange-600 group-hover:underline group-hover:decoration-orange-300 group-hover:underline-offset-2">
                  {group.name}
                </p>
                {group.description ? (
                  <p className="line-clamp-2 text-caption text-neutral-600">{group.description}</p>
                ) : null}
                <p className="mt-0.5 text-caption text-neutral-500 sm:hidden">
                  {formatForumCount(group.topicCount)} topics
                  {lastActive ? ` · active ${lastActive}` : null}
                </p>
              </div>
              <div className="hidden w-20 shrink-0 text-center sm:block">
                <p className="text-body-sm font-semibold tabular-nums text-neutral-800">
                  {formatForumCount(group.topicCount)}
                </p>
                <p className="text-caption text-neutral-500">Topics</p>
              </div>
              <div className="hidden w-20 shrink-0 text-center md:block">
                <p className="text-body-sm font-semibold tabular-nums text-neutral-800">
                  {formatForumCount(group.memberCount)}
                </p>
                <p className="text-caption text-neutral-500">Members</p>
              </div>
              <div className="hidden w-28 shrink-0 lg:block">
                <p className="text-caption text-neutral-500">Last activity</p>
                <p className="text-caption font-medium text-neutral-700">{lastActive || "—"}</p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-neutral-400" aria-hidden />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
