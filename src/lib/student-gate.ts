import type {
  StudentGateKind,
  StudentGateViewModel,
} from "@/lib/api/modules/student/gate/types";
import {
  GATE_DISMISS_STORAGE_KEYS,
  GATE_REMINDER_INTERVAL_MS,
} from "@/lib/constants";

export const OPEN_REGISTRATION_EVENT = "rodha:open-registration";
export const STUDENT_GATE_EVENT = "rodha:student-gate";

export type StudentGateEventDetail = { blocked: boolean };

export function requestOpenRegistrationDialog(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_REGISTRATION_EVENT));
}

/**
 * Re-read the student's gate status. `blocked`: the API refused a call until
 * the student acts, so the dialog opens now, whatever the reminder interval.
 */
export function requestStudentGateCheck(blocked = false): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<StudentGateEventDetail>(STUDENT_GATE_EVENT, {
      detail: { blocked },
    })
  );
}

/** The one gate to show: an overdue one blocks first, then email → mobile → registration. */
export function resolveActiveGate(
  gate: StudentGateViewModel
): { kind: StudentGateKind; overdue: boolean; deadlineAt: string | null } | null {
  const { emailVerification, mobileVerification, registration } = gate;
  const pending = [
    { kind: "email" as const, ...emailVerification },
    { kind: "mobile" as const, ...mobileVerification },
    {
      kind: "registration" as const,
      required: registration.required && !registration.completed,
      overdue: registration.overdue,
      deadlineAt: registration.deadlineAt,
    },
  ].filter((item) => item.required);
  const active = pending.find((item) => item.overdue) ?? pending[0];
  if (!active) return null;
  return {
    kind: active.kind,
    overdue: active.overdue,
    deadlineAt: active.deadlineAt,
  };
}

function readGateDismissedAt(kind: StudentGateKind): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GATE_DISMISS_STORAGE_KEYS[kind]);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function writeGateDismissedAt(kind: StudentGateKind, at = Date.now()): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GATE_DISMISS_STORAGE_KEYS[kind], String(at));
  } catch {
    // ignore
  }
}

export function clearGateDismissedAt(kind: StudentGateKind): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GATE_DISMISS_STORAGE_KEYS[kind]);
  } catch {
    // ignore
  }
}

/** True when we should re-prompt (never dismissed, or interval elapsed). */
export function isGateReminderDue(
  kind: StudentGateKind,
  now = Date.now(),
  intervalMs = GATE_REMINDER_INTERVAL_MS
): boolean {
  const dismissedAt = readGateDismissedAt(kind);
  if (dismissedAt == null) return true;
  return now - dismissedAt >= intervalMs;
}

export function formatGateDeadline(deadlineAt: string | null): string {
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

/* ---- Shared "registration incomplete" flag (published by StudentGateProvider) ---- */

let registrationIncomplete = false;
const incompleteListeners = new Set<() => void>();

/** Called by the gate provider whenever it learns the latest status. */
export function publishRegistrationIncomplete(incomplete: boolean): void {
  if (registrationIncomplete === incomplete) return;
  registrationIncomplete = incomplete;
  incompleteListeners.forEach((listener) => listener());
}

export function subscribeRegistrationIncomplete(listener: () => void) {
  incompleteListeners.add(listener);
  return () => {
    incompleteListeners.delete(listener);
  };
}

export function getRegistrationIncomplete(): boolean {
  return registrationIncomplete;
}

export function getRegistrationIncompleteServer(): boolean {
  return false;
}
