import Link from "next/link";
import { cn } from "@/lib/utils";

type AccountSectionHeaderProps = {
  title: string;
  titleId?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
};

export function AccountSectionHeader({
  title,
  titleId,
  viewAllHref,
  viewAllLabel = "View All →",
  className,
}: AccountSectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-3.5 flex items-center justify-between gap-3",
        className
      )}
    >
      <h2
        id={titleId}
        className="font-montserrat text-[1.05rem] font-semibold text-[var(--account-text)] sm:text-[1.125rem]"
      >
        {title}
      </h2>
      {viewAllHref ? (
        <Link
          href={viewAllHref}
          className="shrink-0 text-[13px] font-semibold text-[var(--account-accent)] transition-opacity hover:opacity-80"
        >
          {viewAllLabel}
        </Link>
      ) : null}
    </div>
  );
}
