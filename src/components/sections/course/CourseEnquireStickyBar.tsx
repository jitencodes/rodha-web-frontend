"use client";

import { useCounsellingModal } from "@/hooks/useCounsellingModal";
import type { CategoryId } from "@/lib/types";

interface CourseEnquireStickyBarProps {
  defaultExam?: CategoryId;
}

/** Mobile sticky bar — opens the shared enquiry modal. */
export function CourseEnquireStickyBar({
  defaultExam,
}: CourseEnquireStickyBarProps) {
  const { openCounsellingModal } = useCounsellingModal();

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-section-beige bg-white/95 p-3 backdrop-blur md:hidden">
      <button
        type="button"
        onClick={() =>
          openCounsellingModal({ mode: "enquiry", defaultExam })
        }
        className="btn-primary-premium premium-border-glow glow-accent-orange inline-flex h-11 w-full items-center justify-center rounded-md bg-orange-500 text-body font-semibold text-white"
      >
        Enquire Now
      </button>
    </div>
  );
}
