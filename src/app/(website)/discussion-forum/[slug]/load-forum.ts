import { notFound } from "next/navigation";

import { getDoubtForumBySlug } from "@/lib/api/modules/groups/service";
import type { DoubtForumViewModel } from "@/lib/api/modules/groups/types";

export async function loadDoubtForum(slug: string): Promise<DoubtForumViewModel> {
  const forum = await getDoubtForumBySlug(slug);
  if (!forum) notFound();
  return forum;
}

export function forumBasePath(slug: string): string {
  return `/discussion-forum/${slug}`;
}
