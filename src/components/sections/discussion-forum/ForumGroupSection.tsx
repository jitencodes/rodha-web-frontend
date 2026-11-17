import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ForumGroupIcon } from "@/components/sections/discussion-forum/ForumGroupIcon";
import { ForumTopicTable } from "@/components/sections/discussion-forum/ForumTopicTable";
import type {
  DoubtForumViewModel,
  ForumTopicViewModel,
} from "@/lib/api/modules/groups/types";
import { formatForumCountLabel } from "@/lib/forum/format";
import { forumGroupPath } from "@/lib/forum/paths";

type ForumGroupSectionProps = {
  group: DoubtForumViewModel;
  topics: ForumTopicViewModel[];
};

/** Homepage group card: icon + name + description, topic table, See All links. */
export function ForumGroupSection({ group, topics }: ForumGroupSectionProps) {
  const href = forumGroupPath(group.slug);
  const headingId = `forum-group-${group.id}`;

  return (
    <section
      aria-labelledby={headingId}
      className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm"
    >
      <header className="flex items-start gap-4 px-4 py-4 sm:px-5">
        <ForumGroupIcon name={group.name} src={group.iconUrl} className="size-12 rounded-xl" />
        <div className="min-w-0 flex-1">
          <h2 id={headingId} className="text-h4 font-bold text-neutral-900">
            <Link href={href} className="transition-colors hover:text-orange-600">
              {group.name}
            </Link>
          </h2>
          <p className="mt-0.5 line-clamp-2 text-body-sm text-neutral-600">
            {group.description ||
              `${formatForumCountLabel(group.topicCount, "topic")} · ${formatForumCountLabel(group.memberCount, "member")}`}
          </p>
        </div>
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1.5 pt-1 text-body-sm font-semibold text-orange-600 transition-colors hover:text-orange-700 sm:inline-flex"
        >
          See All Topics
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </header>

      <ForumTopicTable topics={topics} groupSlug={group.slug} />

      <div className="border-t border-neutral-100 px-4 py-3 sm:px-5">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-orange-600 transition-colors hover:text-orange-700"
        >
          See All Topics in {group.name}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
