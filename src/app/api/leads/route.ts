import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api/env";
import {
  resolveWebsiteCategoryId,
  submitContact,
} from "@/lib/api/modules/contact/service";
import { ApiError } from "@/lib/api/types";
import { parseLeadPayload } from "@/lib/email/parse-lead";
import { sendLeadNotificationEmail } from "@/lib/email/send";
import type { LeadPayload } from "@/lib/email/templates/lead-notification";

export const runtime = "nodejs";

function contactMessage(payload: LeadPayload): string | undefined {
  const parts: string[] = [];
  if (payload.message?.trim()) parts.push(payload.message.trim());
  if (payload.examYear?.trim()) {
    parts.push(`Exam year: ${payload.examYear.trim()}`);
  }
  return parts.length > 0 ? parts.join("\n") : undefined;
}

async function notifyOps(payload: LeadPayload) {
  try {
    await sendLeadNotificationEmail(payload);
  } catch (error) {
    console.error("[api/leads] SMTP send failed:", error);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseLeadPayload(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const payload = parsed.data;

  if (payload.formType === "newsletter" || !getApiBaseUrl()) {
    try {
      await sendLeadNotificationEmail(payload);
      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("[api/leads] SMTP send failed:", error);
      return NextResponse.json(
        {
          ok: false,
          error: "Unable to send your message right now. Please try again shortly.",
        },
        { status: 502 }
      );
    }
  }

  if (!payload.name || !payload.phone) {
    return NextResponse.json(
      { ok: false, error: "Name and phone are required." },
      { status: 400 }
    );
  }

  try {
    const websiteCategoryId = await resolveWebsiteCategoryId(payload.examId);
    await submitContact({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      websiteCategoryId,
      message: contactMessage(payload),
    });
  } catch (error) {
    console.error("[api/leads] CMS contact POST failed:", error);
    const message =
      error instanceof ApiError
        ? error.message
        : "Unable to send your message right now. Please try again shortly.";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }

  await notifyOps(payload);
  return NextResponse.json({ ok: true });
}
