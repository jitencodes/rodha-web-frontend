import { getGroupTopics } from "@/lib/api/modules/groups/service";
import type { ForumTopicViewModel } from "@/lib/api/modules/groups/types";

const RAIL_SIZE = 5;

/**
 * Right-rail data scoped to one group, ranked by the API:
 * - latest: `sort_by=lastActivityAt desc`
 * - best:   `sort_by=messageCount desc` (topics with no replies are dropped,
 *           order is never changed client-side)
 */
export async function loadGroupRail(groupId: number): Promise<{
  latest: ForumTopicViewModel[];
  best: ForumTopicViewModel[];
}> {
  const [latest, best] = await Promise.all([
    getGroupTopics(groupId, {
      page: 1,
      limit: RAIL_SIZE,
      sortBy: "lastActivityAt",
      sortOrder: "desc",
    }),
    getGroupTopics(groupId, {
      page: 1,
      limit: RAIL_SIZE,
      sortBy: "messageCount",
      sortOrder: "desc",
    }),
  ]);

  return {
    latest: latest?.items ?? [],
    best: (best?.items ?? []).filter((topic) => topic.replyCount > 0),
  };
}
