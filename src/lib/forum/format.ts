export function formatForumRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatForumCount(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
  }
  return String(n);
}

/** Backend rejects edits after this window (API: “Edit window of 4 hour(s)…”). */
export const FORUM_MESSAGE_EDIT_WINDOW_MS = 4 * 60 * 60 * 1000;

/** Whether a message/answer may still be edited (client gate matching API policy). */
export function canEditForumMessage(
  createdAt: string | null | undefined,
  nowMs: number = Date.now()
): boolean {
  if (!createdAt?.trim()) return false;
  const createdMs = Date.parse(createdAt);
  if (Number.isNaN(createdMs)) return false;
  return nowMs - createdMs < FORUM_MESSAGE_EDIT_WINDOW_MS;
}
