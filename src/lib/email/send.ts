import nodemailer from "nodemailer";
import {
  EMAIL_FROM,
  EMAIL_FROM_NAME,
  EMAIL_TO,
  getSmtpConfig,
} from "@/lib/email/config";
import {
  buildLeadNotificationEmail,
  type LeadPayload,
} from "@/lib/email/templates/lead-notification";

export async function sendLeadNotificationEmail(payload: LeadPayload) {
  const smtp = getSmtpConfig();
  const { subject, html, text } = buildLeadNotificationEmail(payload);

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"${EMAIL_FROM_NAME}" <${EMAIL_FROM}>`,
    to: EMAIL_TO,
    replyTo: payload.email?.trim() || undefined,
    subject,
    text,
    html,
  });

  return info;
}
