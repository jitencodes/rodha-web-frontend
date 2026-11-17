import Link from "next/link";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

type ForumPageHeadingProps = {
  title: string;
  description?: string;
  /** Leading visual (e.g. group icon). */
  media?: React.ReactNode;
  /** Small stats line under the description. */
  meta?: React.ReactNode;
  /** Create Topic target. Logged-out users are redirected to login by the ask route. */
  createHref?: string;
  createLabel?: string;
  className?: string;
};

/** Page title row (dashboard design): large title + description, Create Topic on the right. */
export function ForumPageHeading({
  title,
  description,
  media,
  meta,
  createHref,
  createLabel = "Create Topic",
  className,
}: ForumPageHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {media}
        <div className="min-w-0">
          <h1 className="text-h2 font-bold tracking-tight text-neutral-900 md:text-[32px] md:leading-tight">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-body leading-relaxed text-neutral-600">
              {description}
            </p>
          ) : null}
          {meta ? <div className="mt-1 text-body-sm text-neutral-500">{meta}</div> : null}
        </div>
      </div>
      {createHref ? (
        <Link
          href={createHref}
          className="btn-primary inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg px-5 text-body-sm font-semibold"
        >
          <Plus className="size-4" aria-hidden />
          {createLabel}
        </Link>
      ) : null}
    </div>
  );
}
