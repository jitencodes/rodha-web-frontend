"use client";

import { useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Home } from "lucide-react";

import { ForumGroupIcon } from "@/components/sections/discussion-forum/ForumGroupIcon";
import {
  FORUM_GROUPS_PATH,
  FORUM_HOME_PATH,
  forumGroupPath,
  forumGroupSlugFromPathname,
} from "@/lib/forum/paths";
import type { ForumSidebarGroup } from "@/lib/forum/sidebar";
import { cn } from "@/lib/utils";

type ForumSidebarNavProps = {
  groups: ForumSidebarGroup[];
  /** Total doubt-forum groups from the API (drives "See More"). */
  totalGroups: number;
  onNavigate?: () => void;
  className?: string;
};

const linkBase =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-body-sm font-medium transition-colors duration-200";
const linkIdle = "text-neutral-800 hover:bg-orange-50 hover:text-orange-600";
const linkActive = "bg-orange-100/70 font-semibold text-orange-600";

/** Left forum navigation: Feed and the (always open) Groups list. */
export function ForumSidebarNav({
  groups,
  totalGroups,
  onNavigate,
  className,
}: ForumSidebarNavProps) {
  const pathname = usePathname();
  const groupsHeadingId = useId();
  const activeGroupSlug = forumGroupSlugFromPathname(pathname);
  const isHome = pathname === FORUM_HOME_PATH;
  const isGroupsPage = pathname === FORUM_GROUPS_PATH;

  return (
    <nav aria-label="Discussion forum" className={cn("space-y-5", className)}>
      <Link
        href={FORUM_HOME_PATH}
        onClick={onNavigate}
        aria-current={isHome ? "page" : undefined}
        className={cn(linkBase, "py-2.5 text-body", isHome ? linkActive : linkIdle)}
      >
        <Home className="size-5 shrink-0 text-orange-500" aria-hidden />
        Feed
      </Link>

      <div>
        <h2 id={groupsHeadingId} className="px-3 py-1.5 text-h4 font-bold text-neutral-900">
          Groups
        </h2>

        <ul aria-labelledby={groupsHeadingId} className="mt-2 space-y-1">
            {groups.map((group) => {
              const isActive = activeGroupSlug === group.slug;
              return (
                <li key={group.id}>
                  <Link
                    href={forumGroupPath(group.slug)}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(linkBase, isActive ? linkActive : linkIdle)}
                  >
                    <ForumGroupIcon name={group.name} src={group.iconUrl} className="size-8 rounded-lg" />
                    <span className="min-w-0 flex-1 truncate">{group.name}</span>
                  </Link>
                </li>
              );
            })}
            {groups.length === 0 ? (
              <li className="px-3 py-2 text-caption text-neutral-500">No groups yet.</li>
            ) : null}
        </ul>

        {totalGroups > groups.length ? (
          <Link
            href={FORUM_GROUPS_PATH}
            onClick={onNavigate}
            aria-current={isGroupsPage ? "page" : undefined}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-body-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50 hover:text-orange-700"
          >
            See More
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
