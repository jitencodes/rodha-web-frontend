"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BookOpen,
  Flame,
  HelpCircle,
  LayoutList,
  Lightbulb,
  MessageSquare,
  Plus,
  Sparkles,
  Tags,
  TrendingUp,
  Users,
} from "lucide-react";

import { ForumAvatar } from "@/components/sections/discussion-forum/ForumAvatar";
import {
  FORUM_PREVIEW_GROUP,
  FORUM_PREVIEW_QUESTIONS,
  FORUM_PREVIEW_TAGS,
  formatForumCount,
} from "@/data/discussion-forum";
import { AUTH_LOGGED_IN_COOKIE_NAME } from "@/lib/auth/session-cookie";
import { cn } from "@/lib/utils";

type DiscussionForumShellProps = {
  basePath?: string;
  children: React.ReactNode;
  hideComposer?: boolean;
};

type SpaceMatch = "questions" | "tags" | "groups" | "channels";

const SPACES: Array<{
  href: string;
  label: string;
  icon: typeof HelpCircle;
  match: SpaceMatch;
  requiresAuth?: boolean;
}> = [
  { href: "", label: "All questions", icon: HelpCircle, match: "questions" },
  { href: "/tags", label: "Tags", icon: Tags, match: "tags" },
  { href: "/groups", label: "Groups", icon: Users, match: "groups", requiresAuth: true },
  {
    href: "/channels",
    label: "Channels",
    icon: MessageSquare,
    match: "channels",
    requiresAuth: true,
  },
];

function readLoggedInCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(`${AUTH_LOGGED_IN_COOKIE_NAME}=1`));
}

function resolveActiveSpace(pathname: string, basePath: string): SpaceMatch {
  if (pathname === `${basePath}/tags` || pathname.startsWith(`${basePath}/tags/`)) {
    return "tags";
  }
  if (pathname === `${basePath}/groups` || pathname.startsWith(`${basePath}/groups/`)) {
    return "groups";
  }
  if (
    pathname === `${basePath}/channels` ||
    pathname.startsWith(`${basePath}/channels/`)
  ) {
    return "channels";
  }
  return "questions";
}

const TOPICS = [
  { label: "Quant", tag: "quant", icon: BookOpen, accent: "text-sky-400" },
  { label: "VARC", tag: "varc", icon: Lightbulb, accent: "text-violet-400" },
  { label: "DILR", tag: "dilr", icon: LayoutList, accent: "text-teal-400" },
  { label: "Mocks", tag: "mocks", icon: Flame, accent: "text-orange-400" },
  { label: "Strategy", tag: "strategy", icon: Sparkles, accent: "text-amber-400" },
] as const;

const TOP_HELPERS = [
  { name: "Mentor — Quant Desk", reputation: 12400, answers: 48 },
  { name: "Priya Nair", reputation: 2650, answers: 22 },
  { name: "Mentor — VARC Desk", reputation: 9800, answers: 31 },
  { name: "Kabir Singh", reputation: 1120, answers: 14 },
];

function ForumTopicsNav({
  basePath,
  activeTag = "",
}: {
  basePath: string;
  activeTag?: string;
}) {
  return (
    <ul className="overflow-hidden rounded-xl border border-border-default bg-bg-surface/60">
      {TOPICS.map((topic, index) => {
        const Icon = topic.icon;
        const isActive = activeTag === topic.tag;
        return (
          <li
            key={topic.tag}
            className={cn(index > 0 && "border-t border-border-subtle")}
          >
            <Link
              href={`${basePath}?tag=${encodeURIComponent(topic.tag)}`}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 text-body-sm transition-colors duration-200",
                isActive
                  ? "bg-orange-500/15 font-medium text-orange-400"
                  : "text-text-muted hover:bg-bg-hover hover:text-text-primary"
              )}
            >
              <Icon
                className={cn(
                  "size-3.5 shrink-0",
                  isActive ? "text-orange-400" : topic.accent
                )}
                aria-hidden
              />
              <span className="flex-1">{topic.label}</span>
              {isActive ? (
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" aria-hidden />
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ForumTopicsNavWithParams({ basePath }: { basePath: string }) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag")?.trim().toLowerCase() || "";
  return <ForumTopicsNav basePath={basePath} activeTag={activeTag} />;
}

export function DiscussionForumShell({
  basePath = "/discussion-forum",
  children,
  hideComposer = false,
}: DiscussionForumShellProps) {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const active = resolveActiveSpace(pathname, basePath);

  useEffect(() => {
    setIsLoggedIn(readLoggedInCookie());
  }, [pathname]);

  const visibleSpaces = useMemo(
    () => SPACES.filter((space) => !space.requiresAuth || isLoggedIn),
    [isLoggedIn]
  );

  const trending = [...FORUM_PREVIEW_QUESTIONS]
    .sort((a, b) => b.voteScore + b.answerCount * 2 - (a.voteScore + a.answerCount * 2))
    .slice(0, 4);

  const popularTags = [...FORUM_PREVIEW_TAGS]
    .sort((a, b) => b.questionCount - a.questionCount)
    .slice(0, 8);

  return (
    <section className="space-y-4 pb-10">
      <div className="forum-hero relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/20 via-bg-surface to-bg-secondary p-5 sm:p-6">
        <div
          className="forum-hero-glow pointer-events-none absolute -right-8 -top-8 size-44 rounded-full bg-orange-500/25 blur-2xl"
          aria-hidden
        />
        <div
          className="forum-hero-glow-secondary pointer-events-none absolute -bottom-10 -left-6 size-36 rounded-full bg-orange-500/15 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="forum-hero-badge inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-caption font-medium text-orange-400">
              <Sparkles className="size-3 animate-pulse" aria-hidden />
              Community space
            </p>
            <h1 className="forum-hero-title mt-2 text-h2 font-semibold tracking-tight text-text-primary sm:text-h1">
              {FORUM_PREVIEW_GROUP.name}
            </h1>
            <p className="forum-hero-subtitle mt-1.5 max-w-xl text-body-sm leading-relaxed text-text-muted">
              {FORUM_PREVIEW_GROUP.description}
            </p>
            <div className="forum-hero-stats mt-3 flex flex-wrap gap-3 text-caption text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3.5 text-orange-400" aria-hidden />
                {formatForumCount(FORUM_PREVIEW_GROUP.memberCount)} members
              </span>
              <span className="inline-flex items-center gap-1.5">
                <HelpCircle className="size-3.5 text-orange-400" aria-hidden />
                {formatForumCount(FORUM_PREVIEW_GROUP.topicCount)} questions
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Flame className="size-3.5 text-orange-400" aria-hidden />
                Active today
              </span>
            </div>
          </div>
          <Link
            href={`${basePath}/ask`}
            className="forum-hero-cta btn-primary btn-primary-premium premium-border-glow glow-accent-orange inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-[6px] px-4 text-body-sm font-semibold"
          >
            <Plus className="size-4" aria-hidden />
            Ask a question
          </Link>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[13rem_minmax(0,1fr)_17rem]">
        <aside className="hidden xl:block">
          <p className="mb-2 px-2 text-caption font-semibold uppercase tracking-wider text-text-dimmed">
            Spaces
          </p>
          <nav className="space-y-0.5" aria-label="Forum spaces">
            {visibleSpaces.map((space) => {
              const Icon = space.icon;
              const isActive = active === space.match;
              return (
                <Link
                  key={space.match}
                  href={`${basePath}${space.href}`}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2.5 py-2 text-body-sm transition-colors duration-200",
                    isActive
                      ? "bg-orange-500/15 font-medium text-orange-400"
                      : "text-text-muted hover:bg-bg-hover hover:text-text-primary"
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {space.label}
                </Link>
              );
            })}
          </nav>

          <p className="mb-2 mt-6 px-2 text-caption font-semibold uppercase tracking-wider text-text-dimmed">
            Topics
          </p>
          <Suspense fallback={<ForumTopicsNav basePath={basePath} />}>
            <ForumTopicsNavWithParams basePath={basePath} />
          </Suspense>
        </aside>

        <div className="min-w-0 overflow-x-clip">
          <div className="mb-3 flex gap-1 overflow-x-auto border-b border-border-default xl:hidden">
            {visibleSpaces.map((space) => {
              const isActive = active === space.match;
              return (
                <Link
                  key={space.match}
                  href={`${basePath}${space.href}`}
                  className={cn(
                    "shrink-0 border-b-2 px-3 py-2 text-body-sm transition-colors duration-200",
                    isActive
                      ? "border-orange-500 font-medium text-orange-400"
                      : "border-transparent text-text-muted"
                  )}
                >
                  {space.label}
                </Link>
              );
            })}
          </div>

          {!hideComposer ? (
            <div className="mb-4">
              <Link
                href={`${basePath}/ask`}
                className="inline-flex max-w-full items-center gap-2 rounded-full border border-orange-500/35 bg-orange-500/10 py-1.5 pr-2.5 pl-1.5 text-body-sm font-medium text-orange-400 transition-colors duration-200 hover:border-orange-500/55 hover:bg-orange-500/15"
              >
                <ForumAvatar name="You" className="size-7" textClassName="text-[10px]" />
                <span className="truncate">Share a doubt</span>
                <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  <Plus className="size-3.5" aria-hidden />
                </span>
              </Link>
            </div>
          ) : null}

          {children}
        </div>

        <aside className="hidden space-y-4 xl:block">
          <div className="rounded-2xl border border-border-default bg-bg-surface p-4">
            <p className="mb-3 flex items-center gap-1.5 text-body-sm font-semibold text-text-primary">
              <TrendingUp className="size-4 text-orange-400" aria-hidden />
              Trending
            </p>
            <ul className="space-y-3">
              {trending.map((q) => (
                <li key={q.id}>
                  <Link
                    href={`${basePath}/${q.id}`}
                    className="block text-body-sm leading-snug text-text-secondary transition-colors duration-200 hover:text-orange-400"
                  >
                    {q.title}
                  </Link>
                  <p className="mt-0.5 text-caption text-text-dimmed">
                    {q.voteScore} votes · {q.answerCount} answers
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border-default bg-bg-surface p-4">
            <p className="mb-3 flex items-center gap-1.5 text-body-sm font-semibold text-text-primary">
              <Flame className="size-4 text-orange-400" aria-hidden />
              Top helpers
            </p>
            <ul className="space-y-3">
              {TOP_HELPERS.map((helper) => (
                <li key={helper.name} className="flex items-center gap-2.5">
                  <ForumAvatar
                    name={helper.name}
                    className="size-8"
                    textClassName="text-[10px]"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-body-sm font-medium text-text-primary">
                      {helper.name}
                    </p>
                    <p className="text-caption text-text-dimmed">
                      {formatForumCount(helper.reputation)} · {helper.answers} answers
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border-default bg-bg-surface p-4">
            <p className="mb-3 text-body-sm font-semibold text-text-primary">Popular tags</p>
            <div className="flex flex-wrap gap-1.5">
              {popularTags.map((tag) => (
                <Link
                  key={tag.name}
                  href={`${basePath}?tag=${encodeURIComponent(tag.name)}`}
                  className="inline-flex items-center rounded-full border border-border-default bg-bg-tertiary px-2.5 py-1 text-caption text-text-secondary transition-colors duration-200 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
