"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Search, SearchX, X } from "lucide-react";

import type {
  SearchEntityType,
  SearchResultViewModel,
  SearchScope,
  WebsiteQuickLink,
} from "@/lib/api/modules/search/types";
import { SEARCH_ENTITY_FILTERS } from "@/lib/api/modules/search/types";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn, isExternalHref } from "@/lib/utils";

interface GlobalSearchDialogProps {
  open: boolean;
  onClose: () => void;
  scope: SearchScope;
  quickLinks: WebsiteQuickLink[];
  variant?: "dark" | "light";
}

type EntityFilter = "all" | SearchEntityType;

interface SearchOutcome {
  /** `${entityType}::${query}` — which request these results answer. */
  key: string;
  entityType: EntityFilter;
  items: SearchResultViewModel[];
  unavailable: boolean;
  errorMessage: string;
}

/** Debounce while typing; filter-tab switches fetch right away. */
const TYPING_DEBOUNCE_MS = 300;
const SKELETON_ROWS = 5;

function outcomeKey(entityType: EntityFilter, query: string) {
  return `${entityType}::${query}`;
}

/**
 * Mounts the dialog body only while open, so query, filter and cached results
 * reset on close without effect-driven state resets.
 */
export function GlobalSearchDialog(props: GlobalSearchDialogProps) {
  if (!props.open) return null;
  return <GlobalSearchDialogBody {...props} />;
}

function GlobalSearchDialogBody({
  onClose,
  scope,
  quickLinks,
  variant = "dark",
}: GlobalSearchDialogProps) {
  const [query, setQuery] = useState("");
  const [entityType, setEntityType] = useState<EntityFilter>("all");
  /** Successful responses for this session, keyed by filter + query. */
  const [cache, setCache] = useState<Record<string, SearchOutcome>>({});
  /** Most recent response (including failures), used for stale display. */
  const [latest, setLatest] = useState<SearchOutcome | null>(null);
  const lastQueryRef = useRef("");
  const isLight = variant === "light";
  const trimmed = query.trim();
  const currentKey = outcomeKey(entityType, trimmed);
  const isCached = Boolean(cache[currentKey]);
  const outcome = cache[currentKey] ?? latest;

  // Results are "pending" the moment the query or filter changes, not only once
  // the debounced request starts — this keeps a stale "No results" from flashing.
  const isPending = Boolean(trimmed) && outcome?.key !== currentKey;
  const visibleOutcome = trimmed ? outcome : null;
  // While typing within the same filter, keep the previous list (dimmed) for
  // continuity; switching filters shows a shimmer since the list will differ.
  const showStaleResults =
    isPending &&
    visibleOutcome !== null &&
    visibleOutcome.entityType === entityType &&
    visibleOutcome.items.length > 0;

  useEffect(() => {
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
  }, [onClose]);

  useEffect(() => {
    if (!trimmed) return;

    const queryChanged = lastQueryRef.current !== trimmed;
    lastQueryRef.current = trimmed;
    if (isCached) return;

    const key = outcomeKey(entityType, trimmed);

    const controller = new AbortController();
    const timer = window.setTimeout(
      async () => {
        const params = new URLSearchParams({
          q: trimmed,
          scope,
          page: "1",
          limit: "10",
        });
        if (entityType !== "all") params.set("entityTypes", entityType);

        let next: SearchOutcome;
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
          next = {
            key,
            entityType,
            items: Array.isArray(data.items) ? data.items : [],
            unavailable: Boolean(data.unavailable),
            errorMessage:
              data.ok === false && !data.unavailable
                ? data.error || "Search is unavailable."
                : "",
          };
          if (data.ok !== false) {
            const ok = next;
            setCache((current) => ({ ...current, [key]: ok }));
          }
        } catch (error) {
          if ((error as { name?: string }).name === "AbortError") return;
          next = {
            key,
            entityType,
            items: [],
            unavailable: false,
            errorMessage: "Search is unavailable.",
          };
        }
        if (!controller.signal.aborted) setLatest(next);
      },
      queryChanged ? TYPING_DEBOUNCE_MS : 0
    );

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, entityType, scope, isCached]);

  const filterIdle = isLight
    ? "border-[var(--account-border)] text-[var(--account-text-muted)] hover:border-orange-300 hover:text-[var(--account-text)]"
    : "border-white/15 text-white/70 hover:border-white/35 hover:text-white";

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
        <div className="relative flex items-center gap-3 border-b border-inherit px-4 py-3">
          {isPending ? (
            <Loader2
              className="size-5 shrink-0 animate-spin text-orange-500"
              strokeWidth={1.75}
              aria-hidden
            />
          ) : (
            <Search className="size-5 shrink-0 opacity-60" strokeWidth={1.75} aria-hidden />
          )}
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
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="shrink-0 cursor-pointer rounded-md px-2 py-1 text-xs font-medium opacity-60 transition-opacity hover:opacity-100"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md opacity-70 transition hover:opacity-100",
              isLight ? "hover:bg-[var(--account-nav-hover)]" : "hover:bg-white/10"
            )}
            aria-label="Close search"
          >
            <X className="size-4" />
          </button>

          {/* Indeterminate progress bar while a request is in flight. */}
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 -bottom-px h-0.5 overflow-hidden transition-opacity duration-200",
              isPending ? "opacity-100" : "opacity-0"
            )}
          >
            <span className="search-progress-bar block h-full w-1/3 bg-orange-500" />
          </span>
        </div>

        <div
          className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
          role="tablist"
          aria-label="Filter search results"
        >
          {SEARCH_ENTITY_FILTERS.map((filter) => {
            const active = entityType === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setEntityType(filter.value)}
                className={cn(
                  "shrink-0 cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/60",
                  active ? "border-orange-500 bg-orange-500 text-white" : filterIdle
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto px-2 pb-3"
          aria-live="polite"
          aria-busy={isPending}
        >
          {!trimmed ? (
            <QuickLinkList
              title="Quick links"
              links={quickLinks}
              isLight={isLight}
              onNavigate={onClose}
            />
          ) : showStaleResults && visibleOutcome ? (
            <ResultList
              items={visibleOutcome.items}
              isLight={isLight}
              onNavigate={onClose}
              stale
            />
          ) : isPending ? (
            <ResultSkeleton isLight={isLight} />
          ) : visibleOutcome && visibleOutcome.items.length > 0 ? (
            <ResultList items={visibleOutcome.items} isLight={isLight} onNavigate={onClose} />
          ) : (
            <div className="flex flex-col items-center gap-2 px-3 py-10 text-center">
              <SearchX className="size-8 opacity-30" strokeWidth={1.5} aria-hidden />
              <p className="text-sm font-medium opacity-80">
                {visibleOutcome?.unavailable
                  ? "This filter is not available in search yet."
                  : visibleOutcome?.errorMessage || `No results for “${trimmed}”`}
              </p>
              {!visibleOutcome?.unavailable && !visibleOutcome?.errorMessage && (
                <p className="text-xs opacity-50">
                  Try a different keyword
                  {entityType !== "all" ? " or search across all categories." : "."}
                </p>
              )}
              {entityType !== "all" && (
                <button
                  type="button"
                  onClick={() => setEntityType("all")}
                  className="mt-1 cursor-pointer text-xs font-medium text-orange-500 hover:text-orange-600"
                >
                  Search all categories
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultList({
  items,
  isLight,
  onNavigate,
  stale = false,
}: {
  items: SearchResultViewModel[];
  isLight: boolean;
  onNavigate: () => void;
  stale?: boolean;
}) {
  return (
    <ul
      className={cn(
        "space-y-1 transition-opacity duration-200",
        stale && "pointer-events-none opacity-50"
      )}
    >
      {items.map((item) => (
        <li key={item.id}>
          <ResultLink item={item} isLight={isLight} onNavigate={onNavigate} />
        </li>
      ))}
    </ul>
  );
}

function ResultSkeleton({ isLight }: { isLight: boolean }) {
  // The shared shimmer gradient uses dark-surface tokens; swap it on light surfaces.
  const tone = isLight
    ? "![background-image:linear-gradient(90deg,#efefef_25%,#e2e2e2_50%,#efefef_75%)]"
    : undefined;

  return (
    <ul className="space-y-1" aria-label="Loading results">
      {Array.from({ length: SKELETON_ROWS }, (_, i) => (
        <li key={i} className="flex items-center gap-3 px-3 py-2">
          <Skeleton className={cn("size-10 shrink-0 rounded-md", tone)} />
          <span className="min-w-0 flex-1 space-y-2">
            <Skeleton className={cn("h-3.5", i % 2 ? "w-1/2" : "w-2/3", tone)} />
            <Skeleton className={cn("h-3 w-1/3", tone)} />
          </span>
        </li>
      ))}
    </ul>
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
                "block cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors",
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
    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors",
    isLight ? "hover:bg-[var(--account-nav-hover)]" : "hover:bg-white/5"
  );
  const body = (
    <>
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-md bg-black/10",
          // Package images are 16:9.
          item.entityType === "PACKAGE" ? "aspect-video w-16" : "size-10"
        )}
      >
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
