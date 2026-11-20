"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AccountThemedPortal } from "@/components/account/AccountThemedPortal";
import { AccountCheckbox } from "@/components/account/forms/AccountCheckbox";
import { AccountDateField } from "@/components/account/forms/AccountDateField";
import { AccountFileUpload } from "@/components/account/forms/AccountFileUpload";
import { AccountRadioGroup } from "@/components/account/forms/AccountRadioGroup";
import { AccountSelect } from "@/components/account/forms/AccountSelect";
import { AccountTextField } from "@/components/account/forms/AccountTextField";
import { AccountFieldShell } from "@/components/account/forms/AccountFieldShell";
import {
  ACADEMIC_MIN_YEAR,
  DISCOUNT_FILE_LABEL,
  buildDiscountFormData,
  carriedOverFiles,
  createDiscountFormValues,
  currentYearIst,
  digitsOnly,
  discountVerticalOptions,
  formatIndianNumber,
  todayIst,
  validateDiscountForm,
  validateDiscountProof,
  type DiscountFileField,
  type DiscountFormErrors,
  type DiscountFormValues,
  type DiscountSchoolValues,
} from "@/lib/account/discount-request-form";
import {
  DISCOUNT_ISSUER_LABEL,
  DISCOUNT_SCORE_TYPE_LABEL,
} from "@/lib/api/modules/student/discount-requests/mapper";
import type {
  DiscountConfigViewModel,
  DiscountRequestApi,
  DiscountTypeCode,
} from "@/lib/api/modules/student/discount-requests/types";
import { websiteCategoryHeaders } from "@/lib/api/website-category";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { cn } from "@/lib/utils";

export type DiscountStudentInfo = {
  name: string;
  email: string;
  mobile: string;
};

type DiscountRequestDialogProps = {
  open: boolean;
  onClose: () => void;
  packageId: number;
  packageTitle: string;
  websiteCategoryId: number | null;
  student: DiscountStudentInfo;
  /** A REJECTED request → resubmit mode (pre-filled, files optional). */
  resubmitRequest?: DiscountRequestApi | null;
  onSubmitted?: (request: DiscountRequestApi | null) => void;
};

const PROOF_ACCEPT =
  "application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png";
const DECLARATION_TEXT =
  "I confirm the details and documents are genuine. Rodha may cancel the discount or course access if they are found false.";
const SCORE_FORMAT_OPTIONS = [
  { value: "PERCENTAGE", label: "Percentage" },
  { value: "CGPA", label: "CGPA" },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-montserrat text-base font-bold text-[var(--account-text)]">
      {children}
    </h3>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

function yearOptions(): Array<{ value: string; label: string }> {
  const out: Array<{ value: string; label: string }> = [];
  for (let year = currentYearIst(); year >= ACADEMIC_MIN_YEAR; year -= 1) {
    out.push({ value: String(year), label: String(year) });
  }
  return out;
}

type ConfigState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; config: DiscountConfigViewModel };

async function fetchDiscountConfig(
  headers: Record<string, string> | undefined
): Promise<{ config: DiscountConfigViewModel } | { error: string }> {
  const fallback = "Unable to load the discount form.";
  try {
    const res = await fetchAuthed("/api/discount-requests/config", {
      headers,
      cache: "no-store",
    });
    const data = (await res.json().catch(() => null)) as {
      ok?: boolean;
      error?: string;
      data?: DiscountConfigViewModel;
    } | null;
    if (!res.ok || !data?.ok || !data.data) {
      return { error: data?.error || fallback };
    }
    return { config: data.data };
  } catch {
    return { error: fallback };
  }
}

export function DiscountRequestDialog({
  open,
  onClose,
  packageId,
  packageTitle,
  websiteCategoryId,
  student,
  resubmitRequest = null,
  onSubmitted,
}: DiscountRequestDialogProps) {
  const titleId = useId();
  const formId = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [configState, setConfigState] = useState<ConfigState>({ status: "loading" });
  const [values, setValues] = useState<DiscountFormValues | null>(null);
  const [errors, setErrors] = useState<DiscountFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const categoryHeader = useMemo(
    () => websiteCategoryHeaders(websiteCategoryId),
    [websiteCategoryId]
  );
  const carried = useMemo(() => carriedOverFiles(resubmitRequest), [resubmitRequest]);
  const isResubmit = Boolean(resubmitRequest);

  /** Bumped by "Try again" to refetch the config. */
  const [configReloadKey, setConfigReloadKey] = useState(0);

  // Callers mount the dialog only while open, so state starts clean each time.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void fetchDiscountConfig(categoryHeader).then((result) => {
      if (cancelled) return;
      if ("error" in result) {
        setConfigState({ status: "error", message: result.error });
        return;
      }
      setConfigState({ status: "ready", config: result.config });
      setValues(
        createDiscountFormValues(result.config, {
          request: resubmitRequest,
          defaultVerticalId:
            websiteCategoryId != null ? String(websiteCategoryId) : undefined,
        })
      );
    });
    return () => {
      cancelled = true;
    };
  }, [open, categoryHeader, resubmitRequest, websiteCategoryId, configReloadKey]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) onClose();
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, submitting]);

  const config = configState.status === "ready" ? configState.config : null;
  const years = useMemo(() => yearOptions(), []);

  function update(patch: Partial<DiscountFormValues>, clear: string[] = []) {
    setValues((prev) => (prev ? { ...prev, ...patch } : prev));
    if (clear.length) {
      setErrors((prev) => {
        const next = { ...prev };
        for (const key of clear) delete next[key];
        return next;
      });
    }
  }

  function updateSchool(
    prefix: "class10" | "class12",
    patch: Partial<DiscountSchoolValues>,
    clear: string[]
  ) {
    setValues((prev) =>
      prev ? { ...prev, [prefix]: { ...prev[prefix], ...patch } } : prev
    );
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of clear) delete next[`${prefix}${key}`];
      return next;
    });
  }

  function setFile(field: DiscountFileField, file: File | null) {
    update(
      { files: { ...(values?.files ?? {}), [field]: file } },
      [field]
    );
  }

  function scrollToFirstError() {
    requestAnimationFrame(() => {
      bodyRef.current
        ?.querySelector('[role="alert"]')
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  async function submit() {
    if (!config || !values || submitting) return;
    const nextErrors = validateDiscountForm(values, config, isResubmit ? carried : {});
    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) {
      scrollToFirstError();
      return;
    }

    setSubmitting(true);
    try {
      const form = buildDiscountFormData(values, packageId, config);
      const url = resubmitRequest
        ? `/api/discount-requests/${resubmitRequest.id}/resubmit`
        : "/api/discount-requests";
      const res = await fetchAuthed(url, {
        method: "POST",
        headers: categoryHeader,
        body: form,
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        errors?: Record<string, string>;
        data?: DiscountRequestApi;
      } | null;
      if (!res.ok || !data?.ok) {
        if (data?.errors && Object.keys(data.errors).length) {
          setErrors(data.errors);
          scrollToFirstError();
        }
        setFormError(data?.error || "Unable to submit your discount request.");
        return;
      }
      toast.success(`Request received. ${config.reviewSlaText}`);
      onSubmitted?.(data.data ?? null);
      onClose();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Unable to submit your discount request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const proofHelper = (field: DiscountFileField) => {
    const max = config ? Math.round(config.maxFileBytes / (1024 * 1024)) : 5;
    const base = `PDF, JPG or PNG, max ${max} MB.`;
    return isResubmit && carried[field]
      ? `${base} Leave empty to keep the file you uploaded earlier.`
      : base;
  };

  const renderFile = (field: DiscountFileField) =>
    config && values ? (
      <AccountFileUpload
        key={field}
        id={`${formId}-${field}`}
        label={DISCOUNT_FILE_LABEL[field]}
        file={values.files[field] ?? null}
        onChange={(file) => setFile(field, file)}
        required={!(isResubmit && carried[field])}
        error={errors[field]}
        helperText={proofHelper(field)}
        accept={PROOF_ACCEPT}
        validate={(file) => validateDiscountProof(file, config)}
        uploadLabel="Upload file"
        existingFileName={isResubmit ? carried[field] : undefined}
        disabled={submitting}
      />
    ) : null;

  const renderSchool = (prefix: "class10" | "class12", heading: string) => {
    if (!config || !values) return null;
    const school = values[prefix];
    const boards = prefix === "class10" ? config.class10Boards : config.class12Boards;
    const board = boards.find((entry) => entry.id === school.boardId);
    return (
      <section className="space-y-4">
        <SectionHeading>{heading}</SectionHeading>
        <Grid>
          <AccountSelect
            id={`${formId}-${prefix}-board`}
            label="Board"
            value={school.boardId}
            onChange={(boardId) =>
              updateSchool(prefix, { boardId }, ["BoardId", "StateBoardName"])
            }
            options={boards.map((entry) => ({ value: entry.id, label: entry.name }))}
            required
            error={errors[`${prefix}BoardId`]}
            disabled={submitting}
          />
          {board?.needsStateBoardName ? (
            <AccountTextField
              id={`${formId}-${prefix}-stateBoard`}
              label="State board name"
              value={school.stateBoardName}
              onChange={(stateBoardName) =>
                updateSchool(prefix, { stateBoardName }, ["StateBoardName"])
              }
              maxLength={100}
              required
              error={errors[`${prefix}StateBoardName`]}
              disabled={submitting}
            />
          ) : null}
          <AccountTextField
            id={`${formId}-${prefix}-school`}
            label="School name"
            value={school.school}
            onChange={(value) => updateSchool(prefix, { school: value }, ["School"])}
            maxLength={150}
            required
            error={errors[`${prefix}School`]}
            disabled={submitting}
          />
          <AccountSelect
            id={`${formId}-${prefix}-year`}
            label="Year of passing"
            value={school.yearOfPassing}
            onChange={(yearOfPassing) =>
              updateSchool(prefix, { yearOfPassing }, ["YearOfPassing"])
            }
            options={years}
            required
            error={errors[`${prefix}YearOfPassing`]}
            disabled={submitting}
          />
          <AccountRadioGroup
            id={`${formId}-${prefix}-format`}
            label="Score format"
            value={school.scoreFormat}
            onChange={(value) =>
              updateSchool(
                prefix,
                { scoreFormat: value as DiscountSchoolValues["scoreFormat"] },
                ["ScoreFormat", "Score"]
              )
            }
            options={SCORE_FORMAT_OPTIONS}
            required
            error={errors[`${prefix}ScoreFormat`]}
            disabled={submitting}
          />
          <AccountTextField
            id={`${formId}-${prefix}-score`}
            label={school.scoreFormat === "CGPA" ? "CGPA (0–10)" : "Percentage (0–100)"}
            value={school.score}
            onChange={(score) => updateSchool(prefix, { score }, ["Score"])}
            inputMode="decimal"
            required
            error={errors[`${prefix}Score`]}
            disabled={submitting}
          />
        </Grid>
        {renderFile(prefix === "class10" ? "class10Marksheet" : "class12Marksheet")}
      </section>
    );
  };

  const renderSection = (type: DiscountTypeCode) => {
    if (!config || !values) return null;

    if (type === "COLLEGE") {
      return (
        <section className="space-y-4">
          <SectionHeading>College details</SectionHeading>
          <AccountSelect
            id={`${formId}-college`}
            label="College"
            value={values.collegeId}
            onChange={(collegeId) => {
              const college = config.colleges.find((entry) => entry.id === collegeId);
              update(
                {
                  collegeId,
                  collegeCity: college?.city || values.collegeCity,
                  collegeStateId: college?.stateId || values.collegeStateId,
                },
                ["collegeId", "collegeCity", "collegeStateId"]
              );
            }}
            options={config.colleges.map((college) => ({
              value: college.id,
              label: college.city ? `${college.name}, ${college.city}` : college.name,
            }))}
            placeholder="Search your college"
            helperText="Not in the list? Your college is not eligible for this discount."
            required
            error={errors.collegeId}
            disabled={submitting}
          />
          <Grid>
            <AccountTextField
              id={`${formId}-collegeCity`}
              label="City"
              value={values.collegeCity}
              onChange={(collegeCity) => update({ collegeCity }, ["collegeCity"])}
              maxLength={100}
              required
              error={errors.collegeCity}
              disabled={submitting}
            />
            <AccountSelect
              id={`${formId}-collegeState`}
              label="State"
              value={values.collegeStateId}
              onChange={(collegeStateId) => update({ collegeStateId }, ["collegeStateId"])}
              options={config.states.map((state) => ({ value: state.id, label: state.name }))}
              required
              error={errors.collegeStateId}
              disabled={submitting}
            />
          </Grid>
          <Grid>
            {renderFile("collegeIdCard")}
            {renderFile("bonafideCertificate")}
          </Grid>
        </section>
      );
    }

    if (type === "ACADEMIC") {
      return (
        <>
          {renderSchool("class10", "Class 10")}
          {renderSchool("class12", "Class 12")}
        </>
      );
    }

    if (type === "EWS") {
      return (
        <section className="space-y-4">
          <SectionHeading>EWS details</SectionHeading>
          <Grid>
            <AccountTextField
              id={`${formId}-income`}
              label="Annual family income (₹)"
              value={formatIndianNumber(values.annualFamilyIncome)}
              onChange={(raw) =>
                update({ annualFamilyIncome: digitsOnly(raw) }, ["annualFamilyIncome"])
              }
              inputMode="numeric"
              placeholder="4,50,000"
              required
              error={errors.annualFamilyIncome}
              disabled={submitting}
            />
            <AccountDateField
              id={`${formId}-issueDate`}
              label="Certificate issue date"
              value={values.certificateIssueDate}
              onChange={(certificateIssueDate) =>
                update({ certificateIssueDate }, ["certificateIssueDate"])
              }
              max={todayIst()}
              required
              error={errors.certificateIssueDate}
              disabled={submitting}
            />
          </Grid>
          <AccountRadioGroup
            id={`${formId}-issuer`}
            label="Certificate issued by"
            value={values.certificateIssuedBy}
            onChange={(value) =>
              update(
                { certificateIssuedBy: value as DiscountFormValues["certificateIssuedBy"] },
                ["certificateIssuedBy", "certificateIssuingAuthority"]
              )
            }
            options={config.certificateIssuers.map((issuer) => ({
              value: issuer,
              label: DISCOUNT_ISSUER_LABEL[issuer],
            }))}
            required
            error={errors.certificateIssuedBy}
            disabled={submitting}
          />
          {values.certificateIssuedBy === "OTHER" ? (
            <AccountTextField
              id={`${formId}-authority`}
              label="Issuing authority"
              value={values.certificateIssuingAuthority}
              onChange={(certificateIssuingAuthority) =>
                update({ certificateIssuingAuthority }, ["certificateIssuingAuthority"])
              }
              maxLength={150}
              required
              error={errors.certificateIssuingAuthority}
              disabled={submitting}
            />
          ) : null}
          {renderFile("ewsCertificate")}
        </section>
      );
    }

    // PREV_ATTEMPT
    const verticalOptions = discountVerticalOptions(config);
    const selectedVerticalId = String(values.prevVerticalId || "");
    const exams = config.exams.filter(
      (entry) => String(entry.verticalId) === selectedVerticalId
    );
    const exam = config.exams.find(
      (entry) => String(entry.id) === String(values.prevExamId)
    );
    const examYearOptions = (exam?.years ?? []).map((year) => ({
      value: String(year),
      label: String(year),
    }));
    const scoreLabel =
      exam?.scoreType === "PERCENTILE"
        ? "Percentile (0–100)"
        : exam?.scoreType === "RANK"
          ? "Rank"
          : exam?.scoreType === "MARKS"
            ? exam.maxMarks != null
              ? `Marks (0–${exam.maxMarks})`
              : "Marks"
            : "Score";
    return (
      <section className="space-y-4">
        <SectionHeading>Previous attempt</SectionHeading>
        <Grid>
          <AccountSelect
            id={`${formId}-vertical`}
            label="Vertical"
            value={selectedVerticalId}
            onChange={(prevVerticalId) =>
              update(
                {
                  prevVerticalId,
                  prevExamId: "",
                  prevExamYear: "",
                  prevScore: "",
                  prevStageId: "",
                },
                ["prevExamId", "prevExamYear", "prevScore", "prevStageId"]
              )
            }
            options={verticalOptions.map((vertical) => ({
              value: vertical.id,
              label: vertical.name,
            }))}
            placeholder={
              verticalOptions.length
                ? "Select vertical"
                : "No verticals available"
            }
            disabled={submitting || verticalOptions.length === 0}
          />
          <AccountSelect
            id={`${formId}-exam`}
            label="Exam"
            value={values.prevExamId}
            onChange={(prevExamId) =>
              update(
                {
                  prevExamId,
                  prevExamYear: "",
                  prevScore: "",
                  prevStageId: "",
                },
                ["prevExamId", "prevExamYear", "prevScore", "prevStageId"]
              )
            }
            options={exams.map((entry) => ({
              value: entry.id,
              label: entry.name,
            }))}
            placeholder={
              !selectedVerticalId
                ? "Select a vertical first"
                : exams.length
                  ? "Select exam"
                  : "No exams for this vertical"
            }
            required
            error={errors.prevExamId}
            disabled={submitting || exams.length === 0}
          />
          <AccountSelect
            id={`${formId}-examYear`}
            label="Exam year"
            value={values.prevExamYear}
            onChange={(prevExamYear) =>
              update({ prevExamYear }, ["prevExamYear"])
            }
            options={examYearOptions}
            placeholder={
              !exam
                ? "Select an exam first"
                : examYearOptions.length
                  ? "Select year"
                  : "No years for this exam"
            }
            required
            error={errors.prevExamYear}
            disabled={submitting || !exam || examYearOptions.length === 0}
          />
          <AccountFieldShell id={`${formId}-scoreType`} label="Score type">
            <div
              id={`${formId}-scoreType`}
              className="flex min-h-[46px] items-center rounded-[var(--account-radius)] border border-[var(--account-input-border)] bg-[var(--account-bg)] px-3 text-[15px] text-[var(--account-text)]"
              aria-live="polite"
            >
              {exam
                ? DISCOUNT_SCORE_TYPE_LABEL[exam.scoreType]
                : (
                    <span className="text-[var(--account-text-muted)]">
                      Select an exam first
                    </span>
                  )}
            </div>
          </AccountFieldShell>
          {exam?.scoreType === "QUALIFIED_STAGE" ? (
            <AccountSelect
              id={`${formId}-stage`}
              label="Stage qualified"
              value={values.prevStageId}
              onChange={(prevStageId) =>
                update({ prevStageId }, ["prevStageId"])
              }
              options={exam.stages.map((stage) => ({
                value: stage.id,
                label: stage.name,
              }))}
              required
              error={errors.prevStageId}
              disabled={submitting}
            />
          ) : (
            <AccountTextField
              id={`${formId}-score`}
              label={scoreLabel}
              value={values.prevScore}
              onChange={(prevScore) => update({ prevScore }, ["prevScore"])}
              inputMode={exam?.scoreType === "RANK" ? "numeric" : "decimal"}
              required
              error={errors.prevScore}
              disabled={submitting || !exam}
            />
          )}
        </Grid>
        {renderFile("examScorecard")}
      </section>
    );
  };

  const selectedType = values?.discountType || "";
  const typeMeta = config?.discountTypes.find((type) => type.code === selectedType);

  return (
    <AccountThemedPortal>
      <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
        <button
          type="button"
          aria-label="Close"
          className="absolute inset-0 bg-black/50"
          disabled={submitting}
          onClick={() => {
            if (!submitting) onClose();
          }}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative z-[101] flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-[var(--account-border)] bg-[var(--account-surface)] shadow-xl sm:rounded-2xl"
        >
          <header className="shrink-0 border-b border-[var(--account-border)] px-4 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2
                  id={titleId}
                  className="font-montserrat text-h4 font-bold text-[var(--account-text)]"
                >
                  {isResubmit ? "Resubmit discount request" : "Request Discount"}
                </h2>
                <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
                  {config?.reviewSlaText ||
                    "Share your details and proofs. We'll review them and apply your discount at checkout."}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-lg px-2 py-1 text-body-sm text-[var(--account-text-muted)] hover:bg-[var(--account-nav-hover)]"
              >
                Close
              </button>
            </div>
            {isResubmit && resubmitRequest?.rejectReason ? (
              <div
                role="note"
                className="mt-3 rounded-[var(--account-radius)] border border-red-200 bg-red-50 px-3 py-2 text-body-sm text-red-700"
              >
                Previous request rejected: {resubmitRequest.rejectReason}
              </div>
            ) : null}
          </header>

          <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            {configState.status === "loading" ? (
              <div className="space-y-3" role="status" aria-live="polite">
                <div className="h-11 animate-shimmer rounded-[var(--account-radius)]" />
                <div className="h-11 animate-shimmer rounded-[var(--account-radius)]" />
                <div className="h-24 animate-shimmer rounded-[var(--account-radius)]" />
                <span className="sr-only">Loading discount form…</span>
              </div>
            ) : null}

            {configState.status === "error" ? (
              <div className="py-6 text-center">
                <p className="text-body-sm text-[var(--account-text-muted)]">
                  {configState.message}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setConfigState({ status: "loading" });
                    setConfigReloadKey((key) => key + 1);
                  }}
                  className="mt-3 text-[14px] font-semibold text-[var(--account-accent)]"
                >
                  Try again
                </button>
              </div>
            ) : null}

            {config && values ? (
              config.discountTypes.length === 0 ? (
                <p className="py-6 text-center text-body-sm text-[var(--account-text-muted)]">
                  Discount requests are not available right now.
                </p>
              ) : (
                <form
                  id={formId}
                  className="space-y-6"
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    void submit();
                  }}
                >
                  <section className="space-y-4">
                    <Grid>
                      <AccountTextField
                        id={`${formId}-course`}
                        label="Course"
                        value={packageTitle}
                        onChange={() => {}}
                        readOnly
                      />
                      <AccountTextField
                        id={`${formId}-name`}
                        label="Name"
                        value={student.name}
                        onChange={() => {}}
                        readOnly
                      />
                      <AccountTextField
                        id={`${formId}-email`}
                        label="Email"
                        value={student.email}
                        onChange={() => {}}
                        readOnly
                      />
                      <AccountTextField
                        id={`${formId}-mobile`}
                        label="Mobile"
                        value={student.mobile}
                        onChange={() => {}}
                        readOnly
                      />
                    </Grid>
                    <AccountSelect
                      id={`${formId}-type`}
                      label="Discount type"
                      value={selectedType}
                      onChange={(value) =>
                        update({ discountType: value as DiscountTypeCode }, ["discountType"])
                      }
                      options={config.discountTypes.map((type) => ({
                        value: type.code,
                        label: type.name,
                      }))}
                      placeholder="Select discount type"
                      helperText={typeMeta?.helpText || undefined}
                      required
                      error={errors.discountType}
                      disabled={submitting}
                    />
                  </section>

                  {selectedType ? renderSection(selectedType) : null}

                  {selectedType ? (
                    <AccountCheckbox
                      id={`${formId}-declaration`}
                      label={DECLARATION_TEXT}
                      checked={values.declarationAccepted}
                      onChange={(declarationAccepted) =>
                        update({ declarationAccepted }, ["declarationAccepted"])
                      }
                      required
                      error={errors.declarationAccepted}
                      disabled={submitting}
                    />
                  ) : null}
                </form>
              )
            ) : null}
          </div>

          <footer className="flex shrink-0 flex-col gap-2 border-t border-[var(--account-border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p
              className={cn(
                "min-h-[1rem] text-caption",
                formError ? "text-red-500" : "text-[var(--account-text-muted)]"
              )}
              role={formError ? "alert" : undefined}
            >
              {formError ||
                (config?.validityDays
                  ? `Approved discounts stay valid for ${config.validityDays} days.`
                  : "")}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-[var(--account-radius)] border border-[var(--account-border-strong)] px-4 py-2 text-[13px] font-semibold text-[var(--account-text-secondary)] hover:bg-[var(--account-nav-hover)] disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="submit"
                form={formId}
                disabled={submitting || !config || !selectedType}
                className="inline-flex items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Submitting…"
                  : isResubmit
                    ? "Resubmit request"
                    : "Submit request"}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </AccountThemedPortal>
  );
}
