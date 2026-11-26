"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { cn } from "@/lib/utils";

type CourseArchiveButtonProps = {
  courseId: string;
  courseTitle: string;
  archived: boolean;
  /** `card`: text button beside View. `header`: outlined, like other course CTAs. */
  variant?: "card" | "header";
  onChanged?: (courseId: string, archived: boolean) => void;
};

async function saveArchived(courseId: string, archived: boolean): Promise<void> {
  let res: Response;
  try {
    res = await fetchAuthed(
      `/api/account/courses/${encodeURIComponent(courseId)}/archive`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived }),
      }
    );
  } catch {
    throw new Error("Something went wrong. Check your connection and try again.");
  }
  const data = (await res.json().catch(() => null)) as {
    ok?: boolean;
    error?: string;
  } | null;
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || "Unable to update this course.");
  }
}

/** Archive / Restore a course, with Undo. Only the student's own list changes. */
export function CourseArchiveButton({
  courseId,
  courseTitle,
  archived,
  variant = "card",
  onChanged,
}: CourseArchiveButtonProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  // Stays busy until the refreshed list has rendered.
  const [refreshing, startRefresh] = useTransition();
  const busy = saving || refreshing;
  const label = archived ? "Restore" : "Archive";
  const Icon = busy ? Loader2 : archived ? ArchiveRestore : Archive;

  async function change(next: boolean, canUndo: boolean) {
    setSaving(true);
    try {
      await saveArchived(courseId, next);
      onChanged?.(courseId, next);
      toast.success(
        next ? "Course archived successfully" : "Course restored successfully",
        canUndo
          ? {
              description: courseTitle,
              action: { label: "Undo", onClick: () => void change(!next, false) },
            }
          : { description: courseTitle }
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update this course."
      );
    } finally {
      setSaving(false);
      // Also after an error: a 404 means the list on screen is out of date.
      startRefresh(() => router.refresh());
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      aria-busy={busy}
      aria-label={`${label} ${courseTitle}`}
      onClick={() => void change(!archived, true)}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center text-[13px] font-semibold transition-colors disabled:cursor-wait disabled:opacity-60",
        variant === "header"
          ? "h-10 shrink-0 gap-2 rounded-[var(--account-radius)] border border-[var(--account-accent)] px-4 text-[var(--account-accent)] hover:bg-[var(--account-nav-active-bg)]"
          : "gap-1.5 rounded-lg px-2 py-1.5 text-[var(--account-text-muted)] hover:bg-[var(--account-nav-hover)] hover:text-[var(--account-text)]"
      )}
    >
      <Icon
        className={cn(variant === "header" ? "size-4" : "size-3.5", busy && "animate-spin")}
        aria-hidden
      />
      {label}
    </button>
  );
}
