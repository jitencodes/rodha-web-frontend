"use client";

import { CalendarClock, Play, Radio } from "lucide-react";
import { useState } from "react";
import type { AccountLiveContentItem } from "@/lib/api/modules/student/courses/mapper";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { withSsoToken } from "@/lib/auth/sso";
import { cn } from "@/lib/utils";

type AccountLiveClassCardProps = {
  item: AccountLiveContentItem;
  className?: string;
};

type SsoApiResponse = {
  ok: boolean;
  graphy?: { ssoToken?: string };
};

/** Live / today's content card for dashboard, continue watching, and course detail. */
export function AccountLiveClassCard({
  item,
  className,
}: AccountLiveClassCardProps) {
  const [opening, setOpening] = useState(false);

  async function handleOpen() {
    if (!item.takeUrl || opening) return;
    setOpening(true);
    try {
      const res = await fetchAuthed("/api/graphy/sso");
      const json = (await res.json()) as SsoApiResponse;
      const token = json.ok ? json.graphy?.ssoToken || "" : "";
      const href = withSsoToken(item.takeUrl, token);
      window.open(href, "_blank", "noopener,noreferrer");
    } catch {
      window.open(item.takeUrl, "_blank", "noopener,noreferrer");
    } finally {
      setOpening(false);
    }
  }

  const status = item.statusLabel || item.liveClassStatus;
  const isLive = (item.liveClassStatus || "").toLowerCase() === "live";

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4 shadow-[var(--account-shadow)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--account-accent)]">
          <Radio className="size-3.5" strokeWidth={2} aria-hidden />
          Live Class
        </span>
        {status ? (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
              isLive
                ? "bg-red-500/15 text-red-600"
                : "bg-[var(--account-nav-hover)] text-[var(--account-text-muted)]"
            )}
          >
            {status}
          </span>
        ) : null}
      </div>

      <h3 className="mt-2 line-clamp-2 font-montserrat text-[15px] font-semibold leading-snug text-[var(--account-text)]">
        {item.title}
      </h3>

      {item.courseTitle ? (
        <p className="mt-1.5 line-clamp-2 text-[12px] text-[var(--account-text-muted)]">
          {item.courseTitle}
        </p>
      ) : null}

      {item.timeRangeLabel ? (
        <p className="mt-3 inline-flex items-start gap-1.5 text-[12px] text-[var(--account-text-secondary)]">
          <CalendarClock
            className="mt-0.5 size-3.5 shrink-0"
            strokeWidth={1.75}
            aria-hidden
          />
          <span>{item.timeRangeLabel}</span>
        </p>
      ) : null}

      <div className="mt-auto flex justify-end pt-4">
        <button
          type="button"
          onClick={() => void handleOpen()}
          disabled={!item.takeUrl || opening}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--account-accent)] px-3 py-1.5 text-[13px] font-semibold text-[var(--account-accent)] transition-colors hover:bg-[var(--account-nav-active-bg)] disabled:opacity-50"
        >
          <Play className="size-3 fill-current" strokeWidth={0} />
          {opening ? "Opening…" : "Join / Watch"}
        </button>
      </div>
    </article>
  );
}
