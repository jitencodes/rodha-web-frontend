"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { DiscussionForumQuestionCard } from "@/components/sections/discussion-forum/DiscussionForumQuestionCard";
import { DiscussionForumShell } from "@/components/sections/discussion-forum/DiscussionForumShell";
import { Input } from "@/components/ui/Input";
import {
  FORUM_PREVIEW_QUESTIONS,
  type ForumPreviewQuestion,
} from "@/data/discussion-forum";
import { cn } from "@/lib/utils";

type SortTab = "for-you" | "newest" | "active" | "unanswered";

const TABS: Array<{ id: SortTab; label: string }> = [
  { id: "for-you", label: "For you" },
  { id: "newest", label: "Newest" },
  { id: "active", label: "Active" },
  { id: "unanswered", label: "Unanswered" },
];

function sortQuestions(items: ForumPreviewQuestion[], tab: SortTab): ForumPreviewQuestion[] {
  const copy = [...items];
  if (tab === "unanswered") {
    return copy
      .filter((q) => q.answerCount === 0)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  if (tab === "active") {
    return copy.sort((a, b) => +new Date(b.lastActivityAt) - +new Date(a.lastActivityAt));
  }
  if (tab === "for-you") {
    return copy.sort(
      (a, b) => b.voteScore + b.answerCount * 3 - (a.voteScore + a.answerCount * 3)
    );
  }
  return copy.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

type DiscussionForumFeedProps = {
  basePath?: string;
};

export function DiscussionForumFeed({
  basePath = "/discussion-forum",
}: DiscussionForumFeedProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tagFilter = searchParams.get("tag")?.trim() || "";
  const [tab, setTab] = useState<SortTab>("for-you");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let base = FORUM_PREVIEW_QUESTIONS;
    if (tagFilter) {
      base = base.filter((item) =>
        item.tags.some((tag) => tag.toLowerCase() === tagFilter.toLowerCase())
      );
    }
    if (q) {
      base = base.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return sortQuestions(base, tab);
  }, [tab, search, tagFilter]);

  return (
    <DiscussionForumShell basePath={basePath}>
      <div className="mb-4 flex min-w-0 items-center gap-3">
        <div className="relative w-40 shrink-0 sm:w-48 md:w-52">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-dimmed"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search…"
            className="h-10 rounded-full pl-9"
            aria-label="Search the community"
          />
        </div>
        <div className="inline-flex min-w-0 shrink-0 overflow-x-auto rounded-full border border-border-default bg-bg-tertiary p-0.5">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-body-sm transition-colors duration-200",
                tab === item.id
                  ? "bg-orange-500 font-medium text-white"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {tagFilter ? (
        <div className="mb-3 flex items-center gap-2">
          <p className="text-body-sm text-text-muted">Showing questions tagged</p>
          <button
            type="button"
            onClick={() => router.push(basePath)}
            className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-caption font-medium text-orange-400 transition-opacity duration-200 hover:opacity-80"
          >
            {tagFilter}
            <X className="size-3" aria-hidden />
          </button>
        </div>
      ) : null}

      <div className="space-y-3">
        {filtered.length ? (
          filtered.map((question) => (
            <DiscussionForumQuestionCard
              key={question.id}
              question={question}
              basePath={basePath}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border-default bg-bg-secondary px-4 py-12 text-center text-body-sm text-text-muted">
            No posts match this filter. Try another tag or ask a new question.
          </div>
        )}
      </div>
    </DiscussionForumShell>
  );
}
