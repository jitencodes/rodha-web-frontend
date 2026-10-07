import {
  completionLabel,
  contentTypeLabel,
} from "@/lib/account/course-content-filters";
import type { AccountCourseContentItem } from "@/lib/api/modules/student/courses/mapper";
import { cn } from "@/lib/utils";

type AccountCourseContentCardProps = {
  item: AccountCourseContentItem;
  href: string;
};

function TypeIcon({ type }: { type: string }) {
  const t = type.toLowerCase();
  const styles =
    t === "video"
      ? "bg-amber-500/15 text-amber-600"
      : t === "liveclass"
        ? "bg-red-500/15 text-red-600"
        : t === "pdf"
          ? "bg-fuchsia-500/15 text-fuchsia-600"
          : t === "quiz"
            ? "bg-emerald-500/15 text-emerald-600"
            : "bg-[var(--account-nav-active-bg)] text-[var(--account-accent)]";

  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--account-radius)]",
        styles
      )}
      aria-hidden
    >
      {t === "video" ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      ) : t === "liveclass" ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="3" />
          <path d="M16.24 7.76a6 6 0 010 8.49M7.76 7.76a6 6 0 000 8.49M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
        </svg>
      ) : t === "pdf" ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      )}
    </span>
  );
}

export function AccountCourseContentCard({
  item,
  href,
}: AccountCourseContentCardProps) {
  const metaParts = [
    item.durationLabel,
    completionLabel(item.completed),
    item.liveClassStatus
      ? item.liveClassStatus.replace(/_/g, " ")
      : undefined,
    item.quizResultStatus
      ? item.quizResultStatus.replace(/_/g, " ")
      : undefined,
    item.quizMarksObtained !== undefined
      ? `${item.quizMarksObtained} marks`
      : undefined,
    item.pages !== undefined ? `${item.pages} pages` : undefined,
    item.questions !== undefined ? `${item.questions} questions` : undefined,
  ].filter(Boolean);

  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      {...(href
        ? {
            href,
            target: "_blank",
            rel: "noopener noreferrer",
          }
        : {})}
      className="flex gap-3 rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-3.5 transition-colors hover:border-[var(--account-accent)]/40 sm:p-4"
    >
      <TypeIcon type={item.type} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[var(--account-text)]">
              {item.title}
            </p>
            <p className="mt-0.5 text-[12px] text-[var(--account-text-muted)]">
              <span className="capitalize">{contentTypeLabel(item.type)}</span>
              {metaParts.length > 0 ? ` · ${metaParts.join(" · ")}` : ""}
            </p>
            {item.chapterTitle ? (
              <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[var(--account-text-muted)]">
                <svg
                  className="h-3.5 w-3.5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
                <span className="truncate">{item.chapterTitle}</span>
              </p>
            ) : null}
          </div>
          {href ? (
            <span className="shrink-0 text-[12px] font-semibold text-[var(--account-accent)]">
              Start Learning →
            </span>
          ) : null}
        </div>
      </div>
    </Wrapper>
  );
}
