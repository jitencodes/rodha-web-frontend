"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  PROFILE_CAT_ATTEMPTS_OPTIONS,
  PROFILE_CLASS12_STATUS_OPTIONS,
  PROFILE_CONSENT_STATEMENTS,
  PROFILE_GENDER_OPTIONS,
  PROFILE_GRADUATION_STATUS_OPTIONS,
  PROFILE_LANGUAGE_OPTIONS,
  PROFILE_OTHER_VALUE,
  PROFILE_PARENT_RELATION_OPTIONS,
  PROFILE_PG_STATUS_OPTIONS,
  PROFILE_SCORING_SCHEME_OPTIONS,
  PROFILE_SOURCE_OPTIONS,
  PROFILE_YES_NO_OPTIONS,
  profilePassingYearOptions,
  profilePreviousCatYearOptions,
  profileTargetYearOptions,
} from "@/data/account/profile-options";
import {
  filterCollegesByVertical,
  filterExamsByVertical,
  getEducationLevel,
  nameOptionsFromMasters,
} from "@/lib/api/modules/student/registration/mapper";
import type { StudentRegistrationFormViewModel } from "@/lib/api/modules/student/registration/types";
import {
  buildRegistrationFormData,
  calculateAge,
  class12AppearingAllowed,
  classifyCurrentStatus,
  createEmptyRegistrationForm,
  needsGradOrWorking,
  needsHigherEducation,
  validateRegistrationStep,
  type RegistrationFieldErrors,
  type RegistrationFormValues,
} from "@/lib/account/registration-form";
import { fetchAuthed } from "@/lib/auth/session-expired";
import {
  isBlockedPhoneKey,
  sanitizePhoneInput,
} from "@/lib/form-validation";
import { cn } from "@/lib/utils";
import { AccountCheckbox } from "@/components/account/forms/AccountCheckbox";
import { AccountDateField } from "@/components/account/forms/AccountDateField";
import { AccountFileUpload } from "@/components/account/forms/AccountFileUpload";
import { AccountMultiSelect } from "@/components/account/forms/AccountMultiSelect";
import { AccountRadioGroup } from "@/components/account/forms/AccountRadioGroup";
import { AccountSelect } from "@/components/account/forms/AccountSelect";
import { AccountTextField } from "@/components/account/forms/AccountTextField";

type RegistrationDialogProps = {
  open: boolean;
  registration: StudentRegistrationFormViewModel;
  onClose: () => void;
  onSubmitted?: () => void;
  /** When true, dialog cannot be dismissed without submitting (gate). */
  required?: boolean;
  /** ISO deadline from dashboard registration status. */
  deadlineAt?: string | null;
  /** Past deadline without submit. */
  overdue?: boolean;
  /** Optional override for the header alert strip. */
  bannerMessage?: string | null;
};

const STEPS = [
  "Enrolment & Personal",
  "Academics & Work",
  "Goals, Books & Consent",
] as const;

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-montserrat text-base font-bold text-[var(--account-text)]">
      {children}
    </h3>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
  );
}

function formatDeadlineLabel(deadlineAt: string | null | undefined): string {
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

export function RegistrationDialog({
  open,
  registration,
  onClose,
  onSubmitted,
  required = false,
  deadlineAt = null,
  overdue = false,
  bannerMessage = null,
}: RegistrationDialogProps) {
  const titleId = useId();
  const formId = useId();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [values, setValues] = useState<RegistrationFormValues>(() =>
    createEmptyRegistrationForm(registration)
  );
  const [errors, setErrors] = useState<RegistrationFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  const targetYears = useMemo(() => profileTargetYearOptions(), []);
  const passingYears = useMemo(() => profilePassingYearOptions(), []);
  const previousCatYears = useMemo(() => profilePreviousCatYearOptions(), []);

  const statusOptions = registration.masters.currentStatuses;
  const statusKind = classifyCurrentStatus(
    values.currentStatusId,
    statusOptions
  );
  const allowClass12Appearing = class12AppearingAllowed(statusKind);
  const class12Appearing = values.class12Status === "APPEARING";
  const class12StatusOptions = useMemo(
    () =>
      allowClass12Appearing
        ? PROFILE_CLASS12_STATUS_OPTIONS
        : PROFILE_CLASS12_STATUS_OPTIONS.filter((o) => o.value !== "APPEARING"),
    [allowClass12Appearing]
  );
  const showLinkedIn = needsHigherEducation(statusKind);
  const showGrad = needsHigherEducation(statusKind) && !class12Appearing;
  const showPgWork = needsGradOrWorking(statusKind) && !class12Appearing;
  const age = calculateAge(values.dateOfBirth);
  const under18 = age !== null && age < 18;

  const examOptions = useMemo(
    () =>
      filterExamsByVertical(
        registration.masters.targetExams,
        values.targetVerticalId
      ),
    [registration.masters.targetExams, values.targetVerticalId]
  );
  const collegeOptions = useMemo(
    () =>
      filterCollegesByVertical(
        registration.masters.targetColleges,
        values.targetVerticalId
      ),
    [registration.masters.targetColleges, values.targetVerticalId]
  );

  const class10 = getEducationLevel(registration.masters.education, "CLASS_10");
  const class12 = getEducationLevel(registration.masters.education, "CLASS_12");
  const graduation = getEducationLevel(
    registration.masters.education,
    "GRADUATION"
  );
  const class10Boards = nameOptionsFromMasters(class10?.boards ?? []);
  const class12Boards = nameOptionsFromMasters(class12?.boards ?? []);
  const class12Streams = nameOptionsFromMasters(class12?.streams ?? []);
  const graduationStreams = nameOptionsFromMasters(graduation?.streams ?? []);
  const graduationDegrees = useMemo(() => {
    const stream = graduation?.streams.find(
      (s) => s.label === values.graduationStream
    );
    return nameOptionsFromMasters(stream?.degrees ?? []);
  }, [graduation, values.graduationStream]);

  const includesCat = useMemo(() => {
    const labels = values.targetExamIds
      .map((id) => examOptions.find((e) => e.value === id)?.label || "")
      .join(" ")
      .toLowerCase();
    return /\bcat\b/.test(labels);
  }, [values.targetExamIds, examOptions]);

  const catAttemptsNum =
    values.previousCatAttempts === "3+"
      ? 3
      : Number(values.previousCatAttempts);
  const showCatDetails =
    includesCat && Number.isFinite(catAttemptsNum) && catAttemptsNum >= 1;

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setErrors({});
    setSubmitting(false);
    setPassportFile(null);
    setValues(createEmptyRegistrationForm(registration));
  }, [open, registration]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting && !required) onClose();
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, submitting, required]);

  // Auto-set work experience Yes for Working professional
  useEffect(() => {
    if (statusKind === "working" && values.hasWorkExperience !== "true") {
      setValues((prev) => ({ ...prev, hasWorkExperience: "true" }));
    }
  }, [statusKind, values.hasWorkExperience]);

  // UG / graduate: Class 12 Appearing is not allowed — default/force Passed.
  useEffect(() => {
    if (allowClass12Appearing) return;
    if (values.class12Status === "PASSED") return;
    setValues((prev) => ({ ...prev, class12Status: "PASSED" }));
  }, [allowClass12Appearing, values.class12Status]);

  // Scroll form body to top when changing steps.
  useEffect(() => {
    bodyScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function patch<K extends keyof RegistrationFormValues>(
    key: K,
    value: RegistrationFormValues[K]
  ) {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "whatsappSameAsMobile" && value === true) {
        next.whatsappNumber = "";
      }
      if (key === "targetVerticalId") {
        next.targetExamIds = [];
        next.targetCollegeIds = [];
      }
      if (key === "graduationStream") {
        next.graduationDegree = "";
        next.graduationDegreeOtherText = "";
      }
      if (key === "bookSelectAll" && value === true) {
        next.bookIds = registration.availableBooks.map((b) => b.value);
      }
      return next;
    });
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validationCtx() {
    return {
      statuses: statusOptions,
      examOptions: examOptions.map((e) => ({ id: e.id, label: e.label })),
      requiresBooks: registration.requiresBooks,
      hasPassportPhoto: Boolean(passportFile),
    };
  }

  function validateCurrentStep(): boolean {
    const next = validateRegistrationStep(step, values, validationCtx());
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateCurrentStep()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
  }

  function goBack() {
    setErrors({});
    setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));
  }

  async function submit() {
    if (!validateCurrentStep()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSubmitting(true);
    try {
      const formData = buildRegistrationFormData(values, passportFile, {
        statuses: statusOptions,
        examOptions: examOptions.map((e) => ({ id: e.id, label: e.label })),
        requiresBooks: registration.requiresBooks,
      });
      const res = await fetchAuthed("/api/account/registration", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Unable to submit registration.");
      }
      toast.success("Registration submitted successfully.");
      onSubmitted?.();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to submit registration.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const dobMax = new Date();
  dobMax.setFullYear(dobMax.getFullYear() - 12);
  const dobMin = new Date();
  dobMin.setFullYear(dobMin.getFullYear() - 60);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/50"
        disabled={submitting || required}
        onClick={() => {
          if (!required && !submitting) onClose();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[101] flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-[var(--account-border)] bg-[var(--account-surface)] shadow-xl sm:rounded-2xl"
      >
        <header className="shrink-0 border-b border-[var(--account-border)] px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2
                id={titleId}
                className="font-montserrat text-h4 font-bold text-[var(--account-text)]"
              >
                Student Registration
              </h2>
              <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
                Complete this form once to unlock course access.
              </p>
            </div>
            {!required ? (
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-lg px-2 py-1 text-body-sm text-[var(--account-text-muted)] hover:bg-[var(--account-nav-hover)]"
              >
                Close
              </button>
            ) : null}
          </div>
          {(() => {
            const deadlineLabel = formatDeadlineLabel(deadlineAt);
            const message =
              bannerMessage ||
              (overdue
                ? `Registration deadline has passed${
                    deadlineLabel ? ` (${deadlineLabel})` : ""
                  }. Complete registration to continue.`
                : deadlineLabel
                  ? `Please complete registration by ${deadlineLabel}.`
                  : null);
            if (!message) return null;
            return (
              <div
                role="alert"
                className={cn(
                  "mt-3 rounded-[var(--account-radius)] border px-3 py-2 text-body-sm",
                  overdue
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-[var(--account-accent)]/30 bg-[var(--account-accent-soft)] text-[var(--account-text)]"
                )}
              >
                {message}
              </div>
            );
          })()}
          <nav className="mt-4 flex gap-2" aria-label="Form steps">
            {STEPS.map((label, index) => {
              const n = (index + 1) as 1 | 2 | 3;
              const active = step === n;
              const done = step > n;
              return (
                <div
                  key={label}
                  className={cn(
                    "flex min-w-0 flex-1 flex-col gap-1",
                    active || done
                      ? "text-[var(--account-accent)]"
                      : "text-[var(--account-text-muted)]"
                  )}
                >
                  <span
                    className={cn(
                      "h-1 rounded-full",
                      active || done
                        ? "bg-[var(--account-accent)]"
                        : "bg-[var(--account-border)]"
                    )}
                  />
                  <span className="truncate text-caption font-medium">
                    {n}. {label}
                  </span>
                </div>
              );
            })}
          </nav>
        </header>

        <div
          ref={bodyScrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6"
        >
          <form
            id={formId}
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 3) goNext();
              else void submit();
            }}
          >
            {step === 1 ? (
              <>
                <section className="space-y-4">
                  <SectionHeading>A. Enrolment and account</SectionHeading>
                  <Grid>
                    <AccountTextField
                      id={`${formId}-fullName`}
                      label="Full Name"
                      value={values.fullName}
                      onChange={() => {}}
                      readOnly
                      required
                    />
                    <AccountTextField
                      id={`${formId}-email`}
                      label="Registered Email"
                      value={values.registeredEmail}
                      onChange={() => {}}
                      readOnly
                      required
                    />
                    <AccountTextField
                      id={`${formId}-mobile`}
                      label="Mobile"
                      value={values.mobile}
                      onChange={() => {}}
                      readOnly
                      required
                    />
                    <AccountTextField
                      id={`${formId}-courses`}
                      label="Course Enrolled"
                      value={values.courseEnrolled}
                      onChange={() => {}}
                      readOnly
                      required
                    />
                    <AccountTextField
                      id={`${formId}-batch`}
                      label="Batch Enrolled"
                      value={values.batchEnrolled}
                      onChange={() => {}}
                      readOnly
                      required
                    />
                  </Grid>
                </section>

                <section className="space-y-4">
                  <SectionHeading>B. Exam goal</SectionHeading>
                  <Grid>
                    <AccountSelect
                      id={`${formId}-vertical`}
                      label="Target Vertical"
                      required
                      value={values.targetVerticalId}
                      onChange={(v) => patch("targetVerticalId", v)}
                      options={registration.masters.targetVerticals}
                      error={errors.targetVerticalId}
                    />
                    <AccountMultiSelect
                      id={`${formId}-exams`}
                      label="Target Exams"
                      required
                      value={values.targetExamIds}
                      onChange={(v) => patch("targetExamIds", v)}
                      options={examOptions}
                      error={errors.targetExamIds}
                      selectAll
                    />
                    <AccountSelect
                      id={`${formId}-targetYear`}
                      label="Target Year"
                      required
                      value={values.targetYear}
                      onChange={(v) => patch("targetYear", v)}
                      options={targetYears}
                      error={errors.targetYear}
                    />
                    <AccountSelect
                      id={`${formId}-status`}
                      label="Current Status"
                      required
                      value={values.currentStatusId}
                      onChange={(v) => patch("currentStatusId", v)}
                      options={statusOptions}
                      error={errors.currentStatusId}
                    />
                    <AccountSelect
                      id={`${formId}-language`}
                      label="Primary Language for Instruction"
                      required
                      value={values.primaryLanguage}
                      onChange={(v) => patch("primaryLanguage", v)}
                      options={PROFILE_LANGUAGE_OPTIONS}
                      error={errors.primaryLanguage}
                    />
                  </Grid>
                </section>

                <section className="space-y-4">
                  <SectionHeading>C. Personal details</SectionHeading>
                  <Grid>
                    <AccountDateField
                      id={`${formId}-dob`}
                      label="Date of Birth"
                      required
                      value={values.dateOfBirth}
                      onChange={(v) => patch("dateOfBirth", v)}
                      error={errors.dateOfBirth}
                      min={dobMin.toISOString().slice(0, 10)}
                      max={dobMax.toISOString().slice(0, 10)}
                    />
                    <AccountSelect
                      id={`${formId}-gender`}
                      label="Gender"
                      required
                      value={values.gender}
                      onChange={(v) => patch("gender", v)}
                      options={PROFILE_GENDER_OPTIONS}
                      error={errors.gender}
                    />
                    <AccountSelect
                      id={`${formId}-category`}
                      label="Category"
                      required
                      value={values.studentCategoryId}
                      onChange={(v) => patch("studentCategoryId", v)}
                      options={registration.masters.categories}
                      error={errors.studentCategoryId}
                    />
                    <AccountRadioGroup
                      id={`${formId}-pwd`}
                      label="Person with Disability (PwD)"
                      required
                      value={values.isPwd}
                      onChange={(v) => patch("isPwd", v)}
                      options={PROFILE_YES_NO_OPTIONS}
                      error={errors.isPwd}
                    />
                    <div className="sm:col-span-2">
                      <AccountFileUpload
                        id={`${formId}-photo`}
                        label="Passport-size Photo"
                        required
                        file={passportFile}
                        onChange={(file) => {
                          setPassportFile(file);
                          setErrors((prev) => {
                            if (!prev.passportPhoto) return prev;
                            const next = { ...prev };
                            delete next.passportPhoto;
                            return next;
                          });
                        }}
                        error={errors.passportPhoto}
                      />
                    </div>
                    <AccountTextField
                      id={`${formId}-govt`}
                      label="Govt ID (last 4 digits)"
                      required
                      value={values.govtIdLast4}
                      onChange={(v) =>
                        patch("govtIdLast4", v.replace(/\D/g, "").slice(0, 4))
                      }
                      error={errors.govtIdLast4}
                      helperText="Last 4 digits of Aadhaar / PAN / Passport"
                      inputMode="numeric"
                      maxLength={4}
                    />
                  </Grid>
                </section>

                <section className="space-y-4">
                  <SectionHeading>D. Contact</SectionHeading>
                  <AccountCheckbox
                    id={`${formId}-wa-same`}
                    label="WhatsApp number same as mobile"
                    checked={values.whatsappSameAsMobile}
                    onChange={(v) => patch("whatsappSameAsMobile", v)}
                  />
                  <Grid>
                    {!values.whatsappSameAsMobile ? (
                      <AccountTextField
                        id={`${formId}-whatsapp`}
                        label="WhatsApp Number"
                        required
                        value={values.whatsappNumber}
                        onChange={(v) =>
                          patch("whatsappNumber", sanitizePhoneInput(v))
                        }
                        onKeyDown={(e) => {
                          if (isBlockedPhoneKey(e.key)) e.preventDefault();
                        }}
                        error={errors.whatsappNumber}
                        inputMode="numeric"
                        maxLength={10}
                        helperText="10 digits for India"
                      />
                    ) : null}
                    <AccountTextField
                      id={`${formId}-alt-phone`}
                      label="Alternate Phone"
                      value={values.alternatePhone}
                      onChange={(v) =>
                        patch("alternatePhone", sanitizePhoneInput(v))
                      }
                      onKeyDown={(e) => {
                        if (isBlockedPhoneKey(e.key)) e.preventDefault();
                      }}
                      error={errors.alternatePhone}
                      inputMode="numeric"
                      maxLength={10}
                    />
                    <AccountTextField
                      id={`${formId}-alt-email`}
                      label="Alternate Email"
                      type="email"
                      value={values.alternateEmail}
                      onChange={(v) => patch("alternateEmail", v)}
                      error={errors.alternateEmail}
                    />
                    {showLinkedIn ? (
                      <AccountTextField
                        id={`${formId}-linkedin`}
                        label="LinkedIn Profile URL"
                        type="url"
                        value={values.linkedinUrl}
                        onChange={(v) => patch("linkedinUrl", v)}
                        error={errors.linkedinUrl}
                        placeholder="https://www.linkedin.com/in/…"
                      />
                    ) : null}
                  </Grid>
                </section>

                <section className="space-y-4">
                  <SectionHeading>E. Address</SectionHeading>
                  <Grid>
                    <div className="sm:col-span-2">
                      <AccountTextField
                        id={`${formId}-addr1`}
                        label="Address Line 1"
                        required
                        value={values.addressLine1}
                        onChange={(v) => patch("addressLine1", v)}
                        error={errors.addressLine1}
                        maxLength={150}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <AccountTextField
                        id={`${formId}-addr2`}
                        label="Address Line 2"
                        value={values.addressLine2}
                        onChange={(v) => patch("addressLine2", v)}
                        error={errors.addressLine2}
                        maxLength={150}
                      />
                    </div>
                    <AccountTextField
                      id={`${formId}-city`}
                      label="City"
                      required
                      value={values.city}
                      onChange={(v) => patch("city", v)}
                      error={errors.city}
                      maxLength={60}
                    />
                    <AccountSelect
                      id={`${formId}-state`}
                      label="State/UT"
                      required
                      value={values.stateId}
                      onChange={(v) => patch("stateId", v)}
                      options={registration.masters.states}
                      error={errors.stateId}
                    />
                    <AccountTextField
                      id={`${formId}-pin`}
                      label="PIN Code"
                      required
                      value={values.pinCode}
                      onChange={(v) =>
                        patch("pinCode", v.replace(/\D/g, "").slice(0, 6))
                      }
                      error={errors.pinCode}
                      inputMode="numeric"
                      maxLength={6}
                    />
                  </Grid>
                </section>

                <section className="space-y-4">
                  <SectionHeading>F. Parent / guardian</SectionHeading>
                  <p className="text-caption text-[var(--account-text-muted)]">
                    Required if age is under 18.
                  </p>
                  <Grid>
                    <AccountTextField
                      id={`${formId}-parent-name`}
                      label="Parent/Guardian Name"
                      required={under18}
                      value={values.parentName}
                      onChange={(v) => patch("parentName", v)}
                      error={errors.parentName}
                      maxLength={100}
                    />
                    <AccountSelect
                      id={`${formId}-parent-rel`}
                      label="Relation"
                      required={under18}
                      value={values.parentRelation}
                      onChange={(v) => patch("parentRelation", v)}
                      options={PROFILE_PARENT_RELATION_OPTIONS}
                      error={errors.parentRelation}
                    />
                    <AccountTextField
                      id={`${formId}-parent-mobile`}
                      label="Parent/Guardian Mobile"
                      required={under18}
                      value={values.parentMobile}
                      onChange={(v) =>
                        patch("parentMobile", sanitizePhoneInput(v))
                      }
                      onKeyDown={(e) => {
                        if (isBlockedPhoneKey(e.key)) e.preventDefault();
                      }}
                      error={errors.parentMobile}
                      inputMode="numeric"
                      maxLength={10}
                    />
                  </Grid>
                </section>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <section className="space-y-4">
                  <SectionHeading>G. Academics: Class 10 and 12</SectionHeading>
                  <Grid>
                    <AccountSelect
                      id={`${formId}-c10-board`}
                      label="Class 10 Board"
                      required
                      value={values.class10BoardName}
                      onChange={(v) => patch("class10BoardName", v)}
                      options={class10Boards}
                      error={errors.class10BoardName}
                    />
                    {values.class10BoardName === "State Board" ? (
                      <AccountTextField
                        id={`${formId}-c10-board-other`}
                        label="State Board name"
                        required
                        value={values.class10BoardOtherText}
                        onChange={(v) => patch("class10BoardOtherText", v)}
                        error={errors.class10BoardOtherText}
                      />
                    ) : null}
                    <AccountRadioGroup
                      id={`${formId}-c10-scheme`}
                      label="Class 10 Scoring Scheme"
                      required
                      value={values.class10ScoringScheme}
                      onChange={(v) => patch("class10ScoringScheme", v)}
                      options={PROFILE_SCORING_SCHEME_OPTIONS}
                      error={errors.class10ScoringScheme}
                    />
                    <AccountTextField
                      id={`${formId}-c10-score`}
                      label="Class 10 Score"
                      required
                      value={values.class10Score}
                      onChange={(v) => patch("class10Score", v)}
                      error={errors.class10Score}
                      inputMode="decimal"
                    />
                    <AccountSelect
                      id={`${formId}-c10-year`}
                      label="Class 10 Year of Passing"
                      required
                      value={values.class10YearOfPassing}
                      onChange={(v) => patch("class10YearOfPassing", v)}
                      options={passingYears}
                      error={errors.class10YearOfPassing}
                    />
                  </Grid>
                  <Grid>
                    <AccountRadioGroup
                      id={`${formId}-c12-status`}
                      label="Class 12 Status"
                      required
                      value={values.class12Status}
                      onChange={(v) => patch("class12Status", v)}
                      options={class12StatusOptions}
                      error={errors.class12Status}
                    />
                    {values.class12Status === "PASSED" ? (
                      <>
                        <AccountSelect
                          id={`${formId}-c12-board`}
                          label="Class 12 Board"
                          required
                          value={values.class12BoardName}
                          onChange={(v) => patch("class12BoardName", v)}
                          options={class12Boards}
                          error={errors.class12BoardName}
                        />
                        {values.class12BoardName === "State Board" ? (
                          <AccountTextField
                            id={`${formId}-c12-board-other`}
                            label="State Board name"
                            required
                            value={values.class12BoardOtherText}
                            onChange={(v) =>
                              patch("class12BoardOtherText", v)
                            }
                            error={errors.class12BoardOtherText}
                          />
                        ) : null}
                        <AccountSelect
                          id={`${formId}-c12-stream`}
                          label="Class 12 Stream"
                          required
                          value={values.class12Stream}
                          onChange={(v) => patch("class12Stream", v)}
                          options={class12Streams}
                          error={errors.class12Stream}
                        />
                        <AccountRadioGroup
                          id={`${formId}-c12-scheme`}
                          label="Class 12 Scoring Scheme"
                          required
                          value={values.class12ScoringScheme}
                          onChange={(v) => patch("class12ScoringScheme", v)}
                          options={PROFILE_SCORING_SCHEME_OPTIONS}
                          error={errors.class12ScoringScheme}
                        />
                        <AccountTextField
                          id={`${formId}-c12-score`}
                          label="Class 12 Score"
                          required
                          value={values.class12Score}
                          onChange={(v) => patch("class12Score", v)}
                          error={errors.class12Score}
                          inputMode="decimal"
                        />
                        <AccountSelect
                          id={`${formId}-c12-year`}
                          label="Class 12 Year of Passing"
                          required
                          value={values.class12YearOfPassing}
                          onChange={(v) => patch("class12YearOfPassing", v)}
                          options={passingYears}
                          error={errors.class12YearOfPassing}
                        />
                      </>
                    ) : null}
                  </Grid>
                </section>

                {showGrad ? (
                  <section className="space-y-4">
                    <SectionHeading>H. Academics: Graduation</SectionHeading>
                    <Grid>
                      <AccountSelect
                        id={`${formId}-grad-stream`}
                        label="Graduation Stream"
                        required
                        value={values.graduationStream}
                        onChange={(v) => patch("graduationStream", v)}
                        options={graduationStreams}
                        error={errors.graduationStream}
                      />
                      <AccountSelect
                        id={`${formId}-grad-degree`}
                        label="Graduation Degree"
                        required
                        value={values.graduationDegree}
                        onChange={(v) => patch("graduationDegree", v)}
                        options={graduationDegrees}
                        error={errors.graduationDegree}
                      />
                      {values.graduationDegree === PROFILE_OTHER_VALUE ? (
                        <AccountTextField
                          id={`${formId}-grad-degree-other`}
                          label="Degree (other)"
                          required
                          value={values.graduationDegreeOtherText}
                          onChange={(v) =>
                            patch("graduationDegreeOtherText", v)
                          }
                          error={errors.graduationDegreeOtherText}
                        />
                      ) : null}
                      <AccountTextField
                        id={`${formId}-grad-spec`}
                        label="Specialisation"
                        value={values.graduationSpecialisation}
                        onChange={(v) =>
                          patch("graduationSpecialisation", v)
                        }
                        error={errors.graduationSpecialisation}
                        maxLength={80}
                      />
                      <div className="sm:col-span-2">
                        <AccountTextField
                          id={`${formId}-grad-college`}
                          label="College / University"
                          required
                          value={values.graduationCollege}
                          onChange={(v) => patch("graduationCollege", v)}
                          error={errors.graduationCollege}
                          maxLength={150}
                        />
                      </div>
                      <AccountRadioGroup
                        id={`${formId}-grad-status`}
                        label="Graduation Status"
                        required
                        value={values.graduationStatus}
                        onChange={(v) => patch("graduationStatus", v)}
                        options={PROFILE_GRADUATION_STATUS_OPTIONS}
                        error={errors.graduationStatus}
                      />
                      <AccountSelect
                        id={`${formId}-grad-year`}
                        label="Graduation Year (Actual/Expected)"
                        required
                        value={values.graduationYear}
                        onChange={(v) => patch("graduationYear", v)}
                        options={passingYears}
                        error={errors.graduationYear}
                      />
                      <AccountRadioGroup
                        id={`${formId}-grad-scheme`}
                        label="Graduation Scoring Scheme"
                        required
                        value={values.graduationScoringScheme}
                        onChange={(v) => patch("graduationScoringScheme", v)}
                        options={PROFILE_SCORING_SCHEME_OPTIONS}
                        error={errors.graduationScoringScheme}
                      />
                      <AccountTextField
                        id={`${formId}-grad-score`}
                        label="Graduation Score"
                        required
                        value={values.graduationScore}
                        onChange={(v) => patch("graduationScore", v)}
                        error={errors.graduationScore}
                        inputMode="decimal"
                        helperText="If Ongoing: score till the latest semester."
                      />
                    </Grid>
                  </section>
                ) : null}

                {showPgWork ? (
                  <>
                    <section className="space-y-4">
                      <SectionHeading>I. Post Graduation</SectionHeading>
                      <Grid>
                        <AccountRadioGroup
                          id={`${formId}-pg-status`}
                          label="Post Graduation?"
                          required
                          value={values.postGraduationStatus}
                          onChange={(v) => patch("postGraduationStatus", v)}
                          options={PROFILE_PG_STATUS_OPTIONS}
                          error={errors.postGraduationStatus}
                        />
                        {values.postGraduationStatus === "YES" ||
                        values.postGraduationStatus === "PURSUING" ? (
                          <>
                            <AccountTextField
                              id={`${formId}-pg-degree`}
                              label="PG Degree & Specialization"
                              required
                              value={values.pgDegreeSpecialization}
                              onChange={(v) =>
                                patch("pgDegreeSpecialization", v)
                              }
                              error={errors.pgDegreeSpecialization}
                              maxLength={100}
                            />
                            <AccountTextField
                              id={`${formId}-pg-college`}
                              label="PG College / University"
                              required
                              value={values.pgCollege}
                              onChange={(v) => patch("pgCollege", v)}
                              error={errors.pgCollege}
                              maxLength={150}
                            />
                          </>
                        ) : null}
                        {values.postGraduationStatus === "YES" ? (
                          <>
                            <AccountRadioGroup
                              id={`${formId}-pg-scheme`}
                              label="PG Scoring Scheme"
                              required
                              value={values.pgScoringScheme}
                              onChange={(v) => patch("pgScoringScheme", v)}
                              options={PROFILE_SCORING_SCHEME_OPTIONS}
                              error={errors.pgScoringScheme}
                            />
                            <AccountTextField
                              id={`${formId}-pg-score`}
                              label="PG Score"
                              required
                              value={values.pgScore}
                              onChange={(v) => patch("pgScore", v)}
                              error={errors.pgScore}
                              inputMode="decimal"
                            />
                          </>
                        ) : null}
                      </Grid>
                    </section>

                    <section className="space-y-4">
                      <SectionHeading>J. Work experience</SectionHeading>
                      <Grid>
                        <AccountRadioGroup
                          id={`${formId}-work`}
                          label="Full-time Work Experience?"
                          required
                          value={values.hasWorkExperience}
                          onChange={(v) => patch("hasWorkExperience", v)}
                          options={PROFILE_YES_NO_OPTIONS}
                          error={errors.hasWorkExperience}
                          disabled={statusKind === "working"}
                        />
                        {values.hasWorkExperience === "true" ? (
                          <>
                            <AccountTextField
                              id={`${formId}-work-months`}
                              label="Total Experience (months)"
                              required
                              value={values.workExperienceMonths}
                              onChange={(v) =>
                                patch(
                                  "workExperienceMonths",
                                  v.replace(/\D/g, "").slice(0, 3)
                                )
                              }
                              error={errors.workExperienceMonths}
                              inputMode="numeric"
                            />
                            <AccountTextField
                              id={`${formId}-work-org`}
                              label="Current / Last Organization"
                              required
                              value={values.workOrganization}
                              onChange={(v) =>
                                patch("workOrganization", v)
                              }
                              error={errors.workOrganization}
                              maxLength={100}
                            />
                            <AccountTextField
                              id={`${formId}-work-role`}
                              label="Designation / Role"
                              required
                              value={values.workDesignation}
                              onChange={(v) => patch("workDesignation", v)}
                              error={errors.workDesignation}
                              maxLength={80}
                            />
                            <AccountSelect
                              id={`${formId}-industry`}
                              label="Industry"
                              required
                              value={values.industryId}
                              onChange={(v) => patch("industryId", v)}
                              options={registration.masters.industries}
                              error={errors.industryId}
                            />
                          </>
                        ) : null}
                      </Grid>
                    </section>
                  </>
                ) : null}
              </>
            ) : null}

            {step === 3 ? (
              <>
                <section className="space-y-4">
                  <SectionHeading>K. Previous attempts and goals</SectionHeading>
                  {includesCat ? (
                    <Grid>
                      <AccountSelect
                        id={`${formId}-cat-attempts`}
                        label="Previous CAT Attempts"
                        required
                        value={values.previousCatAttempts}
                        onChange={(v) => patch("previousCatAttempts", v)}
                        options={PROFILE_CAT_ATTEMPTS_OPTIONS}
                        error={errors.previousCatAttempts}
                      />
                      {showCatDetails ? (
                        <>
                          <AccountSelect
                            id={`${formId}-cat-year`}
                            label="Previous CAT Year (latest)"
                            required
                            value={values.previousCatYear}
                            onChange={(v) => patch("previousCatYear", v)}
                            options={previousCatYears}
                            error={errors.previousCatYear}
                          />
                          <AccountTextField
                            id={`${formId}-cat-overall`}
                            label="Previous CAT Overall Percentile"
                            required
                            value={values.previousCatOverallPercentile}
                            onChange={(v) =>
                              patch("previousCatOverallPercentile", v)
                            }
                            error={errors.previousCatOverallPercentile}
                            inputMode="decimal"
                          />
                          <AccountTextField
                            id={`${formId}-cat-varc`}
                            label="VARC Percentile"
                            value={values.previousCatVarcPercentile}
                            onChange={(v) =>
                              patch("previousCatVarcPercentile", v)
                            }
                            error={errors.previousCatVarcPercentile}
                            inputMode="decimal"
                          />
                          <AccountTextField
                            id={`${formId}-cat-dilr`}
                            label="DILR Percentile"
                            value={values.previousCatDilrPercentile}
                            onChange={(v) =>
                              patch("previousCatDilrPercentile", v)
                            }
                            error={errors.previousCatDilrPercentile}
                            inputMode="decimal"
                          />
                          <AccountTextField
                            id={`${formId}-cat-qa`}
                            label="QA Percentile"
                            value={values.previousCatQaPercentile}
                            onChange={(v) =>
                              patch("previousCatQaPercentile", v)
                            }
                            error={errors.previousCatQaPercentile}
                            inputMode="decimal"
                          />
                        </>
                      ) : null}
                    </Grid>
                  ) : (
                    <p className="text-body-sm text-[var(--account-text-muted)]">
                      CAT attempt details appear when CAT is selected in Target
                      Exams.
                    </p>
                  )}
                  <AccountMultiSelect
                    id={`${formId}-colleges`}
                    label="Target Colleges"
                    value={values.targetCollegeIds}
                    onChange={(v) => patch("targetCollegeIds", v)}
                    options={collegeOptions}
                    selectAll
                  />
                </section>

                {registration.requiresBooks ? (
                  <section className="space-y-4">
                    <SectionHeading>L. Books</SectionHeading>
                    <AccountMultiSelect
                      id={`${formId}-books`}
                      label="Books to be Delivered"
                      required
                      value={values.bookIds}
                      onChange={(v) => {
                        patch("bookIds", v);
                        patch(
                          "bookSelectAll",
                          v.length === registration.availableBooks.length &&
                            registration.availableBooks.length > 0
                        );
                      }}
                      options={registration.availableBooks}
                      error={errors.bookIds}
                      selectAll
                      helperText="Delivered to the address in section E."
                    />
                  </section>
                ) : null}

                <section className="space-y-4">
                  <SectionHeading>M. Source</SectionHeading>
                  <Grid>
                    <AccountSelect
                      id={`${formId}-source`}
                      label="How did you hear about Rodha?"
                      required
                      value={values.source}
                      onChange={(v) => patch("source", v)}
                      options={PROFILE_SOURCE_OPTIONS}
                      error={errors.source}
                    />
                    {values.source === PROFILE_OTHER_VALUE ? (
                      <AccountTextField
                        id={`${formId}-source-other`}
                        label="Please specify"
                        required
                        value={values.sourceOtherText}
                        onChange={(v) => patch("sourceOtherText", v)}
                        error={errors.sourceOtherText}
                      />
                    ) : null}
                  </Grid>
                </section>

                <section className="space-y-4">
                  <SectionHeading>N. Declarations and consent</SectionHeading>
                  <div className="space-y-3">
                    <AccountCheckbox
                      id={`${formId}-decl`}
                      required
                      checked={values.declarationAccepted}
                      onChange={(v) => patch("declarationAccepted", v)}
                      label={PROFILE_CONSENT_STATEMENTS.declaration}
                      error={errors.declarationAccepted}
                    />
                    <AccountCheckbox
                      id={`${formId}-privacy`}
                      required
                      checked={values.privacyConsentAccepted}
                      onChange={(v) => patch("privacyConsentAccepted", v)}
                      label={
                        <>
                          {PROFILE_CONSENT_STATEMENTS.privacy}{" "}
                          <Link
                            href="/privacy"
                            className="text-[var(--account-accent)] underline"
                            target="_blank"
                          >
                            Privacy Policy
                          </Link>
                          .
                        </>
                      }
                      error={errors.privacyConsentAccepted}
                    />
                    <AccountCheckbox
                      id={`${formId}-wa-consent`}
                      checked={values.whatsappConsent}
                      onChange={(v) => patch("whatsappConsent", v)}
                      label={PROFILE_CONSENT_STATEMENTS.whatsapp}
                    />
                  </div>
                </section>
              </>
            ) : null}
          </form>
        </div>

        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--account-border)] px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1 || submitting}
            className={cn(
              "rounded-[var(--account-radius)] border border-[var(--account-input-border)] px-4 py-2.5 text-body-sm font-medium text-[var(--account-text)]",
              (step === 1 || submitting) && "invisible"
            )}
          >
            Back
          </button>
          <button
            type="submit"
            form={formId}
            disabled={submitting}
            className="rounded-[var(--account-radius)] bg-[var(--account-accent)] px-5 py-2.5 text-body-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {submitting
              ? "Submitting…"
              : step < 3
                ? "Continue"
                : "Submit registration"}
          </button>
        </footer>
      </div>
    </div>
  );
}
