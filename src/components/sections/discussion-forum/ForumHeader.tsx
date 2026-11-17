"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  GraduationCap,
  Headset,
  LayoutDashboard,
  Menu,
  Search,
  User,
  Users,
  X,
} from "lucide-react";

import { ForumSidebarNav } from "@/components/sections/discussion-forum/ForumSidebarNav";
import { AUTH_LOGGED_IN_COOKIE_NAME } from "@/lib/auth/session-cookie";
import type { ForumSidebarGroup } from "@/lib/forum/sidebar";
import {
  FORUM_GROUPS_PATH,
  FORUM_HOME_PATH,
  forumGroupPath,
  forumGroupSlugFromPathname,
  forumLoginHref,
} from "@/lib/forum/paths";
import { cn } from "@/lib/utils";

type ForumHeaderProps = {
  isLoggedIn: boolean;
  sidebarGroups: ForumSidebarGroup[];
  totalGroups: number;
};

function readLoggedInCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(`${AUTH_LOGGED_IN_COOKIE_NAME}=1`));
}

/** The auth cookie has no change event; it is re-read on every render. */
function subscribeNoop(): () => void {
  return () => {};
}

const navTab =
  "relative inline-flex h-10 items-center gap-2 rounded-lg px-3.5 text-body font-semibold transition-colors";
// Active tab: tinted pill + orange underline on the header's bottom edge.
const navTabActive =
  "bg-orange-500/15 text-orange-400 after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-orange-500";
const navTabIdle = "text-white/85 hover:bg-white/10 hover:text-white";

/**
 * Discussion Forum header (no website nav): logo | Feed · Groups | search |
 * Rodha Buddy · Sign In · Join Now. Search scope follows the page: inside a
 * group it searches that group's topics; elsewhere it searches groups. There
 * is no cross-group topic search API yet.
 */
export function ForumHeader({
  isLoggedIn: isLoggedInProp,
  sidebarGroups,
  totalGroups,
}: ForumHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const cookieLoggedIn = useSyncExternalStore(
    subscribeNoop,
    readLoggedInCookie,
    () => false
  );
  const isLoggedIn = isLoggedInProp || cookieLoggedIn;
  const currentQuery = searchParams.get("q") ?? "";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPath, setDrawerPath] = useState(pathname);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Close the drawer after navigation (render-time sync, no effect).
  if (drawerPath !== pathname) {
    setDrawerPath(pathname);
    setDrawerOpen(false);
  }

  const groupSlug = forumGroupSlugFromPathname(pathname);
  const isHome = pathname === FORUM_HOME_PATH;
  const isGroups = pathname === FORUM_GROUPS_PATH;
  const searchAction = groupSlug ? forumGroupPath(groupSlug) : FORUM_GROUPS_PATH;
  const searchPlaceholder = groupSlug
    ? "Search topics in this group…"
    : "Search discussion groups…";

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen]);

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    router.push(value ? `${searchAction}?q=${encodeURIComponent(value)}` : searchAction);
  };

  return (
    <>
      <header className="site-header sticky top-0 z-40 border-b border-white/10 !bg-[#191919]">
        <div className="mx-auto flex h-14 max-w-[1536px] items-center gap-2 px-4 md:h-16 md:gap-4 lg:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 md:hidden"
            aria-label="Open forum navigation"
            aria-expanded={drawerOpen}
            aria-controls="forum-nav-drawer"
          >
            <Menu className="size-5" aria-hidden />
          </button>

          <Link href="/" className="flex shrink-0 items-center" aria-label="Rodha home">
            <Image
              src="/assets/images/rodha-logo.webp"
              alt="Rodha"
              width={120}
              height={32}
              className="h-7 w-auto md:h-8"
            />
          </Link>
          <span className="hidden h-8 w-px bg-white/20 md:block" aria-hidden />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Forum">
            <Link
              href={FORUM_HOME_PATH}
              aria-current={isHome ? "page" : undefined}
              className={cn(navTab, isHome ? navTabActive : navTabIdle)}
            >
              <GraduationCap className="size-5" aria-hidden />
              Feed
            </Link>
            <Link
              href={FORUM_GROUPS_PATH}
              aria-current={isGroups ? "page" : undefined}
              className={cn(navTab, isGroups ? navTabActive : navTabIdle)}
            >
              <Users className="size-5" aria-hidden />
              Groups
            </Link>
          </nav>

          <form
            role="search"
            onSubmit={onSearch}
            className="hidden min-w-0 max-w-xl flex-1 sm:block lg:mx-4"
          >
            <label htmlFor="forum-header-search" className="sr-only">
              {searchPlaceholder}
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/70"
                aria-hidden
              />
              <input
                key={`${pathname}?${currentQuery}`}
                id="forum-header-search"
                type="search"
                name="q"
                defaultValue={currentQuery}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-xl border border-white/10 bg-white/10 pl-10 pr-3 text-body-sm text-white placeholder:text-white/60 focus:border-orange-400/70 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-orange-500/25"
              />
            </div>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
            <a
              href="/api/buddy/auto-login"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-orange-500 px-4 text-body-sm font-semibold text-orange-400 transition-colors hover:bg-orange-500/10 hover:text-orange-300 lg:inline-flex"
            >
              <Headset className="size-4" aria-hidden />
              Rodha Buddy
            </a>
            {isLoggedIn ? (
              <Link
                href="/account/dashboard"
                className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-body-sm font-semibold text-white transition-colors hover:bg-white/10 hover:text-orange-300"
              >
                <LayoutDashboard className="size-4" aria-hidden />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href={forumLoginHref(pathname)}
                  className="inline-flex h-10 items-center gap-2 rounded-lg px-2.5 text-body-sm font-semibold text-white transition-colors hover:bg-white/10 hover:text-orange-300"
                >
                  <User className="size-4" aria-hidden />
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary hidden h-10 items-center rounded-lg px-4 text-body-sm font-semibold sm:inline-flex"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Phone search row */}
        <form role="search" onSubmit={onSearch} className="px-4 pb-2.5 sm:hidden">
          <label htmlFor="forum-header-search-mobile" className="sr-only">
            {searchPlaceholder}
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/70"
              aria-hidden
            />
            <input
              key={`${pathname}?${currentQuery}`}
              id="forum-header-search-mobile"
              type="search"
              name="q"
              defaultValue={currentQuery}
              placeholder={searchPlaceholder}
              className="h-9 w-full rounded-xl border border-white/10 bg-white/10 pl-9 pr-3 text-body-sm text-white placeholder:text-white/60 focus:border-orange-400/70 focus:outline-none"
            />
          </div>
        </form>
      </header>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close forum navigation"
            tabIndex={-1}
            onClick={() => setDrawerOpen(false)}
          />
          <div
            id="forum-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Forum navigation"
            className="absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col bg-section-cream shadow-2xl"
          >
            <div className="flex h-14 items-center justify-between bg-[#191919] px-4">
              <span className="text-body font-semibold text-white">Discussion Forum</span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close forum navigation"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <ForumSidebarNav
                groups={sidebarGroups}
                totalGroups={totalGroups}
                onNavigate={() => setDrawerOpen(false)}
              />
              <a
                href="/api/buddy/auto-login"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex h-10 items-center justify-center gap-2 rounded-lg border border-orange-500 text-body-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50"
              >
                <Headset className="size-4" aria-hidden />
                Rodha Buddy
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
