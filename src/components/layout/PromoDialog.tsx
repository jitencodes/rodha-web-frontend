"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { WebsiteCategoryViewModel } from "@/lib/api/modules/categories/types";
import type { PromotionalPopupViewModel } from "@/lib/api/modules/promotional-popup/types";
import {
  isBlockedPhoneKey,
  NAME_MAX_LENGTH,
  PHONE_LENGTH,
  sanitizeNameInput,
  sanitizePhoneInput,
  validateEmail,
  validateExam,
  validateName,
  validatePhone,
} from "@/lib/form-validation";
import { PROMO_SHOWN_KEY, rememberNow, wasStoredWithinDay } from "@/lib/site-prompts";
import { submitLead } from "@/lib/submit-lead";
import { cn } from "@/lib/utils";

const EXAM_YEAR_START = 2007;
const EXAM_YEAR_END = 2026;

interface PromoDialogProps {
  popup: PromotionalPopupViewModel | null;
  delayMs: number;
  isLoggedIn: boolean;
  categories: WebsiteCategoryViewModel[];
}

export function PromoDialog({
  popup,
  delayMs,
  isLoggedIn,
  categories,
}: PromoDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!popup || wasStoredWithinDay(PROMO_SHOWN_KEY)) return;
    const timer = window.setTimeout(() => {
      rememberNow(PROMO_SHOWN_KEY);
      setOpen(true);
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [popup, delayMs]);

  if (!open || !popup) return null;

  function close() {
    rememberNow(PROMO_SHOWN_KEY);
    setOpen(false);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close promotion"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={popup.title}
        className={cn(
          "relative max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white text-neutral-900 shadow-2xl",
          isLoggedIn ? "max-w-3xl" : "max-w-5xl"
        )}
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-black/60 text-white"
          aria-label="Close promotion"
        >
          <X className="size-4" />
        </button>
        <div
          className={cn(
            "grid",
            !isLoggedIn && "lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]"
          )}
        >
          <PromoMedia popup={popup} />
          {!isLoggedIn ? (
            <PromoLeadForm categories={categories} onSuccess={close} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PromoMedia({ popup }: { popup: PromotionalPopupViewModel }) {
  if (popup.youtubeId) {
    return (
      <div className="aspect-video bg-black">
        <iframe
          title={popup.title}
          src={`https://www.youtube.com/embed/${popup.youtubeId}`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (!popup.imageUrl) return null;

  return (
    <div className="relative min-h-[220px] bg-neutral-100">
      {/* Promo images are CMS-hosted and may use hosts outside the image optimizer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={popup.imageUrl}
        alt={popup.title}
        className="h-full max-h-[70vh] w-full object-cover"
      />
    </div>
  );
}

function PromoLeadForm({
  categories,
  onSuccess,
}: {
  categories: WebsiteCategoryViewModel[];
  onSuccess: () => void;
}) {
  const yearOptions = useMemo(
    () =>
      Array.from({ length: EXAM_YEAR_END - EXAM_YEAR_START + 1 }, (_, index) => {
        const year = String(EXAM_YEAR_END - index);
        return { value: year, label: year };
      }),
    []
  );
  const examOptions = categories.map((category) => ({
    value: category.id,
    label: category.menuLabel || category.name,
  }));
  const [exam, setExam] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [examYear, setExamYear] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const yearError =
      !examYear || Number(examYear) < EXAM_YEAR_START || Number(examYear) > EXAM_YEAR_END
        ? "Please select an exam year."
        : undefined;
    const nextErrors = {
      exam: validateExam(exam),
      name: validateName(name),
      phone: validatePhone(phone),
      email: validateEmail(email),
      examYear: yearError,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setLoading(true);
    setErrorMessage("");
    const result = await submitLead({
      formType: "lead-capture",
      name: name.trim(),
      phone,
      email: email.trim(),
      exam,
      examYear,
    });
    setLoading(false);
    if (!result.ok) {
      setErrorMessage(result.error || "Unable to submit your details.");
      return;
    }
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3 p-5 sm:p-6">
      <h2 className="text-h4 font-semibold">Start your preparation</h2>
      <p className="text-body-sm text-neutral-600">
        Tell us your exam and we will help you pick the right course.
      </p>
      <DropdownSelect
        aria-label="Exam"
        placeholder="Exam"
        value={exam}
        onChange={setExam}
        options={examOptions}
        variant="light"
        error={errors.exam}
        triggerWidth="full"
      />
      <Input
        variant="light"
        placeholder="Name"
        value={name}
        maxLength={NAME_MAX_LENGTH}
        onChange={(event) => setName(sanitizeNameInput(event.target.value))}
        error={errors.name}
        autoComplete="name"
      />
      <Input
        variant="light"
        placeholder="Mobile"
        value={phone}
        inputMode="numeric"
        maxLength={PHONE_LENGTH}
        onKeyDown={(event) => {
          if (isBlockedPhoneKey(event.key)) event.preventDefault();
        }}
        onChange={(event) => setPhone(sanitizePhoneInput(event.target.value))}
        error={errors.phone}
        autoComplete="tel"
      />
      <Input
        variant="light"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={errors.email}
        autoComplete="email"
      />
      <DropdownSelect
        aria-label="Exam year"
        placeholder="Exam year"
        value={examYear}
        onChange={setExamYear}
        options={yearOptions}
        variant="light"
        error={errors.examYear}
        triggerWidth="full"
      />
      {errorMessage ? (
        <p className="text-body-sm text-red-600">{errorMessage}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
