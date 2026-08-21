import type { LeadFormType } from "@/lib/email/templates/lead-notification";

export interface SubmitLeadInput {
  formType: LeadFormType;
  name?: string;
  email?: string;
  phone?: string;
  exam?: string;
  examYear?: string;
  message?: string;
}

export interface SubmitLeadResult {
  ok: boolean;
  error?: string;
}

/** Client helper — posts lead data to the SMTP-backed API route. */
export async function submitLead(
  input: SubmitLeadInput
): Promise<SubmitLeadResult> {
  const sourcePath =
    typeof window !== "undefined" ? window.location.pathname : undefined;

  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, sourcePath }),
    });

    const data = (await response.json().catch(() => null)) as {
      ok?: boolean;
      error?: string;
    } | null;

    if (!response.ok || !data?.ok) {
      return {
        ok: false,
        error: data?.error || "Something went wrong. Please try again.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Network error. Please check your connection and try again.",
    };
  }
}
