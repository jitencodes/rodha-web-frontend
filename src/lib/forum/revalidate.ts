import { revalidatePath } from "next/cache";

function cleanSegment(value: string): string {
  return value.trim().replace(/^\/+|\/+$/g, "");
}

/** Bust App Router cache for a forum feed after creating a topic. */
export function revalidateForumFeedPath(forumSlug: string): void {
  const forum = cleanSegment(forumSlug);
  if (!forum) return;
  revalidatePath(`/discussion-forum/${forum}`);
}

/** Bust App Router cache for a forum feed + question detail after mutations. */
export function revalidateForumTopicPaths(
  forumSlug: string,
  topicSlug: string
): void {
  const forum = cleanSegment(forumSlug);
  const topic = cleanSegment(topicSlug);
  if (!forum || !topic) return;

  revalidatePath(`/discussion-forum/${forum}`);
  revalidatePath(`/discussion-forum/${forum}/${topic}`);
}
