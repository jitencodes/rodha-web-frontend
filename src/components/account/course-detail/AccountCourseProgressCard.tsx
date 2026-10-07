import { formatCourseDate } from "@/lib/account/course-content-filters";

type AccountCourseProgressCardProps = {
  progressPercent?: number;
  contentTotal?: number;
  completed?: boolean;
  learningStatus?: string;
  totalTimeLabel?: string;
  validTill?: string;
  startDate?: string;
  lastAccessDate?: string;
};

export function AccountCourseProgressCard({
  progressPercent,
  contentTotal,
  completed,
  learningStatus,
  totalTimeLabel,
  validTill,
  startDate,
  lastAccessDate,
}: AccountCourseProgressCardProps) {
  const hasProgress = progressPercent !== undefined;
  const validTillLabel = formatCourseDate(validTill);
  const startLabel = formatCourseDate(startDate);
  const lastAccessLabel = formatCourseDate(lastAccessDate);

  const metaItems = [
    learningStatus
      ? {
          label: "Status",
          value: learningStatus.replace(/_/g, " "),
        }
      : null,
    typeof completed === "boolean"
      ? { label: "Finished", value: completed ? "Yes" : "No" }
      : null,
    totalTimeLabel ? { label: "Time spent", value: totalTimeLabel } : null,
    validTillLabel ? { label: "Valid till", value: validTillLabel } : null,
    startLabel ? { label: "Started", value: startLabel } : null,
    lastAccessLabel ? { label: "Last access", value: lastAccessLabel } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  if (!hasProgress && metaItems.length === 0 && contentTotal === undefined) {
    return null;
  }

  const clamped = hasProgress
    ? Math.min(100, Math.max(0, progressPercent))
    : undefined;

  return (
    <section className="mb-5 rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4 sm:p-5">
      <h2 className="font-montserrat text-[15px] font-bold text-[var(--account-text)]">
        Course Progress
      </h2>

      {hasProgress || contentTotal !== undefined ? (
        <div className="mt-3 flex items-center justify-between gap-3 text-[13px] text-[var(--account-text-muted)]">
          <span>
            {contentTotal !== undefined
              ? `${contentTotal} item${contentTotal === 1 ? "" : "s"} in course`
              : "Progress"}
          </span>
          {clamped !== undefined ? (
            <span className="font-semibold text-[var(--account-text)]">
              {Math.round(clamped)}% Progress
            </span>
          ) : null}
        </div>
      ) : null}

      {clamped !== undefined ? (
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--account-border)]"
          role="progressbar"
          aria-valuenow={Math.round(clamped)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-[var(--account-accent)] transition-[width]"
            style={{ width: `${clamped}%` }}
          />
        </div>
      ) : null}

      {metaItems.length > 0 ? (
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {metaItems.map((item) => (
            <div key={item.label}>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-[var(--account-text-muted)]">
                {item.label}
              </dt>
              <dd className="mt-0.5 text-[13px] font-semibold capitalize text-[var(--account-text)]">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
