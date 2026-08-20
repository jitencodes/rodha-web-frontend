"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { Button } from "@/components/ui/Button";
import { CATEGORIES } from "@/lib/constants";
import type { LeadFormData } from "@/lib/types";
import { submitLead } from "@/lib/submit-lead";

interface LeadCaptureFormProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function LeadCaptureForm({
  title = "Get a Free Counselling Session",
  subtitle = "Our experts will help you choose the right course.",
  className,
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    phone: "",
    email: "",
    exam: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
    });

    setLoading(false);

    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error || "Unable to submit your details.");
      return;
    }

    setStatus("success");
    setFormData({ name: "", phone: "", email: "", exam: "" });
  };

  return (
    <div className={className}>
      {title && <h3 className="text-h4 font-bold text-text-primary">{title}</h3>}
      {subtitle && <p className="mt-1 text-body-sm text-text-muted">{subtitle}</p>}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <Input
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
        <Input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
          required
        />
        <Input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          required
        />
        <DropdownSelect
          aria-label="Select exam"
          placeholder="Select Exam"
          value={formData.exam}
          onChange={(exam) =>
            setFormData((prev) => ({ ...prev, exam: exam as LeadFormData["exam"] }))
          }
          options={CATEGORIES.map((c) => ({ value: c.id, label: c.menuLabel }))}
        />
        <Button type="submit" loading={loading} fullWidth>
          Book Free Session
        </Button>
        {status === "success" && (
          <p className="text-center text-caption text-green-400">
            Thanks! Our counselling team will reach out shortly.
          </p>
        )}
        {status === "error" && (
          <p className="text-center text-caption text-red-400">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
