import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
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

  const metaItems = [
    item.timeSpentLabel
      ? { label: "Time Spent", value: item.timeSpentLabel }
      : null,
    item.validTillLabel
      ? { label: "Valid Till", value: item.validTillLabel }
      : null,
    item.language ? { label: "Language", value: item.language } : null,
  ].filter(Boolean) as { label: string; value: string }[];

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
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--account-accent)]">
          {item.tag}
        </span>

        <h3 className="line-clamp-2 font-montserrat text-[15px] font-semibold leading-snug text-[var(--account-text)]">
          <Link href={item.href} className="hover:text-[var(--account-accent)]">
            {item.title}
          </Link>
        </h3>

        {metaItems.length > 0 ? (
          <dl className="space-y-1 text-[12px] text-[var(--account-text-muted)]">
            {metaItems.map((meta) => (
              <div key={meta.label} className="flex gap-1.5">
                <dt className="shrink-0 font-medium text-[var(--account-text-secondary)]">
                  {meta.label}:
                </dt>
                <dd className="min-w-0 truncate">{meta.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-auto space-y-2">
          {item.progressLabel ? (
            <p className="text-[12px] text-[var(--account-text-muted)]">
              {item.progressLabel}
            </p>
          ) : null}
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
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
