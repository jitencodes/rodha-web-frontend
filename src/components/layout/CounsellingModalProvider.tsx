"use client";

import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { HeroCounsellingForm } from "@/components/sections/home/HeroCounsellingForm";
import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";
import type { CategoryId } from "@/lib/types";

const AUTO_CLOSE_MS = 2000;

export interface CounsellingModalOptions {
  defaultExam?: string;
  /** Course detail uses enquiry fields (incl. exam year) */
  mode?: "counselling" | "enquiry";
}

interface CounsellingModalContextValue {
  isOpen: boolean;
  openCounsellingModal: (options?: CounsellingModalOptions) => void;
  closeCounsellingModal: () => void;
}

export const CounsellingModalContext =
  createContext<CounsellingModalContextValue | null>(null);

export function CounsellingModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultExam, setDefaultExam] = useState("");
  const [mode, setMode] = useState<"counselling" | "enquiry">("counselling");
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openCounsellingModal = useCallback(
    (options?: CounsellingModalOptions) => {
      clearCloseTimer();
      setDefaultExam(options?.defaultExam ?? "");
      setMode(options?.mode ?? "counselling");
      setIsOpen(true);
    },
    [clearCloseTimer]
  );

  const closeCounsellingModal = useCallback(() => {
    clearCloseTimer();
    setIsOpen(false);
  }, [clearCloseTimer]);

  const scheduleAutoClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, AUTO_CLOSE_MS);
  }, [clearCloseTimer]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

  const value = useMemo(
    () => ({ isOpen, openCounsellingModal, closeCounsellingModal }),
    [isOpen, openCounsellingModal, closeCounsellingModal]
  );

  const isEnquiry = mode === "enquiry";

  return (
    <CounsellingModalContext.Provider value={value}>
      {children}
      <Modal
        isOpen={isOpen}
        onClose={closeCounsellingModal}
        title={isEnquiry ? "Enquire Now" : "Book Your Free Counselling"}
        className="max-w-md"
      >
        {isEnquiry ? (
          <LeadCaptureForm
            key={`enquiry-${defaultExam || "default"}`}
            variant="dark"
            hideTitle
            subtitle="Share your details and our counsellors will help you enrol."
            ctaLabel="Enrol Enquiry"
            defaultExam={(defaultExam as CategoryId) || ""}
            showExamYear
            onSuccess={scheduleAutoClose}
          />
        ) : (
          <>
            <p className="mb-4 text-body-sm text-text-muted">
              Our experts will help you choose the right course.
            </p>
            <HeroCounsellingForm
              key={defaultExam || "default"}
              variant="modal"
              showHeader={false}
              defaultExam={defaultExam}
              onSuccess={scheduleAutoClose}
            />
          </>
        )}
      </Modal>
    </CounsellingModalContext.Provider>
  );
}
