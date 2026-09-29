import { cn } from "@/lib/utils";
import type { LearningProgress } from "@/lib/account/types";

type LearningProgressCardProps = {
  progress: LearningProgress;
  className?: string;
};

export function LearningProgressCard({
  progress,
  className,
}: LearningProgressCardProps) {
  const size = 96;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (Math.min(100, Math.max(0, progress.percent)) / 100) * circumference;

  const legend = [
    {
      label: "Completed",
      value: progress.completed,
      color: "var(--account-accent)",
    },
    {
      label: "In Progress",
      value: progress.inProgress,
      color: "var(--account-progress-inprogress)",
    },
    {
      label: "Not Started",
      value: progress.notStarted,
      color: "var(--account-progress-notstarted)",
    },
  ] as const;

  return (
    <section
      className={cn(
        "rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4 shadow-[var(--account-shadow)]",
        className
      )}
    >
      <h2 className="font-montserrat text-[15px] font-semibold text-[var(--account-text)]">
        {progress.title}
      </h2>
      <p className="mt-0.5 text-[12px] text-[var(--account-text-muted)]">
        {progress.encouragement}
      </p>

      <div className="mt-4 flex items-center gap-4">
        <div
          className="relative shrink-0"
          style={{ width: size, height: size }}
          role="img"
          aria-label={`${progress.percent}% complete`}
        >
          <svg width={size} height={size} className="-rotate-90" aria-hidden>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--account-progress-track)"
              strokeWidth={stroke}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--account-accent)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-montserrat text-[1.25rem] font-bold text-[var(--account-text)] tabular-nums">
            {progress.percent}%
          </span>
        </div>

        <ul className="flex min-w-0 flex-1 flex-col gap-2.5">
          {legend.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-2 text-[13px]"
            >
              <span className="inline-flex items-center gap-2 text-[var(--account-text-secondary)]">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: row.color }}
                  aria-hidden
                />
                {row.label}
              </span>
              <span className="font-semibold text-[var(--account-text)] tabular-nums">
                {row.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
