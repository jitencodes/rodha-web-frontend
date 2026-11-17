/** Route helpers for the Discussion Forum (`app/(website)/discussion-forum`). */

export const FORUM_HOME_PATH = "/discussion-forum";
export const FORUM_GROUPS_PATH = "/discussion-forum/groups";
export const FORUM_ASK_PATH = "/discussion-forum/ask";

/**
 * Static segments under `/discussion-forum` that shadow a group slug.
 * A group whose seoSlug matches one of these cannot be opened by slug.
 */
export const FORUM_RESERVED_SEGMENTS = ["groups", "ask"] as const;

export function forumGroupPath(groupSlug: string): string {
  return `${FORUM_HOME_PATH}/${encodeURIComponent(groupSlug)}`;
}

export function forumTopicPath(groupSlug: string, topicSlug: string): string {
  return `${forumGroupPath(groupSlug)}/${encodeURIComponent(topicSlug)}`;
}

export function forumGroupAskPath(groupSlug: string): string {
  return `${forumGroupPath(groupSlug)}/ask`;
}

export function forumLoginHref(nextPath: string): string {
  return `/login?next=${encodeURIComponent(nextPath)}`;
}

/** Group slug for the current pathname, or null on home / groups / ask pages. */
export function forumGroupSlugFromPathname(pathname: string): string | null {
  if (!pathname.startsWith(`${FORUM_HOME_PATH}/`)) return null;
  const segment = pathname.slice(FORUM_HOME_PATH.length + 1).split("/")[0];
  if (!segment) return null;
  if ((FORUM_RESERVED_SEGMENTS as readonly string[]).includes(segment)) {
    return null;
  }
  return decodeURIComponent(segment);
}
