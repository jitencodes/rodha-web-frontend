"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { ArrowRightLeft, Clock3 } from "lucide-react";
import { CourseChangeDialog } from "@/components/account/course-changes/CourseChangeDialog";
import type { CourseChangeOptionsViewModel } from "@/lib/api/modules/student/course-changes/types";
import { fetchAuthed } from "@/lib/auth/session-expired";

type CourseChangeCtaProps = {
  courseId: string;
  courseTitle: string;
};

const CTA_CLASS =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[var(--account-radius)] border border-[var(--account-accent)] px-4 text-[13px] font-semibold text-[var(--account-accent)] transition-colors hover:bg-[var(--account-nav-active-bg)]";

async function fetchOptions(
  courseId: string
): Promise<CourseChangeOptionsViewModel | null> {
  try {
    const res = await fetchAuthed(
      `/api/account/course-changes/options?courseId=${encodeURIComponent(courseId)}`
    );
    const json = (await res.json().catch(() => null)) as {
      ok?: boolean;
      data?: CourseChangeOptionsViewModel;
    } | null;
    return res.ok && json?.ok ? (json.data ?? null) : null;
  } catch {
    return null;
  }
}

/**
 * "Request course change" on the course page.
 * - Feature off, or nothing to switch to: hidden.
 * - Open request for this course: "under review" link.
 * - Any other block (cooldown, limit, request for another course): disabled
 *   with the reason.
 */
export function CourseChangeCta({ courseId, courseTitle }: CourseChangeCtaProps) {
  const [data, setData] = useState<CourseChangeOptionsViewModel | null>(null);
  const [open, setOpen] = useState(false);
  const noteId = useId();

  useEffect(() => {
    let cancelled = false;
    void fetchOptions(courseId).then((next) => {
      if (!cancelled) setData(next);
    });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  // A request may have been submitted (or found blocked) in the dialog.
  const close = useCallback(() => {
    setOpen(false);
    void fetchOptions(courseId).then((next) => {
      if (next) setData(next);
    });
  }, [courseId]);

  if (!data) return null;
  const { summary } = data;
  if (!summary.enabled || summary.blockedReason === "DISABLED") return null;

  if (data.pendingForCourse) {
    return (
      <Link
        href="/account/course-changes"
        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[var(--account-radius)] bg-[var(--account-status-pending-bg)] px-4 text-[13px] font-semibold text-[var(--account-status-pending-text)]"
      >
        <Clock3 className="size-4" aria-hidden />
        Course switch under review
      </Link>
    );
  }
  if (!summary.canRequest) {
    const reason =
      summary.blockedMessage || "You cannot request a course change right now.";
    const note =
      summary.blockedReason === "COOLDOWN" && summary.nextAllowedLabel
        ? `${reason} You can request again on ${summary.nextAllowedLabel}.`
        : reason;
    return (
      <div className="flex flex-col gap-1 sm:max-w-64 sm:items-end">
        <button
          type="button"
          disabled
          aria-describedby={noteId}
          className="inline-flex h-10 shrink-0 cursor-not-allowed items-center justify-center gap-2 rounded-[var(--account-radius)] border border-[var(--account-border-strong)] px-4 text-[13px] font-semibold text-[var(--account-text-muted)] opacity-60"
        >
          <ArrowRightLeft className="size-4" aria-hidden />
          Request course change
        </button>
        <p
          id={noteId}
          className="text-[11px] leading-snug text-[var(--account-text-muted)] sm:text-right"
        >
          {note}
        </p>
      </div>
    );
  }
  // Allowed to request, but this course has nothing to switch to.
  if (!data.changeable) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${CTA_CLASS} cursor-pointer`}
      >
        <ArrowRightLeft className="size-4" aria-hidden />
        Request course change
      </button>
      {open ? (
        <CourseChangeDialog
          courseId={courseId}
          courseTitle={courseTitle}
          initial={data}
          onClose={close}
        />
      ) : null}
    </>
  );
}
