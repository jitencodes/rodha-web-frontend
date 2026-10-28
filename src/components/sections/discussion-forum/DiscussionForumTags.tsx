"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { DiscussionForumShell } from "@/components/sections/discussion-forum/DiscussionForumShell";
import { Input } from "@/components/ui/Input";
import {
  FORUM_PREVIEW_TAGS,
  formatForumCount,
  type ForumPreviewTagInfo,
} from "@/data/discussion-forum";
import { cn } from "@/lib/utils";

type TagSort = "popular" | "name" | "new";

const SORT_TABS: Array<{ id: TagSort; label: string }> = [
  { id: "popular", label: "Popular" },
  { id: "name", label: "Name" },
  { id: "new", label: "New" },
];

function sortTags(items: ForumPreviewTagInfo[], sort: TagSort): ForumPreviewTagInfo[] {
  const copy = [...items];
  if (sort === "name") return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "new") return copy.sort((a, b) => b.askedThisWeek - a.askedThisWeek);
  return copy.sort((a, b) => b.questionCount - a.questionCount);
}

type DiscussionForumTagsProps = {
  basePath?: string;
};

export function DiscussionForumTags({
  basePath = "/discussion-forum",
}: DiscussionForumTagsProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<TagSort>("popular");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = q
      ? FORUM_PREVIEW_TAGS.filter(
          (tag) =>
            tag.name.toLowerCase().includes(q) || tag.description.toLowerCase().includes(q)
        )
      : FORUM_PREVIEW_TAGS;
    return sortTags(base, sort);
  }, [search, sort]);

  return (
    <DiscussionForumShell basePath={basePath} hideComposer>
      <div className="mb-1">
        <h2 className="text-h4 font-semibold tracking-tight text-text-primary">Browse tags</h2>
        <p className="mt-1 text-body-sm leading-relaxed text-text-muted">
          Tags help members find the right discussion. Pick a tag to filter questions in the feed.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-dimmed"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter by tag name"
            className="h-10 rounded-full pl-9"
            aria-label="Filter by tag name"
          />
        </div>
        <div className="inline-flex rounded-full border border-border-default bg-bg-tertiary p-0.5">
          {SORT_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSort(item.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-body-sm transition-colors duration-200",
                sort === item.id
                  ? "bg-orange-500 font-medium text-white"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {filtered.map((tag) => (
          <Link
            key={tag.name}
            href={`${basePath}?tag=${encodeURIComponent(tag.name)}`}
            className="group flex flex-col rounded-2xl border border-border-default bg-bg-surface p-4 transition-all duration-200 hover:border-orange-500/35"
          >
            <span className="inline-flex w-fit items-center rounded-full border border-border-default bg-bg-tertiary px-2.5 py-1 text-body-sm font-medium text-text-primary transition-colors duration-200 group-hover:border-orange-500/40 group-hover:bg-orange-500/10 group-hover:text-orange-400">
              {tag.name}
            </span>
            <p className="mt-3 line-clamp-3 flex-1 text-body-sm leading-relaxed text-text-muted">
              {tag.description}
            </p>
            <p className="mt-3 text-caption text-text-dimmed">
              {formatForumCount(tag.questionCount)} questions · {tag.askedToday} today ·{" "}
              {tag.askedThisWeek} this week
            </p>
          </Link>
        ))}
      </div>
    </DiscussionForumShell>
  );
}
