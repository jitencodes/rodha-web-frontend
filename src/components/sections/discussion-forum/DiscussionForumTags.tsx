"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import {
  DiscussionForumShell,
  type DiscussionForumHero,
} from "@/components/sections/discussion-forum/DiscussionForumShell";
import { Input } from "@/components/ui/Input";
import {
  formatForumCount,
  type ForumPreviewQuestion,
  type ForumPreviewTagInfo,
} from "@/data/discussion-forum";
import { cn } from "@/lib/utils";

type TagSort = "popular" | "name" | "new";

const SORT_TABS: Array<{ id: TagSort; label: string }> = [
  { id: "popular", label: "Popular" },
  { id: "name", label: "Name" },
  { id: "new", label: "New" },
];

function tagsFromQuestions(questions: ForumPreviewQuestion[]): ForumPreviewTagInfo[] {
  const counts = new Map<string, number>();
  for (const question of questions) {
    for (const tag of question.tags) {
      const name = tag.trim().toLowerCase();
      if (!name) continue;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries()).map(([name, questionCount]) => ({
    name,
    description: "",
    questionCount,
    askedToday: 0,
    askedThisWeek: 0,
  }));
}

function sortTags(items: ForumPreviewTagInfo[], sort: TagSort): ForumPreviewTagInfo[] {
  const copy = [...items];
  if (sort === "name") return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "new") return copy.sort((a, b) => b.askedThisWeek - a.askedThisWeek);
  return copy.sort((a, b) => b.questionCount - a.questionCount);
}

type DiscussionForumTagsProps = {
  basePath?: string;
  forum?: DiscussionForumHero;
  questions?: ForumPreviewQuestion[];
  tags?: ForumPreviewTagInfo[];
};

export function DiscussionForumTags({
  basePath = "/discussion-forum",
  forum,
  questions = [],
  tags,
}: DiscussionForumTagsProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<TagSort>("popular");

  const sourceTags = useMemo(
    () => (tags?.length ? tags : tagsFromQuestions(questions)),
    [tags, questions]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = q
      ? sourceTags.filter(
          (tag) =>
            tag.name.toLowerCase().includes(q) ||
            tag.description.toLowerCase().includes(q)
        )
      : sourceTags;
    return sortTags(base, sort);
  }, [search, sort, sourceTags]);

  return (
    <DiscussionForumShell basePath={basePath} forum={forum}>
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

      {filtered.length ? (
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
              {tag.description ? (
                <p className="mt-3 line-clamp-3 flex-1 text-body-sm leading-relaxed text-text-muted">
                  {tag.description}
                </p>
              ) : null}
              <p className="mt-3 text-caption text-text-dimmed">
                {formatForumCount(tag.questionCount)} question
                {tag.questionCount === 1 ? "" : "s"}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-border-default bg-bg-secondary px-4 py-12 text-center text-body-sm text-text-muted">
          {sourceTags.length
            ? "No tags match this filter."
            : "No tags in this forum yet."}
        </div>
      )}
    </DiscussionForumShell>
  );
}
