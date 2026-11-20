"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { FileText, X } from "lucide-react";
import { AccountThemedPortal } from "@/components/account/AccountThemedPortal";
import { DiscountRequestStatusBadge } from "@/components/account/discount-requests/DiscountRequestStatusBadge";
import { DiscountValidityCountdown } from "@/components/account/discount-requests/DiscountValidityCountdown";
import {
  DISCOUNT_ISSUER_LABEL,
  DISCOUNT_SCORE_TYPE_LABEL,
  discountStatusMessage,
  formatDiscountDate,
} from "@/lib/api/modules/student/discount-requests/mapper";
import type {
  DiscountRequestApi,
  DiscountRequestFileApi,
  DiscountRequestFileLinkApi,
  DiscountRequestSchoolApi,
} from "@/lib/api/modules/student/discount-requests/types";
import { websiteCategoryHeaders } from "@/lib/api/website-category";
import { fetchAuthed } from "@/lib/auth/session-expired";

type DiscountRequestDetailDrawerProps = {
  /** List copy shown immediately; refreshed from the detail API on open. */
  request: DiscountRequestApi | null;
  /** Deep-link id when the request isn't in the list. */
  requestId: string;
  onClose: () => void;
  onResubmit?: (request: DiscountRequestApi) => void;
};

function categoryHeaders(request: DiscountRequestApi | null) {
  return websiteCategoryHeaders(request?.item?.websiteCategoryId);
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex justify-between gap-4 py-1.5 text-[13px]">
      <dt className="shrink-0 text-[var(--account-text-muted)]">{label}</dt>
      <dd className="min-w-0 text-right font-medium text-[var(--account-text)]">{value}</dd>
    </div>
  );
}

function schoolRows(label: string, school: DiscountRequestSchoolApi | null | undefined) {
  if (!school) return null;
  const score =
    school.score != null
      ? `${school.score}${school.scoreFormat === "CGPA" ? " CGPA" : "%"}`
      : "";
  return (
    <div>
      <p className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-[var(--account-text-muted)]">
        {label}
      </p>
      <dl className="divide-y divide-[var(--account-border)]">
        <Row label="Board" value={school.board?.name} />
        <Row label="State board" value={school.stateBoardName} />
        <Row label="School" value={school.school} />
        <Row label="Score" value={score} />
        <Row label="Year of passing" value={school.yearOfPassing} />
      </dl>
    </div>
  );
}

export function DiscountRequestDetailDrawer({
  request: listRequest,
  requestId,
  onClose,
  onResubmit,
}: DiscountRequestDetailDrawerProps) {
  const titleId = useId();
  const [request, setRequest] = useState<DiscountRequestApi | null>(listRequest);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [openingFileId, setOpeningFileId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetchAuthed(
          `/api/discount-requests/${encodeURIComponent(requestId)}`,
          { headers: categoryHeaders(listRequest), cache: "no-store" }
        );
        const data = (await res.json().catch(() => null)) as {
          ok?: boolean;
          error?: string;
          data?: DiscountRequestApi;
        } | null;
        if (cancelled) return;
        if (!res.ok || !data?.ok || !data.data) {
          if (!listRequest) {
            setLoadError(data?.error || "Unable to load this discount request.");
          }
          return;
        }
        setRequest(data.data);
      } catch {
        if (!cancelled && !listRequest) {
          setLoadError("Unable to load this discount request.");
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [requestId, listRequest]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  /** Signed link expires in ~5 min — fetch on every click, never cache. */
  async function openFile(file: DiscountRequestFileApi) {
    if (!request || openingFileId != null) return;
    setFileError(null);
    setOpeningFileId(file.id);
    // Open the tab synchronously so pop-up blockers allow it.
    const tab = window.open("", "_blank");
    try {
      const res = await fetchAuthed(
        `/api/discount-requests/${request.id}/files/${file.id}`,
        { headers: categoryHeaders(request), cache: "no-store" }
      );
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        data?: DiscountRequestFileLinkApi;
      } | null;
      if (!res.ok || !data?.ok || !data.data?.url) {
        throw new Error(data?.error || "Unable to open this file.");
      }
      if (tab) {
        tab.opener = null;
        tab.location.href = data.data.url;
      } else {
        window.location.assign(data.data.url);
      }
    } catch (err) {
      tab?.close();
      setFileError(err instanceof Error ? err.message : "Unable to open this file.");
    } finally {
      setOpeningFileId(null);
    }
  }

  const packageHref = request?.item?.slug ? `/courses/${request.item.slug}` : null;

  return (
    <AccountThemedPortal>
      <div className="fixed inset-0 z-[100] flex justify-end">
        <button
          type="button"
          aria-label="Close"
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative z-[101] flex h-full w-full max-w-md flex-col border-l border-[var(--account-border)] bg-[var(--account-surface)] shadow-xl"
        >
          <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--account-border)] px-5 py-4">
            <div className="min-w-0">
              <h2
                id={titleId}
                className="font-montserrat text-base font-bold text-[var(--account-text)]"
              >
                Discount request{request ? ` #${request.id}` : ""}
              </h2>
              {request?.item?.title ? (
                <p className="mt-0.5 truncate text-[13px] text-[var(--account-text-muted)]">
                  {request.item.title}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg p-1.5 text-[var(--account-text-muted)] hover:bg-[var(--account-nav-hover)]"
            >
              <X className="size-4" aria-hidden />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {!request ? (
              loadError ? (
                <p className="text-body-sm text-[var(--account-text-muted)]">{loadError}</p>
              ) : (
                <div className="space-y-3" role="status">
                  <div className="h-16 animate-shimmer rounded-[var(--account-radius)]" />
                  <div className="h-32 animate-shimmer rounded-[var(--account-radius)]" />
                  <span className="sr-only">Loading…</span>
                </div>
              )
            ) : (
              <div className="space-y-5">
                <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold text-[var(--account-text)]">
                      {request.discountTypeName || request.discountType}
                    </span>
                    <DiscountRequestStatusBadge status={request.status} />
                  </div>
                  <p className="mt-2 text-[13px] text-[var(--account-text-secondary)]">
                    {discountStatusMessage(request)}
                  </p>
                  {request.status === "APPROVED" && request.validTill ? (
                    <DiscountValidityCountdown
                      validTill={request.validTill}
                      className="mt-1 block text-[12px] text-[var(--account-status-active-text)]"
                    />
                  ) : null}
                </div>

                <dl className="divide-y divide-[var(--account-border)]">
                  <Row label="Requested on" value={formatDiscountDate(request.createdAt)} />
                  <Row label="Reviewed on" value={formatDiscountDate(request.reviewedAt)} />
                  {request.status === "PENDING" && (request.suggestedPercent ?? 0) > 0 ? (
                    <Row label="Suggested discount" value={`${request.suggestedPercent}%`} />
                  ) : null}
                  {request.promocode ? (
                    <Row label="Discount code" value={request.promocode.code} />
                  ) : null}
                  <Row label="Valid till" value={formatDiscountDate(request.validTill)} />
                  {request.usedOrderId ? (
                    <Row label="Order" value={`#${request.usedOrderId}`} />
                  ) : null}
                </dl>

                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[var(--account-text-muted)]">
                    Details submitted
                  </p>
                  {request.discountType === "COLLEGE" ? (
                    <dl className="divide-y divide-[var(--account-border)]">
                      <Row label="College" value={request.college?.name} />
                      <Row label="City" value={request.collegeCity} />
                      <Row label="State" value={request.collegeState?.name} />
                    </dl>
                  ) : null}
                  {request.discountType === "ACADEMIC" ? (
                    <>
                      {schoolRows("Class 10", request.class10)}
                      {schoolRows("Class 12", request.class12)}
                    </>
                  ) : null}
                  {request.discountType === "EWS" && request.ews ? (
                    <dl className="divide-y divide-[var(--account-border)]">
                      <Row
                        label="Annual family income"
                        value={
                          request.ews.annualFamilyIncome != null
                            ? `₹${request.ews.annualFamilyIncome.toLocaleString("en-IN")}`
                            : ""
                        }
                      />
                      <Row
                        label="Issued by"
                        value={
                          request.ews.certificateIssuedBy
                            ? DISCOUNT_ISSUER_LABEL[request.ews.certificateIssuedBy]
                            : ""
                        }
                      />
                      <Row label="Issuing authority" value={request.ews.certificateIssuingAuthority} />
                      <Row
                        label="Issue date"
                        value={formatDiscountDate(request.ews.certificateIssueDate)}
                      />
                    </dl>
                  ) : null}
                  {request.discountType === "PREV_ATTEMPT" && request.prevAttempt ? (
                    <dl className="divide-y divide-[var(--account-border)]">
                      <Row label="Exam" value={request.prevAttempt.exam?.name} />
                      <Row label="Year" value={request.prevAttempt.year} />
                      <Row
                        label={
                          request.prevAttempt.scoreType
                            ? DISCOUNT_SCORE_TYPE_LABEL[request.prevAttempt.scoreType]
                            : "Score"
                        }
                        value={
                          request.prevAttempt.stage?.name ??
                          (request.prevAttempt.score != null ? request.prevAttempt.score : "")
                        }
                      />
                    </dl>
                  ) : null}
                </div>

                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-[var(--account-text-muted)]">
                    Proofs
                  </p>
                  {request.proofsPurgedAt ? (
                    <p className="mt-2 text-[13px] text-[var(--account-text-muted)]">
                      Proof files were removed after review.
                    </p>
                  ) : (request.files ?? []).length === 0 ? (
                    <p className="mt-2 text-[13px] text-[var(--account-text-muted)]">
                      No files.
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {(request.files ?? []).map((file) => (
                        <li key={file.id}>
                          <button
                            type="button"
                            onClick={() => void openFile(file)}
                            disabled={openingFileId != null}
                            className="flex w-full items-center gap-3 rounded-[var(--account-radius)] border border-[var(--account-border)] px-3 py-2.5 text-left transition-colors hover:border-[var(--account-accent)] disabled:opacity-60"
                          >
                            <FileText className="size-4 shrink-0 text-[var(--account-accent)]" aria-hidden />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-medium text-[var(--account-text)]">
                                {file.label || file.originalName || "File"}
                              </span>
                              {file.originalName ? (
                                <span className="block truncate text-[11px] text-[var(--account-text-muted)]">
                                  {file.originalName}
                                </span>
                              ) : null}
                            </span>
                            <span className="shrink-0 text-[12px] font-semibold text-[var(--account-accent)]">
                              {openingFileId === file.id ? "Opening…" : "View"}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {fileError ? (
                    <p className="mt-2 text-[12px] text-red-500" role="alert">
                      {fileError}
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {request ? (
            <footer className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-[var(--account-border)] px-5 py-3">
              {request.status === "REJECTED" && onResubmit ? (
                <button
                  type="button"
                  onClick={() => onResubmit(request)}
                  className="inline-flex items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
                >
                  Resubmit
                </button>
              ) : null}
              {request.status === "APPROVED" && packageHref ? (
                <Link
                  href={packageHref}
                  className="inline-flex items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90"
                >
                  Buy now
                </Link>
              ) : null}
              {(request.status === "EXPIRED" || request.status === "REVOKED") && packageHref ? (
                <Link
                  href={packageHref}
                  className="inline-flex items-center justify-center rounded-[var(--account-radius)] border border-[var(--account-accent)] px-4 py-2 text-[13px] font-semibold text-[var(--account-accent)] hover:bg-[var(--account-accent-soft)]"
                >
                  Request again
                </Link>
              ) : null}
            </footer>
          ) : null}
        </aside>
      </div>
    </AccountThemedPortal>
  );
}
