/**
 * Server-only email / SMTP configuration.
 * Prefer non-NEXT_PUBLIC secrets. Falls back to NEXT_PUBLIC_* for local setup compatibility.
 */

function env(name: string, fallback = ""): string {
  return (process.env[name] ?? fallback).trim();
}

function envBool(name: string, fallback: boolean): boolean {
  const raw = env(name);
  if (!raw) return fallback;
  return raw === "1" || raw.toLowerCase() === "true";
}

/** Canonical production site origin — never use the request Host header for email assets. */
export const EMAIL_SITE_ORIGIN =
  env("NEXT_PUBLIC_BASE_URL") ||
  env("EMAIL_SITE_URL") ||
  "https://rodha.co.in";

/**
 * Absolute logo URL for HTML email clients.
 * Hard-rooted to the Rodha website so localhost / preview hosts cannot break the image.
 */
export const EMAIL_LOGO_URL = `${EMAIL_SITE_ORIGIN.replace(/\/$/, "")}/assets/images/rodha-logo-orange.svg`;

export const EMAIL_TO =
  env("EMAIL_TO") || "support@rodha.co.in";

export const EMAIL_FROM =
  env("EMAIL_FROM") ||
  env("NEXT_PUBLIC_EMAIL_FROM") ||
  "noreply@rodha.co.in";

export const EMAIL_FROM_NAME =
  env("EMAIL_FROM_NAME") ||
  env("NEXT_PUBLIC_EMAIL_FROM_NAME") ||
  "Rodha";

export function getSmtpConfig() {
  const host =
    env("EMAIL_SMTP_HOST") || env("NEXT_PUBLIC_EMAIL_SMTP_HOST");
  const port = Number(
    env("EMAIL_SMTP_PORT") || env("NEXT_PUBLIC_EMAIL_SMTP_PORT") || "465"
  );
  const secure = envBool(
    "EMAIL_SMTP_SECURE",
    envBool("NEXT_PUBLIC_EMAIL_SMTP_SECURE", port === 465)
  );
  const user =
    env("EMAIL_SMTP_USER") || env("NEXT_PUBLIC_EMAIL_SMTP_USER");
  const pass =
    env("EMAIL_SMTP_PASS") || env("NEXT_PUBLIC_EMAIL_SMTP_PASS");

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP is not configured. Set EMAIL_SMTP_HOST, EMAIL_SMTP_USER, and EMAIL_SMTP_PASS."
    );
  }

  return { host, port, secure, user, pass };
}
