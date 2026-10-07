import Link from "next/link";

type AccountCourseDetailHeaderProps = {
  title: string;
  language?: string;
  categoryLabel?: string;
  openCourseHref?: string;
};

export function AccountCourseDetailHeader({
  title,
  language,
  categoryLabel,
  openCourseHref,
}: AccountCourseDetailHeaderProps) {
  const chips = [categoryLabel, language].filter(Boolean);

  return (
    <div className="mb-6">
      <div className="mb-4">
        <Link
          href="/account/courses?tab=continue"
          className="text-[13px] font-medium text-[var(--account-accent)] hover:underline"
        >
          ← Back to Continue Watching
        </Link>
      </div>

      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
              {title}
            </h1>
            {chips.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center rounded-full border border-[var(--account-border)] bg-[var(--account-surface)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--account-text-muted)]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {openCourseHref ? (
          <a
            href={openCourseHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Start Learning
          </a>
        ) : null}
      </header>
    </div>
  );
}
