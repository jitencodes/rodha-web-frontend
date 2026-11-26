"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { toast } from "sonner";
import { RegistrationDialog } from "@/components/account/RegistrationDialog";
import { VerifyContactDialog } from "@/components/account/VerifyContactDialog";
import "@/components/account/account-theme.css";
import { userHasState } from "@/lib/api/modules/auth/mapper";
import type {
  StudentGateKind,
  StudentGateViewModel,
} from "@/lib/api/modules/student/gate/types";
import type { StudentRegistrationFormViewModel } from "@/lib/api/modules/student/registration/types";
import { clearAllRegistrationDrafts } from "@/lib/account/registration-draft";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { GATE_STATUS_POLL_INTERVAL_MS } from "@/lib/constants";
import { userAtom } from "@/lib/store/user";
import {
  clearGateDismissedAt,
  formatGateDeadline,
  isGateReminderDue,
  OPEN_REGISTRATION_EVENT,
  publishRegistrationIncomplete,
  requestStudentGateCheck,
  resolveActiveGate,
  STUDENT_GATE_EVENT,
  writeGateDismissedAt,
  type StudentGateEventDetail,
} from "@/lib/student-gate";

const DISMISS_COPY: Record<StudentGateKind, string> = {
  email: "Please verify your email",
  mobile: "Please verify your mobile number",
  registration: "Please complete your registration",
};

/** Applied before the next status arrives, so a finished step cannot reopen. */
function withGateResolved(
  status: StudentGateViewModel,
  kind: StudentGateKind
): StudentGateViewModel {
  const done = { required: false, overdue: false, deadlineAt: null };
  if (kind === "email") return { ...status, emailVerification: done };
  if (kind === "mobile") return { ...status, mobileVerification: done };
  return {
    ...status,
    registration: {
      ...status.registration,
      completed: true,
      required: false,
      overdue: false,
    },
  };
}

type StudentGateProviderProps = {
  /** When false, nothing is polled (public guest). */
  enabled?: boolean;
};

/**
 * Email verification, mobile verification and registration prompts, one at a
 * time. Reminders can be dismissed; overdue ones block account pages.
 */
export function StudentGateProvider({
  enabled = true,
}: StudentGateProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAtomValue(userAtom);
  const isAccountRoute = pathname.startsWith("/account");
  /** The state dialog is already up; reminders wait for it. */
  const holdReminders = isAccountRoute && user != null && !userHasState(user);

  const [status, setStatus] = useState<StudentGateViewModel | null>(null);
  const [openGate, setOpenGate] = useState<StudentGateKind | null>(null);
  const [mandatory, setMandatory] = useState(false);
  const [form, setForm] = useState<StudentRegistrationFormViewModel | null>(
    null
  );
  const [formLoading, setFormLoading] = useState(false);
  const formLoadRef = useRef<Promise<StudentRegistrationFormViewModel | null> | null>(
    null
  );
  const manualOpenRef = useRef(false);
  /** The API refused a call: reload the page once the student is unblocked. */
  const blockedRef = useRef(false);
  const checkingRef = useRef(false);
  const forceOpenRef = useRef(false);

  const loadForm = useCallback(async (allowCloseOnError = true) => {
    function closeOnError() {
      // Otherwise the next poll would reopen it and fail again.
      manualOpenRef.current = false;
      setOpenGate(null);
    }
    if (form) return form;
    if (formLoadRef.current) return formLoadRef.current;
    setFormLoading(true);
    const promise = (async () => {
      try {
        const res = await fetchAuthed("/api/account/registration");
        const data = (await res.json().catch(() => null)) as {
          ok?: boolean;
          data?: StudentRegistrationFormViewModel;
          error?: string;
        } | null;
        if (!res.ok || !data?.ok || !data.data) {
          toast.error(data?.error || "Unable to load registration form.");
          if (allowCloseOnError) closeOnError();
          return null;
        }
        setForm(data.data);
        return data.data;
      } catch {
        toast.error("Unable to load registration form.");
        if (allowCloseOnError) closeOnError();
        return null;
      } finally {
        setFormLoading(false);
        formLoadRef.current = null;
      }
    })();
    formLoadRef.current = promise;
    return promise;
  }, [form]);

  const evaluateOpen = useCallback(
    (next: StudentGateViewModel, force = false) => {
      if (next.registration.completed) {
        manualOpenRef.current = false;
        clearGateDismissedAt("registration");
        clearAllRegistrationDrafts();
      }

      const active = resolveActiveGate(next);
      const blocking = Boolean(active?.overdue) && isAccountRoute;

      // Opened from the profile / sidebar: keep it unless something blocks.
      if (manualOpenRef.current && !blocking) {
        setMandatory(false);
        setOpenGate("registration");
        void loadForm(true);
        return;
      }

      if (!active) {
        setMandatory(false);
        setOpenGate(null);
        return;
      }

      setMandatory(blocking);
      if (blocking) {
        blockedRef.current = true;
        clearGateDismissedAt(active.kind);
      }
      if (blocking || force || (!holdReminders && isGateReminderDue(active.kind))) {
        setOpenGate(active.kind);
        if (active.kind === "registration") void loadForm(!blocking);
        return;
      }
      // Not due: leave an open dialog alone while it is still the current one.
      setOpenGate((prev) => (prev === active.kind ? prev : null));
    },
    [holdReminders, isAccountRoute, loadForm]
  );

  /** Latest status, or null when it could not be read. */
  const fetchStatus = useCallback(async (): Promise<StudentGateViewModel | null> => {
    try {
      const res = await fetchAuthed("/api/account/gate-status");
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        gate?: StudentGateViewModel;
      } | null;
      if (!res.ok || !data?.ok || !data.gate) return null;
      // Any student may register; `required` only drives the prompts.
      publishRegistrationIncomplete(!data.gate.registration.completed);
      setStatus(data.gate);
      return data.gate;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void fetchStatus();
    const id = window.setInterval(() => {
      void fetchStatus();
    }, GATE_STATUS_POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [enabled, fetchStatus]);

  // New status, or a move between public ↔ account (overdue blocks there).
  useEffect(() => {
    if (status) evaluateOpen(status);
  }, [status, evaluateOpen]);

  // Not limited to `enabled`: a guest may sign in inside the checkout sidebar.
  useEffect(() => {
    async function onCheck(event: Event) {
      const { blocked } = (event as CustomEvent<StudentGateEventDetail>).detail;
      if (blocked) {
        blockedRef.current = true;
        forceOpenRef.current = true;
      }
      // Several refused calls at once need one check.
      if (checkingRef.current) return;
      checkingRef.current = true;
      const next = await fetchStatus();
      checkingRef.current = false;
      const force = forceOpenRef.current;
      forceOpenRef.current = false;
      if (next && force) evaluateOpen(next, true);
    }
    window.addEventListener(STUDENT_GATE_EVENT, onCheck);
    return () => window.removeEventListener(STUDENT_GATE_EVENT, onCheck);
  }, [evaluateOpen, fetchStatus]);

  const registrationCompleted = Boolean(status?.registration.completed);
  useEffect(() => {
    if (!enabled) return;
    function onOpenRequest() {
      if (registrationCompleted) {
        toast.message("Registration is already complete.");
        return;
      }
      manualOpenRef.current = true;
      setOpenGate("registration");
      void loadForm();
    }
    window.addEventListener(OPEN_REGISTRATION_EVENT, onOpenRequest);
    return () =>
      window.removeEventListener(OPEN_REGISTRATION_EVENT, onOpenRequest);
  }, [enabled, loadForm, registrationCompleted]);

  /** Null once the deadline has passed. */
  function deadlineOf(kind: StudentGateKind): string | null {
    if (!status) return null;
    const gate =
      kind === "email"
        ? status.emailVerification
        : kind === "mobile"
          ? status.mobileVerification
          : status.registration;
    return gate.overdue ? null : gate.deadlineAt;
  }

  function handleClose() {
    if (mandatory || !openGate) return;
    setOpenGate(null);
    manualOpenRef.current = false;
    writeGateDismissedAt(openGate);
    const deadline = formatGateDeadline(deadlineOf(openGate));
    toast.message(
      deadline
        ? `${DISMISS_COPY[openGate]} by ${deadline}.`
        : `${DISMISS_COPY[openGate]} when you can.`
    );
  }

  /** After a step is done: show the next one, or let the student back in. */
  async function handleResolved(kind: StudentGateKind) {
    clearGateDismissedAt(kind);
    setOpenGate(null);
    setMandatory(false);
    if (kind === "registration") {
      manualOpenRef.current = false;
      clearAllRegistrationDrafts();
      publishRegistrationIncomplete(false);
    }
    setStatus((prev) => (prev ? withGateResolved(prev, kind) : prev));
    // Prefilled with the account email / mobile.
    setForm(null);

    const next = await fetchStatus();
    if (next && resolveActiveGate(next)?.overdue) {
      if (blockedRef.current) requestStudentGateCheck(true);
      return;
    }
    if (blockedRef.current) {
      // Views that were refused data load again.
      window.location.reload();
      return;
    }
    router.refresh();
  }

  return (
    <>
      {openGate === "email" || openGate === "mobile" ? (
        <VerifyContactDialog
          key={openGate}
          channel={openGate}
          email={status?.email}
          initialMobile={status?.mobile}
          required={mandatory}
          deadlineAt={deadlineOf(openGate)}
          onClose={handleClose}
          onVerified={() => void handleResolved(openGate)}
        />
      ) : null}
      <div className="account-shell" data-account-theme="light">
        {openGate === "registration" && form ? (
          <RegistrationDialog
            open
            registration={form}
            required={mandatory}
            overdue={Boolean(status?.registration.overdue)}
            deadlineAt={status?.registration.deadlineAt ?? null}
            onClose={handleClose}
            onSubmitted={() => void handleResolved("registration")}
          />
        ) : null}
        {openGate === "registration" && !form ? (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
            role="status"
            aria-live="polite"
          >
            <div className="rounded-xl bg-white px-5 py-4 text-sm text-neutral-800 shadow-lg">
              {formLoading
                ? "Loading registration form…"
                : "Unable to load registration form. Retrying…"}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
