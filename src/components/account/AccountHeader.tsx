"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChartNoAxesCombined,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  UserRound,
} from "lucide-react";
import { useAccountTheme } from "@/components/account/AccountThemeProvider";
import { cn } from "@/lib/utils";
import {
  ACCOUNT_SEARCH_PLACEHOLDER,
  ACCOUNT_USER,
} from "@/data/account/user";

type AccountHeaderProps = {
  onMenuClick: () => void;
};

export function AccountHeader({ onMenuClick }: AccountHeaderProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useAccountTheme();
  const searchRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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
    }
  }

  return (
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
        <label className="relative block w-full min-w-0">
          <span className="sr-only">Search</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--account-text-muted)]"
            strokeWidth={1.75}
          />
          <input
            ref={searchRef}
            type="search"
            placeholder={ACCOUNT_SEARCH_PLACEHOLDER}
            className="h-10 w-full max-w-xl rounded-[var(--account-radius)] border border-[var(--account-input-border)] bg-[var(--account-input-bg)] pr-3 pl-10 text-[14px] text-[var(--account-text)] outline-none placeholder:text-[var(--account-text-muted)] focus:border-[var(--account-accent)] md:pr-20"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-1 text-[11px] text-[var(--account-text-muted)] md:flex">
            <kbd className="rounded border border-[var(--account-border-strong)] bg-[var(--account-bg)] px-1.5 py-0.5 font-sans">
              Ctrl
            </kbd>
            <kbd className="rounded border border-[var(--account-border-strong)] bg-[var(--account-bg)] px-1.5 py-0.5 font-sans">
              K
            </kbd>
          </span>
        </label>
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
            // Keyboard activation reports detail === 0 — expand from viewport center
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

        <button
          type="button"
          className="relative inline-flex size-10 items-center justify-center rounded-[var(--account-radius)] text-[var(--account-text)] hover:bg-[var(--account-nav-hover)]"
          aria-label="Notifications"
        >
          <Bell className="size-5" strokeWidth={1.75} />
          {ACCOUNT_USER.hasUnreadNotifications ? (
            <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-[var(--account-accent)]" />
          ) : null}
        </button>

        <Link
          href="/account/dashboard"
          className="hidden items-center gap-2 rounded-[var(--account-radius)] border border-[var(--account-accent)] px-3 py-2 text-[13px] font-semibold text-[var(--account-accent)] transition-colors hover:bg-[var(--account-nav-active-bg)] sm:inline-flex"
        >
          <ChartNoAxesCombined className="size-4" strokeWidth={1.75} />
          Live Dashboard
        </Link>

        <div ref={profileRef} className="relative">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[var(--account-radius)] px-1.5 py-1.5 hover:bg-[var(--account-nav-hover)] sm:px-2"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            onClick={() => setProfileOpen((v) => !v)}
          >
            <span className="relative size-8 overflow-hidden rounded-full bg-[var(--account-nav-active-bg)]">
              <Image
                src={ACCOUNT_USER.avatarUrl}
                alt=""
                fill
                className="object-cover"
                sizes="32px"
              />
            </span>
            <span className="hidden max-w-[140px] truncate text-[13px] font-medium text-[var(--account-text)] md:inline">
              {ACCOUNT_USER.fullName}
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
                  void handleLogout();
                }}
              >
                <LogOut className="size-4" strokeWidth={1.75} />
                {loggingOut ? "Logging out…" : "Logout"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
