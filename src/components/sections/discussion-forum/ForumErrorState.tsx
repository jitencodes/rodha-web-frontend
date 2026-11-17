import { RotateCw } from "lucide-react";

type ForumErrorStateProps = {
  title?: string;
  description?: string;
  /** Same URL; a full reload re-runs the server fetch. */
  retryHref: string;
};

/** Soft-fail panel when a forum API call returns nothing. */
export function ForumErrorState({
  title = "We couldn't load the discussions",
  description = "The forum service didn't respond. Please try again in a moment.",
  retryHref,
}: ForumErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-orange-100 bg-white px-4 py-10 text-center"
    >
      <p className="text-body font-semibold text-neutral-900">{title}</p>
      <p className="mt-1 text-body-sm text-neutral-600">{description}</p>
      <a
        href={retryHref}
        className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-[6px] border border-neutral-300 px-3.5 text-body-sm font-medium text-neutral-700 transition-colors hover:border-orange-400 hover:text-orange-600"
      >
        <RotateCw className="size-4" aria-hidden />
        Try again
      </a>
    </div>
  );
}
