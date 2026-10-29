import {
  REGISTRATION_DISMISS_STORAGE_KEY,
  REGISTRATION_REMINDER_INTERVAL_MS,
} from "@/lib/constants";

export const OPEN_REGISTRATION_EVENT = "rodha:open-registration";

export function requestOpenRegistrationDialog(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_REGISTRATION_EVENT));
}

export function readRegistrationDismissedAt(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(REGISTRATION_DISMISS_STORAGE_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function writeRegistrationDismissedAt(at = Date.now()): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REGISTRATION_DISMISS_STORAGE_KEY, String(at));
  } catch {
    // ignore
  }
}

export function clearRegistrationDismissedAt(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(REGISTRATION_DISMISS_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/** True when we should re-prompt (never dismissed, or interval elapsed). */
export function isRegistrationReminderDue(
  now = Date.now(),
  intervalMs = REGISTRATION_REMINDER_INTERVAL_MS
): boolean {
  const dismissedAt = readRegistrationDismissedAt();
  if (dismissedAt == null) return true;
  return now - dismissedAt >= intervalMs;
}

export function formatRegistrationDeadline(deadlineAt: string | null): string {
  if (!deadlineAt) return "";
  const d = new Date(deadlineAt);
  if (Number.isNaN(d.getTime())) return deadlineAt;
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
