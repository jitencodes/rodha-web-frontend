import Link from "next/link";
import { HelpCircle, Sparkles, Users } from "lucide-react";

import { ForumGroupIcon } from "@/components/sections/discussion-forum/ForumGroupIcon";
import { Pagination } from "@/components/ui/Pagination";
import { formatForumCount, formatForumRelativeTime } from "@/lib/forum/format";
import type { DoubtForumListViewModel } from "@/lib/api/modules/groups/types";

type DiscussionForumsDirectoryProps = {
  list: DoubtForumListViewModel | null;
};

export function DiscussionForumsDirectory({
  list,
}: DiscussionForumsDirectoryProps) {
  const forums = list?.items ?? [];
  const forumCount = forums.length;

  return (
    <section className="space-y-5 pb-10">
      <div className="forum-hero relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/20 via-bg-surface to-bg-secondary p-5 sm:p-6">
        <div
          className="pointer-events-none absolute -right-8 -top-8 size-44 rounded-full bg-orange-500/25 blur-2xl"
          aria-hidden
        />
        <div className="relative min-w-0">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-caption font-medium text-orange-400">
            <Sparkles className="size-3" aria-hidden />
            Community
          </p>
          <h1 className="mt-2 text-h2 font-semibold tracking-tight text-text-primary sm:text-h1">
            Discussion Forum
          </h1>
          <p className="mt-1.5 max-w-xl text-body-sm leading-relaxed text-text-muted">
            Choose a forum to browse questions and topics.
          </p>
          {forumCount > 0 ? (
            <p className="mt-3 text-caption text-text-muted">
              {formatForumCount(forumCount)}{" "}
              {forumCount === 1 ? "forum" : "forums"}
            </p>
          ) : null}
        </div>
      </div>

      {forums.length === 0 ? (
        <div className="rounded-2xl border border-border-default bg-bg-surface px-4 py-16 text-center text-body-sm text-text-muted">
          {list
            ? "No discussion forums yet."
            : "Discussion forums are unavailable right now."}
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {forums.map((forum) => {
            const lastActive = forum.lastActivityAt
              ? formatForumRelativeTime(forum.lastActivityAt)
              : "";

            return (
              <li key={forum.id}>
                <Link
                  href={`/discussion-forum/${forum.slug}`}
                  className="group flex h-full gap-4 rounded-2xl border border-border-default bg-bg-surface p-4 transition-colors duration-200 hover:border-orange-500/35 sm:p-5"
                >
                  <ForumGroupIcon name={forum.name} src={forum.iconUrl} />
                  <div className="min-w-0">
                    <h2 className="text-body-lg font-semibold tracking-tight text-text-primary transition-colors duration-200 group-hover:text-orange-400">
                      {forum.name}
                    </h2>
                    {forum.description ? (
                      <p className="mt-1 line-clamp-2 text-body-sm leading-relaxed text-text-muted">
                        {forum.description}
                      </p>
                    ) : null}
                    <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-caption text-text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="size-3.5 text-orange-400" aria-hidden />
                        {formatForumCount(forum.memberCount)} members
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <HelpCircle className="size-3.5 text-orange-400" aria-hidden />
                        {formatForumCount(forum.topicCount)}{" "}
                        {forum.topicCount === 1 ? "question" : "questions"}
                      </span>
                      {lastActive ? <span>Active {lastActive}</span> : null}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {list && list.totalPages > 1 ? (
        <Pagination
          currentPage={list.page}
          totalPages={list.totalPages}
          basePath="/discussion-forum"
        />
      ) : null}
    </section>
  );
}
