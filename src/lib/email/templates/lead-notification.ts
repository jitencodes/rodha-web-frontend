import { EMAIL_LOGO_URL, EMAIL_SITE_ORIGIN } from "@/lib/email/config";

export type LeadFormType =
  | "contact"
  | "counselling"
  | "lead-capture"
  | "newsletter";

export interface LeadPayload {
  formType: LeadFormType;
  name?: string;
  email?: string;
  phone?: string;
  exam?: string;
  message?: string;
  /** Optional client page path for ops context (not used for assets) */
  sourcePath?: string;
}

const FORM_LABELS: Record<LeadFormType, string> = {
  contact: "Contact Us",
  counselling: "Free Counselling",
  "lead-capture": "Lead Capture",
  newsletter: "Newsletter Signup",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value?: string): string {
  if (!value?.trim()) return "";
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #F3E8DE;width:140px;vertical-align:top;font-size:13px;color:#78716C;font-weight:600;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #F3E8DE;font-size:14px;color:#1C1917;line-height:1.5;">
        ${escapeHtml(value.trim())}
      </td>
    </tr>`;
}

/** Light-theme Rodha notification email for support inbox */
export function buildLeadNotificationEmail(payload: LeadPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const formLabel = FORM_LABELS[payload.formType];
  const subjectName = payload.name?.trim() || payload.email?.trim() || "New lead";
  const subject = `[Rodha] ${formLabel} — ${subjectName}`;

  const submittedAt = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#F8F4F0;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F4F0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #F0E6DC;box-shadow:0 8px 24px rgba(28,25,23,0.06);">
          <tr>
            <td style="padding:28px 32px 20px;background:#FFFFFF;border-bottom:3px solid #F97316;">
              <a href="${EMAIL_SITE_ORIGIN}" style="text-decoration:none;">
                <img
                  src="${EMAIL_LOGO_URL}"
                  alt="Rodha"
                  width="140"
                  style="display:block;width:140px;height:auto;border:0;outline:none;"
                />
              </a>
              <p style="margin:16px 0 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#F97316;font-weight:700;">
                New website lead
              </p>
              <h1 style="margin:6px 0 0;font-size:22px;line-height:1.3;color:#1C1917;font-weight:700;">
                ${escapeHtml(formLabel)}
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row("Name", payload.name)}
                ${row("Email", payload.email)}
                ${row("Phone", payload.phone ? (payload.phone.startsWith("+") ? payload.phone : `+91 ${payload.phone}`) : undefined)}
                ${row("Category / Exam", payload.exam)}
                ${row("Message", payload.message)}
                ${row("Submitted", `${submittedAt} (IST)`)}
                ${row("Source path", payload.sourcePath)}
              </table>
              <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#A8A29E;">
                This message was sent from the Rodha website forms. Reply directly to the lead&rsquo;s email when available.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px;background:#FFF7ED;border-top:1px solid #FED7AA;">
              <p style="margin:0;font-size:12px;color:#9A3412;line-height:1.5;">
                © Rodha ·
                <a href="${EMAIL_SITE_ORIGIN}" style="color:#EA580C;text-decoration:none;">rodha.co.in</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textLines = [
    `Rodha — ${formLabel}`,
    "",
    payload.name ? `Name: ${payload.name}` : null,
    payload.email ? `Email: ${payload.email}` : null,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.exam ? `Category / Exam: ${payload.exam}` : null,
    payload.message ? `Message: ${payload.message}` : null,
    `Submitted: ${submittedAt} (IST)`,
    payload.sourcePath ? `Source path: ${payload.sourcePath}` : null,
  ].filter(Boolean);

  return { subject, html, text: textLines.join("\n") };
}
