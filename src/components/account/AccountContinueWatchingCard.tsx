import Image from "next/image";
import Link from "next/link";
import { MoreVertical, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContinueWatchingItem } from "@/lib/account/types";

type AccountContinueWatchingCardProps = {
  item: ContinueWatchingItem;
  className?: string;
};

/** In-progress learning card for dashboard + Courses Continue Watching tab. */
export function AccountContinueWatchingCard({
  item,
  className,
}: AccountContinueWatchingCardProps) {
  const percent =
    item.progressTotal > 0
      ? Math.min(
          100,
          Math.round((item.progressCurrent / item.progressTotal) * 100)
        )
      : 0;

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] shadow-[var(--account-shadow)]",
        className
      )}
    >
      <Link
        href={item.href}
        className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--account-border)]"
        aria-label={`Continue ${item.title}`}
      >
        <Image
          src={item.thumbnail}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <span
          className="absolute bottom-3 left-3 inline-flex size-9 items-center justify-center rounded-full bg-white text-[var(--account-accent)] shadow-sm"
          aria-hidden
        >
          <Play className="size-4 fill-current" strokeWidth={0} />
        </span>
        {item.durationLabel ? (
          <span className="absolute bottom-3 right-3 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {item.durationLabel}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--account-accent)]">
            {item.tag}
          </span>
          <button
            type="button"
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[var(--account-text-muted)] hover:bg-[var(--account-nav-hover)] hover:text-[var(--account-text)]"
            aria-label="More options"
          >
            <MoreVertical className="size-4" strokeWidth={1.75} />
          </button>
        </div>

        <h3 className="line-clamp-2 font-montserrat text-[15px] font-semibold leading-snug text-[var(--account-text)]">
          <Link href={item.href} className="hover:text-[var(--account-accent)]">
            {item.title}
          </Link>
        </h3>

        <div className="mt-auto space-y-2">
          <p className="text-[12px] text-[var(--account-text-muted)]">
            {item.progressLabel}
          </p>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--account-border)]"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${percent}% complete`}
          >
            <div
              className="h-full rounded-full bg-[var(--account-accent)] transition-[width]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Link
            href={item.href}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--account-accent)] px-3 py-1.5 text-[13px] font-semibold text-[var(--account-accent)] transition-colors hover:bg-[var(--account-nav-active-bg)]"
          >
            <Play className="size-3 fill-current" strokeWidth={0} />
            Continue
          </Link>
        </div>
      </div>
    </article>
  );
}
