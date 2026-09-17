"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { Button } from "@/components/ui/Button";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/submit-lead";
import {
  isBlockedPhoneKey,
  NAME_MAX_LENGTH,
  PHONE_LENGTH,
  sanitizeNameInput,
  sanitizePhoneInput,
  validateExam,
  validateName,
  validatePhone,
} from "@/lib/form-validation";

interface HeroCounsellingFormProps {
  className?: string;
  defaultExam?: string;
  variant?: "inline" | "modal";
  showHeader?: boolean;
}

interface CounsellingFieldErrors {
  name?: string;
  phone?: string;
  exam?: string;
}

export function HeroCounsellingForm({
  className,
  defaultExam = "",
  variant = "inline",
  showHeader,
}: HeroCounsellingFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [exam, setExam] = useState(defaultExam);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<CounsellingFieldErrors>({});
  const [phoneFocused, setPhoneFocused] = useState(false);

  const isInline = variant === "inline";
  const shouldShowHeader = showHeader ?? isInline;

  useEffect(() => {
    setExam(defaultExam);
  }, [defaultExam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    const nextErrors: CounsellingFieldErrors = {
      name: validateName(name),
      phone: validatePhone(phone),
      exam: validateExam(exam),
    };
    setFieldErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setLoading(true);

    const result = await submitLead({
      formType: "counselling",
      name: name.trim(),
      phone,
      exam,
    });

    setLoading(false);

    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error || "Unable to book counselling.");
      return;
    }

    setStatus("success");
    setName("");
    setPhone("");
    setExam(defaultExam);
    setFieldErrors({});
  };

  const form = (
    <>
      {shouldShowHeader && (
        <>
          <h3 className="text-h4 font-bold text-text-primary">Book Your Free Counselling</h3>
          <p className="mt-1 text-body-sm text-text-muted">
            Our experts will help you choose the right course.
          </p>
        </>
      )}

      <form noValidate onSubmit={handleSubmit} className={cn(shouldShowHeader ? "mt-4" : "", "space-y-3")}>
        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => {
            setName(sanitizeNameInput(e.target.value));
            setFieldErrors((prev) => ({ ...prev, name: undefined }));
          }}
          maxLength={NAME_MAX_LENGTH}
          autoComplete="name"
          aria-required
          error={fieldErrors.name}
        />
        <div className="w-full">
          <div
            className={cn(
              "input-base flex items-center gap-2.5 px-3 transition-colors",
              phoneFocused && "border-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,0.15)]",
              fieldErrors.phone && "border-accent-red"
            )}
          >
            <span className="text-body-sm text-text-muted shrink-0 select-none">+91</span>
            <span className="text-border-default shrink-0" aria-hidden>
              |
            </span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="Phone Number"
              value={phone}
              maxLength={PHONE_LENGTH}
              onChange={(e) => {
                setPhone(sanitizePhoneInput(e.target.value));
                setFieldErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              onKeyDown={(e) => {
                if (isBlockedPhoneKey(e.key)) e.preventDefault();
              }}
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
              className="flex-1 min-w-0 bg-transparent text-body text-text-primary placeholder:text-text-dimmed outline-none border-0 p-0"
              aria-required
              aria-invalid={Boolean(fieldErrors.phone)}
            />
          </div>
          {fieldErrors.phone && (
            <p className="mt-1 text-caption text-accent-red">{fieldErrors.phone}</p>
          )}
        </div>
        <DropdownSelect
          aria-label="Select exam of interest"
          placeholder="Select Exam of Interest"
          value={exam}
          onChange={(value) => {
            setExam(value);
            setFieldErrors((prev) => ({ ...prev, exam: undefined }));
          }}
          options={CATEGORIES.map((c) => ({ value: c.id, label: c.menuLabel }))}
          error={fieldErrors.exam}
          className="w-full relative z-[100]"
          triggerClassName="h-[42px] w-full min-w-0 text-body-sm border-border-default bg-bg-surface hover:border-orange-500/60"
        />
        <Button type="submit" loading={loading} fullWidth size="lg">
          Book Free Counselling Now
        </Button>
        {status === "success" && (
          <p className="text-center text-caption text-green-400">
            Thanks! We received your request and will call you soon.
          </p>
        )}
        {status === "error" && (
          <p className="text-center text-caption text-red-400">{errorMessage}</p>
        )}
      </form>
    </>
  );

  if (!isInline) {
    return <div className={className}>{form}</div>;
  }

  return (
    <div
      className={cn(
        "glass-card-hero premium-border-glow rounded-[6px] p-4 sm:p-5 relative z-30 overflow-visible w-full",
        className
      )}
      {...(isInline ? { "data-counselling-cta": true } : {})}
    >
      {form}
    </div>
  );
}
