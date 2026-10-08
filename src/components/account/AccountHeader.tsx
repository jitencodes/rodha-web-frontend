"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChartNoAxesCombined,
  ChevronDown,
  Headphones,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useAccountTheme } from "@/components/account/AccountThemeProvider";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { getInitials } from "@/lib/initials";
import { getGraphyDashboardUrl } from "@/lib/constants";
import { withSsoToken } from "@/lib/auth/sso";
import { expireSessionClient, isUnauthorizedStatus } from "@/lib/auth/session-expired";
import { cn } from "@/lib/utils";
import { ACCOUNT_SEARCH_PLACEHOLDER } from "@/data/account/user";
import { DEFAULT_CONTENT_TYPE } from "@/lib/account/course-content-filters";

export type AccountHeaderUser = {
  fullName: string;
  avatarUrl: string;
  hasUnreadNotifications?: boolean;
};

type AccountHeaderProps = {
  onMenuClick: () => void;
  user: AccountHeaderUser;
};

export function AccountHeader({ onMenuClick, user }: AccountHeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useAccountTheme();
  const searchRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [graphyPending, setGraphyPending] = useState(false);

  const displayName = user.fullName?.trim() || "Student";
  const avatarUrl = user.avatarUrl?.trim() || "";

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setMobileSearchOpen(true);
        requestAnimationFrame(() => searchRef.current?.focus());
      }
      if (e.key === "Escape" && mobileSearchOpen) {
        setMobileSearchOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileSearchOpen]);

  useEffect(() => {
    if (!profileOpen) return;
    function onPointer(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [profileOpen]);

  useEffect(() => {
    if (!mobileSearchOpen) return;
    function onPointer(e: MouseEvent) {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(e.target as Node)
      ) {
        setMobileSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [mobileSearchOpen]);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
      setConfirmLogout(false);
    }
  }

  function submitSearch(raw?: string) {
    const q = (raw ?? searchValue).trim();
    const params = new URLSearchParams();
    params.set("type", DEFAULT_CONTENT_TYPE);
    params.set("page", "1");
    params.set("limit", "10");
    if (q) params.set("search", q);
    setMobileSearchOpen(false);
    router.push(`/account/content?${params.toString()}`);
  }

  function clearSearch() {
    setSearchValue("");
    requestAnimationFrame(() => searchRef.current?.focus());
  }

  async function openLiveClassroom() {
    if (graphyPending) return;
    setGraphyPending(true);
    try {
      const res = await fetch("/api/graphy/sso");
      if (isUnauthorizedStatus(res.status)) {
        await expireSessionClient();
        return;
      }
      const data = (await res.json()) as {
        ok: boolean;
        graphy?: { ssoToken?: string; ssoUrl?: string };
      };
      if (!res.ok || !data.ok) return;
      const base = getGraphyDashboardUrl();
      const href = withSsoToken(base, data.graphy?.ssoToken);
      if (href) {
        window.open(href, "_blank", "noopener,noreferrer");
      }
    } catch {
      // ignore
    } finally {
      setGraphyPending(false);
    }
  }

  const actionBtnClass =
    "hidden items-center gap-1.5 rounded-[var(--account-radius)] border border-[var(--account-accent)] px-2.5 py-2 text-[12px] font-semibold text-[var(--account-accent)] transition-colors hover:bg-[var(--account-nav-active-bg)] sm:inline-flex lg:px-3 lg:text-[13px]";

  return (
    <>
      <header className="sticky top-0 z-20 flex h-[var(--account-header-height)] shrink-0 items-center gap-3 border-b border-[var(--account-border)] bg-[var(--account-header-bg)] px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-[var(--account-radius)] text-[var(--account-text)] hover:bg-[var(--account-nav-hover)] lg:hidden"
          aria-label="Open navigation"
          aria-controls="account-sidebar"
          onClick={onMenuClick}
        >
          <Menu className="size-5" strokeWidth={1.75} />
        </button>

        <div
          ref={searchWrapRef}
          className={cn(
            "min-w-0 flex-1",
            mobileSearchOpen
              ? "absolute inset-x-0 top-0 z-30 flex h-[var(--account-header-height)] items-center bg-[var(--account-header-bg)] px-4 md:static md:inset-auto md:z-auto md:bg-transparent md:px-0"
              : "max-md:hidden"
          )}
        >
          <form
            className="relative block w-full min-w-0"
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch();
            }}
          >
            <label className="relative block w-full min-w-0">
              <span className="sr-only">Search</span>
              <Search
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--account-text-muted)]"
                strokeWidth={1.75}
              />
              <input
                ref={searchRef}
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={ACCOUNT_SEARCH_PLACEHOLDER}
                className={cn(
                  "h-10 w-full max-w-xl rounded-[var(--account-radius)] border border-[var(--account-input-border)] bg-[var(--account-input-bg)] pl-10 text-[14px] text-[var(--account-text)] outline-none placeholder:text-[var(--account-text-muted)] focus:border-[var(--account-accent)]",
                  "[&::-webkit-search-cancel-button]:appearance-none",
                  searchValue.trim() ? "pr-10 md:pr-24" : "pr-3 md:pr-20"
                )}
              />
              {searchValue.trim() ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute top-1/2 right-3 z-10 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--account-text-muted)] hover:bg-[var(--account-nav-hover)] hover:text-[var(--account-text)] md:right-[4.5rem]"
                  aria-label="Clear search"
                >
                  <X className="size-4" strokeWidth={1.75} />
                </button>
              ) : null}
              <span className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-1 text-[11px] text-[var(--account-text-muted)] md:flex">
                <kbd className="rounded border border-[var(--account-border-strong)] bg-[var(--account-bg)] px-1.5 py-0.5 font-sans">
                  Ctrl
                </kbd>
                <kbd className="rounded border border-[var(--account-border-strong)] bg-[var(--account-bg)] px-1.5 py-0.5 font-sans">
                  K
                </kbd>
              </span>
            </label>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-[var(--account-radius)] text-[var(--account-text)] hover:bg-[var(--account-nav-hover)] md:hidden",
              mobileSearchOpen && "invisible"
            )}
            aria-label="Search"
            aria-expanded={mobileSearchOpen}
            onClick={() => {
              setMobileSearchOpen(true);
              requestAnimationFrame(() => searchRef.current?.focus());
            }}
          >
            <Search className="size-5" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-[var(--account-radius)] text-[var(--account-text)] hover:bg-[var(--account-nav-hover)]"
            aria-label={
              theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
            }
            onClick={(e) => {
              if (e.detail === 0) {
                toggleTheme();
                return;
              }
              toggleTheme({ x: e.clientX, y: e.clientY });
            }}
          >
            {theme === "dark" ? (
              <Sun className="size-5" strokeWidth={1.75} />
            ) : (
              <Moon className="size-5" strokeWidth={1.75} />
            )}
          </button>

          {/* Notifications — hidden for now
          <button
            type="button"
            className="relative inline-flex size-10 items-center justify-center rounded-[var(--account-radius)] text-[var(--account-text)] hover:bg-[var(--account-nav-hover)]"
            aria-label="Notifications"
          >
            <Bell className="size-5" strokeWidth={1.75} />
            {user.hasUnreadNotifications ? (
              <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-[var(--account-accent)]" />
            ) : null}
          </button>
          */}

          <a
            href="/api/buddy/auto-login"
            target="_blank"
            rel="noopener noreferrer"
            className={actionBtnClass}
          >
            <Headphones className="size-4" strokeWidth={1.75} />
            Buddy
          </a>

          {/* Take Test — hidden for now
          <a
            href={getThinkExamUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={actionBtnClass}
          >
            <ClipboardList className="size-4" strokeWidth={1.75} />
            Take Test
          </a>
          */}

          <button
            type="button"
            onClick={() => void openLiveClassroom()}
            disabled={graphyPending}
            className={cn(actionBtnClass, "disabled:opacity-60")}
          >
            <ChartNoAxesCombined className="size-4" strokeWidth={1.75} />
            {graphyPending ? "Opening…" : "Live Classroom"}
          </button>

          <div ref={profileRef} className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[var(--account-radius)] px-1.5 py-1.5 hover:bg-[var(--account-nav-hover)] sm:px-2"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              onClick={() => setProfileOpen((v) => !v)}
            >
              <span className="relative size-8 overflow-hidden rounded-full bg-[var(--account-nav-active-bg)]">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center text-[11px] font-bold text-[var(--account-accent)]">
                    {getInitials(displayName)}
                  </span>
                )}
              </span>
              <span className="hidden max-w-[140px] truncate text-[13px] font-medium text-[var(--account-text)] md:inline">
                {displayName}
              </span>
              <ChevronDown
                className={cn(
                  "hidden size-4 text-[var(--account-text-muted)] transition-transform sm:inline",
                  profileOpen && "rotate-180"
                )}
                strokeWidth={1.75}
              />
            </button>

            {profileOpen ? (
              <div
                role="menu"
                className="absolute top-full right-0 z-50 mt-2 w-48 overflow-hidden rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] py-1 shadow-[var(--account-shadow)]"
              >
                <Link
                  href="/account/profile"
                  role="menuitem"
                  className="flex items-center gap-2 px-3 py-2.5 text-[13px] text-[var(--account-text)] hover:bg-[var(--account-nav-hover)]"
                  onClick={() => setProfileOpen(false)}
                >
                  <UserRound className="size-4" strokeWidth={1.75} />
                  My Profile
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  disabled={loggingOut}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] text-[var(--account-text)] hover:bg-[var(--account-nav-hover)] disabled:opacity-60"
                  onClick={() => {
                    setProfileOpen(false);
                    setConfirmLogout(true);
                  }}
                >
                  <LogOut className="size-4" strokeWidth={1.75} />
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <ConfirmDialog
        open={confirmLogout}
        title="Log out?"
        description="You will need to sign in again to access your account."
        confirmLabel="Log out"
        cancelLabel="Cancel"
        confirming={loggingOut}
        onCancel={() => setConfirmLogout(false)}
        onConfirm={() => void handleLogout()}
      />
    </>
  );
}
