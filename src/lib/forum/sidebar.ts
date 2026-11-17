import { getDoubtForums } from "@/lib/api/modules/groups/service";

/** Groups shown in the left sidebar before "See more groups". */
export const FORUM_SIDEBAR_GROUP_LIMIT = 6;

export type ForumSidebarGroup = {
  id: number;
  name: string;
  slug: string;
  iconUrl: string | null;
  topicCount: number;
};

export type ForumSidebarData = {
  groups: ForumSidebarGroup[];
  /** Total doubt-forum groups from the API (drives "See more"). */
  total: number;
};

/**
 * Sidebar groups for the header drawer + left rail (`GET api/app/groups`).
 * Layout and page issue the same request; the fetch cache de-duplicates it.
 */
export async function loadForumSidebar(): Promise<ForumSidebarData> {
  const list = await getDoubtForums({
    page: 1,
    limit: FORUM_SIDEBAR_GROUP_LIMIT,
  });

  return {
    groups: (list?.items ?? []).map((group) => ({
      id: group.id,
      name: group.name,
      slug: group.slug,
      iconUrl: group.iconUrl,
      topicCount: group.topicCount,
    })),
    total: list?.total ?? 0,
  };
}
