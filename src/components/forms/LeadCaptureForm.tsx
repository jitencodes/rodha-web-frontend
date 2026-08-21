"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { Button } from "@/components/ui/Button";
import { CATEGORIES } from "@/lib/constants";
import type { CategoryId, LeadFormData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/submit-lead";

interface LeadCaptureFormProps {
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: "dark" | "light";
  defaultExam?: CategoryId | "";
  ctaLabel?: string;
  showExamYear?: boolean;
  /** Hide the default heading (e.g. when Modal already shows a title) */
  hideTitle?: boolean;
}

function examYearOptions() {
  const year = new Date().getFullYear();
  return [year, year + 1, year + 2].map((value) => ({
    value: String(value),
    label: String(value),
  }));
}

export function LeadCaptureForm({
  title = "Get a Free Counselling Session",
  subtitle = "Our experts will help you choose the right course.",
  className,
  variant = "dark",
  defaultExam = "",
  ctaLabel = "Book Free Session",
  showExamYear = false,
  hideTitle = false,
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    phone: "",
    email: "",
    exam: defaultExam,
  });
  const [examYear, setExamYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneFocused, setPhoneFocused] = useState(false);
  const isLight = variant === "light";
  const yearOptions = useMemo(() => examYearOptions(), []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, exam: defaultExam }));
  }, [defaultExam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    const result = await submitLead({
      formType: "lead-capture",
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      exam: formData.exam || undefined,
      examYear: showExamYear ? examYear || undefined : undefined,
    });

    setLoading(false);

    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error || "Unable to submit your details.");
      return;
    }

    setStatus("success");
    setFormData({ name: "", phone: "", email: "", exam: defaultExam });
    setExamYear("");
  };

  const titleClass = isLight ? "text-neutral-900" : "text-text-primary";
  const subtitleClass = isLight ? "text-neutral-600" : "text-text-muted";
  const successClass = isLight ? "text-green-600" : "text-green-400";
  const errorClass = isLight ? "text-red-600" : "text-red-400";

  return (
    <div className={className}>
      {!hideTitle && title && (
        <h3 className={cn("text-h4 font-bold", titleClass)}>{title}</h3>
      )}
      {subtitle && (
        <p
          className={cn(
            "text-body-sm",
            subtitleClass,
            !hideTitle && title ? "mt-1" : "mb-1"
          )}
        >
          {subtitle}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className={cn(
          "space-y-3",
          (!hideTitle && title) || subtitle ? "mt-4" : ""
        )}
      >
        <DropdownSelect
          aria-label="Select exam"
          placeholder="Select Exam"
          value={formData.exam}
          onChange={(exam) =>
            setFormData((prev) => ({
              ...prev,
              exam: exam as LeadFormData["exam"],
            }))
          }
          options={CATEGORIES.map((c) => ({
            value: c.id,
            label: c.menuLabel,
          }))}
          variant={isLight ? "light" : "dark"}
          className="w-full relative z-40"
          triggerClassName={cn(
            "h-[42px] w-full min-w-0 text-body-sm",
            isLight &&
              "border-section-beige bg-white text-neutral-800 hover:border-orange-500/60"
          )}
        />
        <Input
          variant={isLight ? "light" : "dark"}
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
        <div
          className={cn(
            "input-base flex items-center gap-2.5 px-3 transition-colors",
            isLight &&
              "border-section-beige bg-white text-neutral-800 placeholder:text-neutral-400",
            phoneFocused &&
              "border-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,0.15)]"
          )}
        >
          <span
            className={cn(
              "text-body-sm shrink-0 select-none",
              isLight ? "text-neutral-500" : "text-text-muted"
            )}
          >
            +91
          </span>
          <span
            className={cn(
              "shrink-0",
              isLight ? "text-neutral-300" : "text-border-default"
            )}
            aria-hidden
          >
            |
          </span>
          <input
            type="tel"
            placeholder="Mobile Number"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
            className={cn(
              "flex-1 min-w-0 bg-transparent text-body outline-none border-0 p-0",
              isLight
                ? "text-neutral-900 placeholder:text-neutral-400"
                : "text-text-primary placeholder:text-text-dimmed"
            )}
            required
          />
        </div>
        <Input
          variant={isLight ? "light" : "dark"}
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />
        {showExamYear && (
          <DropdownSelect
            aria-label="Select exam year"
            placeholder="Exam Year"
            value={examYear}
            onChange={setExamYear}
            options={yearOptions}
            variant={isLight ? "light" : "dark"}
            className="w-full relative z-30"
            triggerClassName={cn(
              "h-[42px] w-full min-w-0 text-body-sm",
              isLight &&
                "border-section-beige bg-white text-neutral-800 hover:border-orange-500/60"
            )}
          />
        )}
        <Button
          type="submit"
          loading={loading}
          fullWidth
          size="lg"
          disabled={!formData.exam || (showExamYear && !examYear)}
        >
          {ctaLabel}
        </Button>
        {status === "success" && (
          <p className={cn("text-center text-caption", successClass)}>
            Thanks! Our counselling team will reach out shortly.
          </p>
        )}
        {status === "error" && (
          <p className={cn("text-center text-caption", errorClass)}>
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}
