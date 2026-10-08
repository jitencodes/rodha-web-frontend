import Link from "next/link";
import {
  Award,
  BookOpen,
  ChevronRight,
  ClipboardList,
  Headphones,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardQuickLink } from "@/lib/account/types";

type QuickLinksCardProps = {
  links: DashboardQuickLink[];
  className?: string;
};

const ICON_MAP: Record<string, LucideIcon> = {
  courses: BookOpen,
  test: ClipboardList,
  certificate: Award,
  profile: UserRound,
  help: Headphones,
};

export function QuickLinksCard({ links, className }: QuickLinksCardProps) {
  return (
    <section
      className={cn(
        "rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4 shadow-[var(--account-shadow)]",
        className
      )}
    >
      <h2 className="font-montserrat text-[15px] font-semibold text-[var(--account-text)]">
        Quick Links
      </h2>

      <ul className="mt-2">
        {links.map((link) => {
          const Icon = (link.icon && ICON_MAP[link.icon]) || BookOpen;
          const isExternal = link.href.startsWith("mailto:");
          const classNameLink = cn(
            "flex items-center gap-3 rounded-lg px-1 py-2.5 text-[13px] font-medium text-[var(--account-text-secondary)] transition-colors hover:bg-[var(--account-nav-hover)] hover:text-[var(--account-text)]"
          );

          const content = (
            <>
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--account-nav-active-bg)] text-[var(--account-accent)]">
                <Icon className="size-4" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">{link.label}</span>
              <ChevronRight
                className="size-4 shrink-0 text-[var(--account-text-muted)]"
                strokeWidth={1.75}
                aria-hidden
              />
            </>
          );

          return (
            <li key={link.id}>
              {isExternal ? (
                <a
                  href={link.href}
                  className={classNameLink}
                  onClickCapture={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    window.location.assign(link.href);
                  }}
                >
                  {content}
                </a>
              ) : (
                <Link href={link.href} className={classNameLink}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
