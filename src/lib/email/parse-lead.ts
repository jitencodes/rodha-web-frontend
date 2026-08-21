import type { LeadFormType, LeadPayload } from "@/lib/email/templates/lead-notification";
import { CATEGORIES } from "@/lib/constants";

const FORM_TYPES: LeadFormType[] = [
  "contact",
  "counselling",
  "lead-capture",
  "newsletter",
];

function isFormType(value: unknown): value is LeadFormType {
  return typeof value === "string" && FORM_TYPES.includes(value as LeadFormType);
}

function asTrimmedString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function examLabel(examId?: string): string | undefined {
  if (!examId) return undefined;
  const match = CATEGORIES.find((c) => c.id === examId);
  return match?.menuLabel ?? examId;
}

export function parseLeadPayload(body: unknown): {
  ok: true;
  data: LeadPayload;
} | {
  ok: false;
  error: string;
} {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const raw = body as Record<string, unknown>;
  if (!isFormType(raw.formType)) {
    return { ok: false, error: "Unknown or missing form type." };
  }

  const name = asTrimmedString(raw.name);
  const email = asTrimmedString(raw.email);
  const phone = asTrimmedString(raw.phone);
  const exam = asTrimmedString(raw.exam);
  const examYear = asTrimmedString(raw.examYear);
  const message = asTrimmedString(raw.message);
  const sourcePath = asTrimmedString(raw.sourcePath);

  if (raw.formType === "newsletter") {
    if (!email) return { ok: false, error: "Email is required." };
  } else if (raw.formType === "counselling") {
    if (!name) return { ok: false, error: "Name is required." };
    if (!phone) return { ok: false, error: "Phone is required." };
    if (!exam) return { ok: false, error: "Exam selection is required." };
  } else {
    if (!name) return { ok: false, error: "Name is required." };
    if (!phone) return { ok: false, error: "Phone is required." };
    if (!email) return { ok: false, error: "Email is required." };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  return {
    ok: true,
    data: {
      formType: raw.formType,
      name,
      email,
      phone,
      exam: examLabel(exam),
      examYear,
      message,
      sourcePath,
    },
  };
}
