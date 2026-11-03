import Link from "next/link";
import { Flame, HelpCircle, Users } from "lucide-react";

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
  const total = list?.total ?? forums.length;
  const page = list?.page ?? 1;
  const totalPages = Math.max(1, list?.totalPages ?? 1);
  const showPagination = totalPages > 1;

  return (
    <section className="space-y-5 pb-10">
      <div className="forum-hero relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/20 via-bg-surface to-bg-secondary p-5 sm:p-6">
        <div
          className="pointer-events-none absolute -right-8 -top-8 size-44 rounded-full bg-orange-500/25 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-10 -left-6 size-36 rounded-full bg-orange-500/15 blur-2xl"
          aria-hidden
        />
        <div className="relative min-w-0">
          <h1 className="text-h2 font-semibold tracking-tight text-text-primary sm:text-h1">
            Discussion Forum
          </h1>
          <p className="mt-1.5 max-w-xl text-body-sm leading-relaxed text-text-muted">
            Choose a forum to browse questions and topics.
          </p>
          {total > 0 ? (
            <p className="mt-3 text-caption text-text-muted">
              {formatForumCount(total)} {total === 1 ? "forum" : "forums"}
              {showPagination ? ` · Page ${page} of ${totalPages}` : null}
            </p>
          ) : null}
        </div>
      </div>

      {forums.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-default bg-bg-surface px-4 py-10 text-center text-body-sm text-text-muted">
          {list
            ? "No discussion forums yet."
            : "Discussion forums are unavailable right now."}
        </div>
      ) : (
        <>
          <ul className="grid gap-3 sm:grid-cols-2 lg:gap-4">
            {forums.map((forum) => {
              const lastActive = forum.lastActivityAt
                ? formatForumRelativeTime(forum.lastActivityAt)
                : "";

              return (
                <li key={forum.id}>
                  <Link
                    href={`/discussion-forum/${forum.slug}`}
                    className="group flex items-start gap-3.5 rounded-2xl border border-border-default bg-bg-surface p-3.5 transition-all duration-200 hover:border-orange-500/40 hover:bg-bg-surface/90 sm:gap-4 sm:p-4"
                  >
                    <ForumGroupIcon
                      name={forum.name}
                      src={forum.iconUrl}
                      className="size-12 shrink-0 sm:size-14"
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-body font-semibold tracking-tight text-text-primary transition-colors duration-200 group-hover:text-orange-400 sm:text-body-lg">
                        {forum.name}
                      </h2>
                      {forum.description ? (
                        <p className="mt-0.5 line-clamp-2 text-body-sm leading-relaxed text-text-muted">
                          {forum.description}
                        </p>
                      ) : null}
                      <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <Users
                            className="size-3.5 text-orange-400"
                            aria-hidden
                          />
                          {formatForumCount(forum.memberCount)} members
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <HelpCircle
                            className="size-3.5 text-orange-400"
                            aria-hidden
                          />
                          {formatForumCount(forum.topicCount)}{" "}
                          {forum.topicCount === 1 ? "question" : "questions"}
                        </span>
                        {lastActive ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Flame
                              className="size-3.5 text-orange-400"
                              aria-hidden
                            />
                            Active {lastActive}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {showPagination || total > 0 ? (
            <div className="space-y-2 border-t border-border-subtle pt-4">
              <p className="text-center text-caption text-text-dimmed">
                Showing {forums.length} of {formatForumCount(total)} forum
                {total === 1 ? "" : "s"}
              </p>
              {showPagination ? (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  basePath="/discussion-forum"
                />
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
