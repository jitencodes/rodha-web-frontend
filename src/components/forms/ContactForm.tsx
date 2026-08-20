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

interface ContactFormProps {
  className?: string;
  variant?: "dark" | "light";
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
  const [phoneFocused, setPhoneFocused] = useState(false);
  const isLight = variant === "light";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    const result = await submitLead({
      formType: "contact",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      exam: formData.exam || undefined,
      message: formData.message || undefined,
    });

    setLoading(false);

    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error || "Unable to send your message.");
      return;
    }

    setStatus("success");
    setFormData({ name: "", email: "", phone: "", exam: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            variant={variant}
            label="Full Name"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            prefixIcon={<Icon src="/assets/icons/user.svg" size={16} />}
            required
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
              phoneFocused && "border-orange-500 shadow-[0_0_0_2px_rgba(249,115,22,0.15)]"
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
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
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
        </div>
        </div>
        <Input
          variant={variant}
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          prefixIcon={<Icon src="/assets/icons/email.svg" size={16} />}
          required
        />
        <DropdownSelect
          variant={variant}
          label="Category of Interest"
          placeholder="Select a category"
          value={formData.exam}
          onChange={(exam) =>
            setFormData((prev) => ({ ...prev, exam: exam as ContactFormData["exam"] }))
          }
          options={CATEGORIES.map((c) => ({ value: c.id, label: c.menuLabel }))}
          prefixIcon={<Icon src="/assets/icons/book.svg" size={16} />}
          className="w-full relative z-20"
          triggerClassName="h-[42px] w-full min-w-0 text-body"
        />
        <Textarea
          variant={variant}
          label="Message"
          placeholder="Tell us about your requirements..."
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          rows={2}
          className="min-h-[80px]"
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
