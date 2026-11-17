import { ForumSidebarNav } from "@/components/sections/discussion-forum/ForumSidebarNav";
import { loadForumSidebar } from "@/lib/forum/sidebar";
import { cn } from "@/lib/utils";

type ForumPageLayoutProps = {
  children: React.ReactNode;
  /** Latest / Best posts rail. Stacks under the feed below `xl`. */
  rightRail?: React.ReactNode;
  className?: string;
};

/**
 * Three-column forum layout (dashboard design):
 * - md+: flat sticky left nav with a divider + feed
 * - xl+: adds the right rail; the feed keeps the remaining width
 * - phones: nav lives in the header drawer
 */
export async function ForumPageLayout({
  children,
  rightRail,
  className,
}: ForumPageLayoutProps) {
  const sidebar = await loadForumSidebar();

  return (
    <div
      className={cn(
        "mx-auto grid max-w-[1536px] gap-5 px-4 py-5 md:grid-cols-[13.5rem_minmax(0,1fr)] md:gap-6 md:pl-0 lg:pr-6 xl:grid-cols-[15rem_minmax(0,1fr)_21rem]",
        className
      )}
    >
      <aside className="hidden md:block md:border-r md:border-orange-100">
        <div className="sticky top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain px-4 py-1">
          <ForumSidebarNav groups={sidebar.groups} totalGroups={sidebar.total} />
        </div>
      </aside>

      <div className="min-w-0 md:py-1">{children}</div>

      {rightRail ? (
        <aside
          className="min-w-0 md:col-start-2 xl:col-start-3 xl:row-start-1 xl:py-1"
          aria-label="Forum highlights"
        >
          <div className="space-y-5 xl:sticky xl:top-20">{rightRail}</div>
        </aside>
      ) : null}
    </div>
  );
}
