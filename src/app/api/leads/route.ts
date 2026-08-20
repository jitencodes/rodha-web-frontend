import { NextResponse } from "next/server";
import { parseLeadPayload } from "@/lib/email/parse-lead";
import { sendLeadNotificationEmail } from "@/lib/email/send";

export const runtime = "nodejs";

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

  try {
    await sendLeadNotificationEmail(parsed.data);
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
