import Link from "next/link";
import {
  ClipboardList,
  FileText,
  HelpCircle,
  Radio,
  Video,
} from "lucide-react";
import { QUICK_ACTION_TILES } from "@/lib/account/course-content-filters";
import { cn } from "@/lib/utils";

const ICONS = {
  videos: Video,
  quizzes: HelpCircle,
  pdfs: FileText,
  "live-classes": Radio,
  assignments: ClipboardList,
} as const;

type AccountQuickActionTilesProps = {
  className?: string;
};

/** Continue Watching quick-action entry tiles → /account/content?type=… */
export function AccountQuickActionTiles({
  className,
}: AccountQuickActionTilesProps) {
  return (
    <section className={cn("mb-8", className)}>
      <h2 className="font-montserrat text-[16px] font-bold text-[var(--account-text)]">
        Quick Actions
      </h2>
      <p className="mt-1 text-[13px] text-[var(--account-text-muted)]">
        Jump into videos, quizzes, PDFs, live classes, and assignments
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {QUICK_ACTION_TILES.map((tile) => {
          const Icon = ICONS[tile.type];
          return (
            <Link
              key={tile.type}
              href={`/account/content?type=${tile.type}&page=1&limit=10`}
              className="flex flex-col items-center gap-2 rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-3 py-4 text-center shadow-[var(--account-shadow)] transition-colors hover:border-[var(--account-accent)] hover:bg-[var(--account-nav-active-bg)]"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-[var(--account-nav-hover)] text-[var(--account-accent)]">
                <Icon className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="text-[13px] font-semibold text-[var(--account-text)]">
                {tile.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
