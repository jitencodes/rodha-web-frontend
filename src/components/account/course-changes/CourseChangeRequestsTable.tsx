"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ClampTooltip } from "@/components/ui/ClampTooltip";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { CourseChangeRequestViewModel } from "@/lib/api/modules/student/course-changes/types";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { cn } from "@/lib/utils";

const TOOLTIP_CLASS = "border-[#3a2418] bg-[#1a0f08] text-[#f5ebe3]";

const STATUS_CLASS: Record<CourseChangeRequestViewModel["status"], string> = {
  PENDING:
    "bg-[var(--account-status-pending-bg)] text-[var(--account-status-pending-text)]",
  APPROVED:
    "bg-[var(--account-status-active-bg)] text-[var(--account-status-active-text)]",
  REJECTED:
    "bg-[var(--account-status-refunded-bg)] text-[var(--account-status-refunded-text)]",
  CANCELLED:
    "bg-[var(--account-status-expired-bg)] text-[var(--account-status-expired-text)]",
};

const TH_CLASS =
  "px-4 py-3 text-caption font-semibold uppercase tracking-wide text-[var(--account-text-muted)]";

function StatusCell({ request }: { request: CourseChangeRequestViewModel }) {
  return (
    <div>
      <span
        className={cn(
          "inline-flex rounded-full px-2.5 py-0.5 text-caption font-medium",
          STATUS_CLASS[request.status]
        )}
      >
        {request.statusLabel}
      </span>
      {request.closedLabel ? (
        <p className="mt-1 text-caption text-[var(--account-text-muted)]">
          on {request.closedLabel}
        </p>
      ) : null}
      {request.adminRemark ? (
        <p className="mt-1 text-caption text-[var(--account-text-secondary)]">
          Remark: {request.adminRemark}
        </p>
      ) : null}
    </div>
  );
}

function CourseThumb({ src, title }: { src: string; title: string }) {
  return (
    <span className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5 lg:flex-col lg:items-start xl:flex-row xl:items-center">
      <span className="relative aspect-video w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--account-nav-hover)]">
        <Image src={src} alt="" fill className="object-cover" sizes="64px" />
      </span>
      <span className="min-w-0">
        <ClampTooltip
          text={title}
          lines={2}
          className="text-body-sm font-medium text-[var(--account-text)]"
          tooltipClassName={TOOLTIP_CLASS}
        />
      </span>
    </span>
  );
}

function SwitchCell({ request }: { request: CourseChangeRequestViewModel }) {
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2.5">
        <CourseThumb src={request.fromImageUrl} title={request.fromTitle} />
        <ArrowRight className="size-4 text-[var(--account-accent)]" aria-label="to" />
        <CourseThumb src={request.toImageUrl} title={request.toTitle} />
      </div>
      {request.packageTitle ? (
        <p className="mt-1.5 text-caption text-[var(--account-text-muted)]">
          {request.packageTitle}
        </p>
      ) : null}
    </div>
  );
}

/** Course switch history with Cancel for requests still under review. */
export function CourseChangeRequestsTable({
  requests,
}: {
  requests: CourseChangeRequestViewModel[];
}) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState<CourseChangeRequestViewModel | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function confirmCancel() {
    if (!cancelling || pending) return;
    setPending(true);
    setError("");
    try {
      const res = await fetchAuthed(
        `/api/account/course-changes/requests/${cancelling.id}/cancel`,
        { method: "POST" }
      );
      const json = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (!res.ok || !json?.ok) {
        setError(json?.error || "Unable to cancel this request.");
        // 409: it was reviewed meanwhile, so show its real status.
        if (res.status === 404 || res.status === 409) router.refresh();
        return;
      }
      toast.success("Course switch request cancelled");
      setCancelling(null);
      router.refresh();
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  function renderCancel(request: CourseChangeRequestViewModel) {
    if (!request.canCancel) return null;
    return (
      <button
        type="button"
        onClick={() => {
          setError("");
          setCancelling(request);
        }}
        className="inline-flex h-8 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-[var(--account-border-strong)] bg-[var(--account-surface)] px-3 text-caption font-medium text-[var(--account-text-secondary)] transition-colors hover:border-red-500 hover:text-red-500"
      >
        Cancel request
      </button>
    );
  }

  return (
    <div className="w-full min-w-0">
      <div className="hidden overflow-hidden rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] shadow-[var(--account-shadow)] lg:block">
        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--account-border)] bg-[var(--account-nav-hover)]/60">
                <th className={TH_CLASS}>Course switch</th>
                <th className={TH_CLASS}>Reason</th>
                <th className={TH_CLASS}>Requested on</th>
                <th className={TH_CLASS}>Status</th>
                <th className={TH_CLASS}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b border-[var(--account-border)] align-top last:border-b-0"
                >
                  <td className="w-[44%] px-4 py-3.5">
                    <SwitchCell request={request} />
                  </td>
                  <td className="max-w-[200px] px-4 py-3.5 text-body-sm text-[var(--account-text-secondary)]">
                    {request.reason ? (
                      <ClampTooltip
                        text={request.reason}
                        lines={2}
                        className="text-body-sm text-[var(--account-text-secondary)]"
                        tooltipClassName={TOOLTIP_CLASS}
                      />
                    ) : (
                      <span className="text-[var(--account-text-muted)]">Not given</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-body-sm text-[var(--account-text-secondary)]">
                    {request.requestedLabel}
                  </td>
                  <td className="max-w-[200px] px-4 py-3.5">
                    <StatusCell request={request} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {renderCancel(request)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ul className="flex flex-col gap-3 lg:hidden">
        {requests.map((request) => (
          <li
            key={request.id}
            className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4 shadow-[var(--account-shadow)]"
          >
            <SwitchCell request={request} />
            <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3">
              <div className="min-w-0">
                <dt className="text-caption text-[var(--account-text-muted)]">
                  Requested on
                </dt>
                <dd className="mt-0.5 text-body-sm text-[var(--account-text-secondary)]">
                  {request.requestedLabel}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-caption text-[var(--account-text-muted)]">Status</dt>
                <dd className="mt-1">
                  <StatusCell request={request} />
                </dd>
              </div>
              {request.reason ? (
                <div className="col-span-2 min-w-0">
                  <dt className="text-caption text-[var(--account-text-muted)]">Reason</dt>
                  <dd className="mt-0.5 break-words text-body-sm text-[var(--account-text-secondary)]">
                    {request.reason}
                  </dd>
                </div>
              ) : null}
            </dl>
            {request.canCancel ? (
              <div className="mt-4">{renderCancel(request)}</div>
            ) : null}
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={cancelling != null}
        title="Cancel this request?"
        description="A cancelled request still counts toward your change limit and the waiting period."
        confirmLabel="Cancel request"
        cancelLabel="Keep request"
        variant="danger"
        confirming={pending}
        disableDismiss={pending}
        onConfirm={() => void confirmCancel()}
        onCancel={() => {
          if (pending) return;
          setCancelling(null);
          setError("");
        }}
      >
        {cancelling ? (
          <p className="mt-3 text-[13px] text-[var(--account-text-secondary)]">
            {cancelling.fromTitle} → {cancelling.toTitle}
          </p>
        ) : null}
        {error ? (
          <p className="mt-3 text-[12px] text-red-500" role="alert">
            {error}
          </p>
        ) : null}
      </ConfirmDialog>
    </div>
  );
}
