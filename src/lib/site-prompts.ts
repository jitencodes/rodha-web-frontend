const DAY_MS = 24 * 60 * 60 * 1000;

export const PROMO_SHOWN_KEY = "rodha.promo.shownAt";
export const PURCHASE_DISMISS_KEY = "rodha.purchase.dismissedAt";

export function wasStoredWithinDay(key: string): boolean {
  if (typeof window === "undefined") return true;
  const raw = window.localStorage.getItem(key);
  const stored = Number(raw);
  if (!Number.isFinite(stored)) return false;
  return Date.now() - stored < DAY_MS;
}

export function rememberNow(key: string) {
  window.localStorage.setItem(key, String(Date.now()));
}

export function formatTimeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "just now";
  const seconds = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"}`;
}
