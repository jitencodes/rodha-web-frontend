"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, MessageSquare, Search, Users } from "lucide-react";

import {
  DiscussionForumShell,
  type DiscussionForumHero,
} from "@/components/sections/discussion-forum/DiscussionForumShell";
import { Input } from "@/components/ui/Input";
import {
  formatForumCount,
  formatForumRelativeTime,
  type ForumPreviewQuestion,
  type ForumSpaceItem,
} from "@/data/discussion-forum";
import { cn } from "@/lib/utils";

type DiscussionForumSpacesListProps = {
  title: string;
  description: string;
  items: ForumSpaceItem[];
  kind: "groups" | "channels";
  basePath?: string;
  forum?: DiscussionForumHero;
  questions?: ForumPreviewQuestion[];
};

/** Student list: view only — no add / edit / delete / archive. */
export function DiscussionForumSpacesList({
  title,
  description,
  items,
  kind,
  basePath = "/discussion-forum",
  forum,
  questions,
}: DiscussionForumSpacesListProps) {
  const Icon = kind === "groups" ? Users : MessageSquare;
  const [search, setSearch] = useState("");
  const detailBase = `${basePath}/${kind}`;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <DiscussionForumShell
      basePath={basePath}
      forum={forum}
      questions={questions}
      hideComposer
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-h4 font-semibold tracking-tight text-text-primary">{title}</h2>
          <p className="mt-1 text-body-sm leading-relaxed text-text-muted">{description}</p>
        </div>
        {/* <p className="text-caption text-text-dimmed">
          You can view, reply, and react — editing or deleting is not available.
        </p> */}
      </div>

      <div className="mb-4 relative max-w-md">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-dimmed"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={`Search ${kind}…`}
          className="h-10 rounded-full pl-9"
          aria-label={`Search ${kind}`}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-default bg-bg-surface">
        <div className="hidden grid-cols-[minmax(0,1.4fr)_5rem_7rem_minmax(0,1fr)_5.5rem] gap-3 border-b border-border-subtle px-4 py-2.5 text-caption font-medium text-text-dimmed md:grid">
          <span>{kind === "groups" ? "Group" : "Channel"}</span>
          <span>Members</span>
          <span>Last activity</span>
          <span>Messages</span>
          <span className="text-right">Actions</span>
        </div>

        <ul>
          {filtered.length ? (
            filtered.map((item, index) => (
              <li
                key={item.id}
                className={cn(
                  "grid gap-3 px-4 py-3.5 transition-colors hover:bg-bg-hover/60 md:grid-cols-[minmax(0,1.4fr)_5rem_7rem_minmax(0,1fr)_5.5rem] md:items-center",
                  index > 0 && "border-t border-border-subtle"
                )}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-body-sm font-semibold text-text-primary">
                      {item.name}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-caption text-text-muted">
                      {item.description}
                    </p>
                    <span className="mt-1.5 inline-flex rounded-full bg-accent-green/15 px-2 py-0.5 text-[10px] font-medium text-accent-green md:hidden">
                      Active
                    </span>
                  </div>
                </div>

                <p className="text-body-sm tabular-nums text-text-secondary">
                  <span className="md:hidden text-text-dimmed">Members · </span>
                  {formatForumCount(item.memberCount)}
                </p>

                <p className="text-caption text-text-muted">
                  <span className="md:hidden text-text-dimmed">Active · </span>
                  {formatForumRelativeTime(item.lastActiveAt)}
                </p>

                <p className="truncate text-caption text-text-muted">
                  <span className="md:hidden text-text-dimmed">Msgs · </span>
                  {formatForumCount(item.messageCount)} messages
                </p>

                <div className="flex items-center justify-start gap-1 md:justify-end">
                  <span className="mr-1 hidden rounded-full bg-accent-green/15 px-2 py-0.5 text-[10px] font-medium text-accent-green md:inline">
                    Active
                  </span>
                  <Link
                    href={`${detailBase}/${item.id}`}
                    className="inline-flex size-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-orange-500/10 hover:text-orange-400"
                    aria-label={`View ${item.name}`}
                    title="View"
                  >
                    <Eye className="size-4" />
                  </Link>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-10 text-center text-body-sm text-text-muted">
              No {kind} match your search.
            </li>
          )}
        </ul>
      </div>

      <Link
        href={basePath}
        className="mt-5 inline-flex text-body-sm text-orange-400 transition-colors hover:text-orange-300"
      >
        ← Back to all questions
      </Link>
    </DiscussionForumShell>
  );
}
