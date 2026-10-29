"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { RegistrationDialog } from "@/components/account/RegistrationDialog";
import "@/components/account/account-theme.css";
import type { StudentRegistrationStatusViewModel } from "@/lib/api/modules/student/dashboard/types";
import type { StudentRegistrationFormViewModel } from "@/lib/api/modules/student/registration/types";
import { fetchAuthed } from "@/lib/auth/session-expired";
import {
  REGISTRATION_STATUS_POLL_INTERVAL_MS,
} from "@/lib/constants";
import {
  clearRegistrationDismissedAt,
  formatRegistrationDeadline,
  isRegistrationReminderDue,
  OPEN_REGISTRATION_EVENT,
  writeRegistrationDismissedAt,
} from "@/lib/registration-gate";

type RegistrationGateProviderProps = {
  /** When false, provider is idle (public guest). */
  enabled?: boolean;
};

function emptyStatus(): StudentRegistrationStatusViewModel {
  return {
    completed: false,
    required: false,
    overdue: false,
    deadlineAt: null,
    firstEnrollmentAt: null,
  };
}

export function RegistrationGateProvider({
  enabled = true,
}: RegistrationGateProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAccountRoute = pathname.startsWith("/account");
  const [status, setStatus] =
    useState<StudentRegistrationStatusViewModel | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mandatory, setMandatory] = useState(false);
  const [form, setForm] = useState<StudentRegistrationFormViewModel | null>(
    null
  );
  const [formLoading, setFormLoading] = useState(false);
  const formLoadRef = useRef<Promise<StudentRegistrationFormViewModel | null> | null>(
    null
  );
  const manualOpenRef = useRef(false);

  const loadForm = useCallback(async (allowCloseOnError = true) => {
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
          if (allowCloseOnError) setDialogOpen(false);
          return null;
        }
        setForm(data.data);
        return data.data;
      } catch {
        toast.error("Unable to load registration form.");
        if (allowCloseOnError) setDialogOpen(false);
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
    (next: StudentRegistrationStatusViewModel, forceManual = false) => {
      if (next.completed) {
        setDialogOpen(false);
        setMandatory(false);
        manualOpenRef.current = false;
        clearRegistrationDismissedAt();
        return;
      }

      // Manual open (profile CTA): allow when not completed, even if API omits
      // `required` / registration object (maps to required: false).
      if (forceManual || manualOpenRef.current) {
        setDialogOpen(true);
        void loadForm(true);
        return;
      }

      // Auto-prompt only when registration object says required.
      if (!next.required) {
        setDialogOpen(false);
        setMandatory(false);
        return;
      }

      const overdueMandatory = next.overdue && isAccountRoute;
      setMandatory(overdueMandatory);

      if (overdueMandatory) {
        clearRegistrationDismissedAt();
        setDialogOpen(true);
        void loadForm(false);
        return;
      }

      if (isRegistrationReminderDue()) {
        setDialogOpen(true);
        void loadForm(true);
      }
    },
    [isAccountRoute, loadForm]
  );

  const pollStatus = useCallback(async () => {
    if (!enabled) return;
    try {
      const res = await fetchAuthed("/api/account/dashboard-status");
      if (res.status === 401) {
        setStatus(null);
        setDialogOpen(false);
        return;
      }
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        registration?: StudentRegistrationStatusViewModel;
      } | null;
      if (!res.ok || !data?.ok || !data.registration) return;
      setStatus(data.registration);
      evaluateOpen(data.registration);
    } catch {
      // soft-fail poll
    }
  }, [enabled, evaluateOpen]);

  useEffect(() => {
    if (!enabled) return;
    void pollStatus();
    const id = window.setInterval(() => {
      void pollStatus();
    }, REGISTRATION_STATUS_POLL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [enabled, pollStatus]);

  // Re-evaluate when navigating between public ↔ account (overdue mandatory).
  useEffect(() => {
    if (!enabled || !status) return;
    evaluateOpen(status);
  }, [enabled, isAccountRoute, status, evaluateOpen]);

  useEffect(() => {
    if (!enabled) return;
    function onOpenRequest() {
      if (status?.completed) {
        toast.message("Registration is already complete.");
        return;
      }
      manualOpenRef.current = true;
      setDialogOpen(true);
      void loadForm();
    }
    window.addEventListener(OPEN_REGISTRATION_EVENT, onOpenRequest);
    return () =>
      window.removeEventListener(OPEN_REGISTRATION_EVENT, onOpenRequest);
  }, [enabled, loadForm, status]);

  function handleClose() {
    if (mandatory) return;
    setDialogOpen(false);
    manualOpenRef.current = false;
    writeRegistrationDismissedAt();
    const deadline = formatRegistrationDeadline(status?.deadlineAt ?? null);
    toast.message(
      deadline
        ? `Please complete your registration by ${deadline}.`
        : "Please complete your registration when you can."
    );
  }

  function handleSubmitted() {
    clearRegistrationDismissedAt();
    manualOpenRef.current = false;
    setDialogOpen(false);
    setMandatory(false);
    setStatus((prev) =>
      prev
        ? {
            ...prev,
            completed: true,
            required: false,
            overdue: false,
          }
        : emptyStatus()
    );
    router.refresh();
  }

  if (!enabled) return null;

  return (
    <div className="account-shell" data-account-theme="light">
      {dialogOpen && form ? (
        <RegistrationDialog
          open={dialogOpen}
          registration={form}
          required={mandatory}
          overdue={Boolean(status?.overdue)}
          deadlineAt={status?.deadlineAt ?? null}
          onClose={handleClose}
          onSubmitted={handleSubmitted}
        />
      ) : null}
      {dialogOpen && !form ? (
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
  );
}
