import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

type AccountContentListingSkeletonProps = {
  count?: number;
  className?: string;
};

/** Shimmer placeholders matching AccountCourseContentCard grid. */
export function AccountContentListingSkeleton({
  count = 6,
  className,
}: AccountContentListingSkeletonProps) {
  return (
    <ul
      className={cn("grid grid-cols-1 gap-3 lg:grid-cols-2", className)}
      aria-busy="true"
      aria-label="Loading content"
    >
      {Array.from({ length: count }, (_, i) => (
        <li
          key={i}
          className="flex gap-3 rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4"
        >
          <Skeleton className="size-10 shrink-0 rounded-[var(--account-radius)]" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/5" />
          </div>
        </li>
      ))}
    </ul>
  );
}
