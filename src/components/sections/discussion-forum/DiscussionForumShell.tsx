"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Flame,
  HelpCircle,
  MessageSquare,
  Plus,
  Users,
} from "lucide-react";

import {
  formatForumCount,
  formatForumRelativeTime,
} from "@/data/discussion-forum";
import { AUTH_LOGGED_IN_COOKIE_NAME } from "@/lib/auth/session-cookie";
import { cn } from "@/lib/utils";

export type DiscussionForumHero = {
  name: string;
  description: string;
  memberCount: number;
  topicCount: number;
  lastActivityAt?: string | null;
};

type DiscussionForumShellProps = {
  basePath?: string;
  children: React.ReactNode;
  /** Live forum chrome from groups API when available. */
  forum?: DiscussionForumHero;
  directoryHref?: string;
};

type SpaceMatch = "questions" | "groups" | "channels";

const SPACES: Array<{
  href: string;
  label: string;
  icon: typeof HelpCircle;
  match: SpaceMatch;
  requiresAuth?: boolean;
}> = [
  { href: "", label: "All questions", icon: HelpCircle, match: "questions" },
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

export function DiscussionForumShell({
  basePath = "/discussion-forum",
  children,
  forum,
  directoryHref = "/discussion-forum",
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

  const lastActiveLabel = forum?.lastActivityAt
    ? formatForumRelativeTime(forum.lastActivityAt)
    : "";

  return (
    <section className="space-y-4 pb-10">
      {forum ? (
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
              <Link
                href={directoryHref}
                className="inline-flex items-center gap-1.5 text-caption font-medium text-text-muted transition-colors duration-200 hover:text-orange-400"
              >
                <ArrowLeft className="size-3.5" aria-hidden />
                All forums
              </Link>
              <h1 className="forum-hero-title mt-3 text-h2 font-semibold tracking-tight text-text-primary sm:text-h1">
                {forum.name}
              </h1>
              {forum.description ? (
                <p className="forum-hero-subtitle mt-1.5 max-w-xl text-body-sm leading-relaxed text-text-muted">
                  {forum.description}
                </p>
              ) : null}
              <div className="forum-hero-stats mt-3 flex flex-wrap gap-3 text-caption text-text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-3.5 text-orange-400" aria-hidden />
                  {formatForumCount(forum.memberCount)} members
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <HelpCircle className="size-3.5 text-orange-400" aria-hidden />
                  {formatForumCount(forum.topicCount)} questions
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Flame className="size-3.5 text-orange-400" aria-hidden />
                  {lastActiveLabel ? `Active ${lastActiveLabel}` : "Active today"}
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
      ) : null}

      <div className="mt-5 grid gap-5 xl:grid-cols-[11rem_minmax(0,1fr)]">
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

          {children}
        </div>
      </div>
    </section>
  );
}
