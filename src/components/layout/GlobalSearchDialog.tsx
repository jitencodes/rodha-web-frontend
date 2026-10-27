"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

import type {
  SearchEntityType,
  SearchResultViewModel,
  SearchScope,
  WebsiteQuickLink,
} from "@/lib/api/modules/search/types";
import { SEARCH_ENTITY_FILTERS } from "@/lib/api/modules/search/types";
import { cn, isExternalHref } from "@/lib/utils";

interface GlobalSearchDialogProps {
  open: boolean;
  onClose: () => void;
  scope: SearchScope;
  quickLinks: WebsiteQuickLink[];
  variant?: "dark" | "light";
}

export function GlobalSearchDialog({
  open,
  onClose,
  scope,
  quickLinks,
  variant = "dark",
}: GlobalSearchDialogProps) {
  const [query, setQuery] = useState("");
  const [entityType, setEntityType] = useState<"all" | SearchEntityType>("all");
  const [results, setResults] = useState<SearchResultViewModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isLight = variant === "light";
  const trimmed = query.trim();

  useEffect(() => {
    if (!open) {
      setQuery("");
      setEntityType("all");
      setResults([]);
      setUnavailable(false);
      setErrorMessage("");
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !trimmed) {
      setResults([]);
      setUnavailable(false);
      setErrorMessage("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setErrorMessage("");
      const params = new URLSearchParams({
        q: trimmed,
        scope,
        page: "1",
        limit: "10",
      });
      if (entityType !== "all") params.set("entityTypes", entityType);

      try {
        const response = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as {
          ok?: boolean;
          items?: SearchResultViewModel[];
          unavailable?: boolean;
          error?: string;
        };
        if (controller.signal.aborted) return;
        setResults(Array.isArray(data.items) ? data.items : []);
        setUnavailable(Boolean(data.unavailable));
        setErrorMessage(
          data.ok === false && !data.unavailable
            ? data.error || "Search is unavailable."
            : ""
        );
      } catch (error) {
        if ((error as { name?: string }).name === "AbortError") return;
        setResults([]);
        setUnavailable(false);
        setErrorMessage("Search is unavailable.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, trimmed, entityType, scope]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[12vh] sm:pt-[14vh]">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close search"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className={cn(
          "relative flex max-h-[min(720px,80vh)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl",
          isLight
            ? "border-[var(--account-border)] bg-[var(--account-surface)] text-[var(--account-text)]"
            : "border-white/10 bg-[#121212] text-white"
        )}
      >
        <div className="flex items-center gap-3 border-b border-inherit px-4 py-3">
          <Search className="size-5 shrink-0 opacity-60" strokeWidth={1.75} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              scope === "account"
                ? "Search your courses, orders, and content"
                : "Search courses, faculty, resources..."
            }
            className="h-10 w-full bg-transparent text-base outline-none placeholder:opacity-50"
            aria-label="Search"
          />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-md opacity-70 hover:opacity-100"
            aria-label="Close search"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
          {SEARCH_ENTITY_FILTERS.map((filter) => {
            const active = entityType === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setEntityType(filter.value)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1 text-xs font-medium",
                  active
                    ? "border-orange-500 bg-orange-500 text-white"
                    : isLight
                      ? "border-[var(--account-border)] text-[var(--account-text-muted)]"
                      : "border-white/15 text-white/70"
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {!trimmed ? (
            <QuickLinkList
              title="Quick links"
              links={quickLinks}
              isLight={isLight}
              onNavigate={onClose}
            />
          ) : loading && results.length === 0 ? (
            <p className="px-3 py-6 text-sm opacity-60">Searching...</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-6 text-sm opacity-60">
              {unavailable
                ? "This filter is not available in search yet."
                : errorMessage || "No results."}
            </p>
          ) : (
            <ul className="space-y-1">
              {results.map((item) => (
                <li key={item.id}>
                  <ResultLink item={item} isLight={isLight} onNavigate={onClose} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickLinkList({
  title,
  links,
  isLight,
  onNavigate,
}: {
  title: string;
  links: WebsiteQuickLink[];
  isLight: boolean;
  onNavigate: () => void;
}) {
  return (
    <div className="px-2 py-2">
      <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide opacity-50">
        {title}
      </p>
      <ul className="grid gap-1 sm:grid-cols-2">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm",
                isLight ? "hover:bg-[var(--account-nav-hover)]" : "hover:bg-white/5"
              )}
            >
              <span className="block font-medium">{link.label}</span>
              <span className="block text-xs opacity-50">{link.href}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultLink({
  item,
  isLight,
  onNavigate,
}: {
  item: SearchResultViewModel;
  isLight: boolean;
  onNavigate: () => void;
}) {
  const className = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2",
    isLight ? "hover:bg-[var(--account-nav-hover)]" : "hover:bg-white/5"
  );
  const body = (
    <>
      <span className="relative size-10 shrink-0 overflow-hidden rounded-md bg-black/10">
        {item.imageUrl ? (
          // Search thumbnails come from many hosts; a plain img avoids the image optimizer allowlist.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt="" className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-[10px] font-semibold opacity-60">
            {item.entityType.slice(0, 2)}
          </span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{item.title}</span>
        <span className="block truncate text-xs opacity-50">{item.pathLabel}</span>
      </span>
    </>
  );

  if (item.external || isExternalHref(item.href)) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onNavigate}
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {body}
    </Link>
  );
}
