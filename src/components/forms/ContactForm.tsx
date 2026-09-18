"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CATEGORIES } from "@/lib/constants";
import type { ContactFormData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/submit-lead";
import {
  isBlockedPhoneKey,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  PHONE_LENGTH,
  sanitizeNameInput,
  sanitizePhoneInput,
  validateEmail,
  validateExam,
  validateMessage,
  validateName,
  validatePhone,
} from "@/lib/form-validation";

interface ContactFormProps {
  className?: string;
  variant?: "dark" | "light";
}

interface ContactFieldErrors {
  name?: string;
  phone?: string;
  email?: string;
  exam?: string;
  message?: string;
}

export function ContactForm({ className, variant = "light" }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    exam: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [phoneFocused, setPhoneFocused] = useState(false);
  const isLight = variant === "light";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setErrorMessage("");

    const nextErrors: ContactFieldErrors = {
      name: validateName(formData.name),
      phone: validatePhone(formData.phone),
      email: validateEmail(formData.email),
      exam: validateExam(formData.exam),
      message: validateMessage(formData.message),
    };
    setFieldErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    setLoading(true);

    const result = await submitLead({
      formType: "contact",
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone,
      exam: formData.exam || undefined,
      message: formData.message.trim(),
    });

    setLoading(false);

    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error || "Unable to send your message.");
      return;
    }

    setStatus("success");
    setFormData({ name: "", email: "", phone: "", exam: "", message: "" });
    setFieldErrors({});
  };

  return (
    <form noValidate onSubmit={handleSubmit} className={className}>
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            variant={variant}
            label="Full Name"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                name: sanitizeNameInput(e.target.value),
              }));
              setFieldErrors((prev) => ({ ...prev, name: undefined }));
            }}
            prefixIcon={<Icon src="/assets/icons/user.svg" size={16} />}
            maxLength={NAME_MAX_LENGTH}
            autoComplete="name"
            aria-required
            error={fieldErrors.name}
          />
          <div className="w-full">
            <label
              htmlFor="contact-phone"
              className={cn(
                "block text-body-sm font-medium mb-1.5",
                isLight ? "text-neutral-700" : "text-text-secondary"
              )}
            >
              Phone Number
            </label>
            <div
              className={cn(
                "input-base relative flex items-center gap-2.5 px-3 transition-colors",
                isLight && "bg-white text-neutral-900 border-neutral-200",
                phoneFocused &&
                  "border-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,0.15)]",
                fieldErrors.phone && "border-accent-red"
              )}
            >
              <span className={cn(isLight ? "text-neutral-400" : "text-text-dimmed")}>
                <Icon src="/assets/icons/phone.svg" size={16} />
              </span>
              <span
                className={cn(
                  "text-body-sm shrink-0 select-none",
                  isLight ? "text-neutral-500" : "text-text-muted"
                )}
              >
                +91
              </span>
              <span
                className={cn("shrink-0", isLight ? "text-neutral-300" : "text-border-default")}
                aria-hidden
              >
                |
              </span>
              <input
                id="contact-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="Phone Number"
                value={formData.phone}
                maxLength={PHONE_LENGTH}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    phone: sanitizePhoneInput(e.target.value),
                  }));
                  setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                onKeyDown={(e) => {
                  if (isBlockedPhoneKey(e.key)) e.preventDefault();
                }}
                onFocus={() => setPhoneFocused(true)}
                onBlur={() => setPhoneFocused(false)}
                className={cn(
                  "flex-1 min-w-0 bg-transparent text-body outline-none border-0 p-0",
                  isLight
                    ? "text-neutral-900 placeholder:text-neutral-400"
                    : "text-text-primary placeholder:text-text-dimmed"
                )}
                aria-required
                aria-invalid={Boolean(fieldErrors.phone)}
              />
            </div>
            {fieldErrors.phone && (
              <p className="mt-1 text-caption text-accent-red">{fieldErrors.phone}</p>
            )}
          </div>
        </div>
        <Input
          variant={variant}
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, email: e.target.value }));
            setFieldErrors((prev) => ({ ...prev, email: undefined }));
          }}
          prefixIcon={<Icon src="/assets/icons/email.svg" size={16} />}
          autoComplete="email"
          aria-required
          error={fieldErrors.email}
        />
        <DropdownSelect
          variant={variant}
          label="Category of Interest"
          placeholder="Select a category"
          value={formData.exam}
          onChange={(exam) => {
            setFormData((prev) => ({ ...prev, exam: exam as ContactFormData["exam"] }));
            setFieldErrors((prev) => ({ ...prev, exam: undefined }));
          }}
          options={CATEGORIES.map((c) => ({ value: c.id, label: c.menuLabel }))}
          prefixIcon={<Icon src="/assets/icons/book.svg" size={16} />}
          error={fieldErrors.exam}
          className="w-full relative z-20"
          triggerClassName="h-[42px] w-full min-w-0 text-body"
        />
        <Textarea
          variant={variant}
          label="Message"
          placeholder="Tell us about your requirements..."
          value={formData.message}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, message: e.target.value }));
            setFieldErrors((prev) => ({ ...prev, message: undefined }));
          }}
          rows={2}
          maxLength={MESSAGE_MAX_LENGTH}
          className="min-h-[80px]"
          aria-required
          error={fieldErrors.message}
        />
        <Button type="submit" loading={loading} fullWidth>
          Send Message
        </Button>
        {status === "success" && (
          <p className="text-center text-caption text-green-600">
            Thanks! Your message has been sent. Our team will get back to you soon.
          </p>
        )}
        {status === "error" && (
          <p className="text-center text-caption text-red-500">{errorMessage}</p>
        )}
        <p
          className={cn(
            "flex items-center justify-center gap-2 text-caption",
            isLight ? "text-neutral-500" : "text-text-dimmed"
          )}
        >
          <Icon src="/assets/icons/check.svg" size={12} className="text-orange-500" />
          Your information is safe with us. We never share your details.
        </p>
      </div>
    </form>
  );
}
