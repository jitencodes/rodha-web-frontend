/**
 * Writes `.env` from GitLab CI/CD variables for the current job environment.
 * Only keys listed here are written — never dumps the full process.env.
 *
 * Dev and production must use the same variable *names* in GitLab, scoped to
 * environments `development` and `production` respectively so values never collide.
 */
import { writeFileSync } from "node:fs";

if (!process.env.CI && !process.env.GITLAB_CI) {
  console.error(
    "[ci-write-env] Refusing to write .env outside GitLab CI (set CI=true to override)."
  );
  process.exit(1);
}

const KEYS = [
  "NEXT_PUBLIC_BASE_URL",
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_API_SOURCE",
  "NEXT_PUBLIC_ANNOUNCEMENT_INTERVAL_MS",
  "NEXT_PUBLIC_SUPPORT_EMAIL",
  "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
  "NEXT_PUBLIC_DEFAULT_HOME_PATH",
  "NEXT_PUBLIC_THINK_EXAM_URL",
  "NEXT_PUBLIC_GRAPHY_DASHBOARD_URL",
  "NEXT_PUBLIC_CAT_COMMUNITY_URL",
  "NEXT_PUBLIC_BROCHURE_URL",
  "NEXT_PUBLIC_META_PIXEL_ID",
  "NEXT_PUBLIC_EMAIL_LOGO_URL",
  "API_KEY",
  "API_REVALIDATE_SECONDS",
  "EMAIL_SMTP_HOST",
  "EMAIL_SMTP_PORT",
  "EMAIL_SMTP_SECURE",
  "EMAIL_SMTP_USER",
  "EMAIL_SMTP_PASS",
  "EMAIL_FROM",
  "EMAIL_FROM_NAME",
  "EMAIL_TO",
];

const lines = [];
let written = 0;

for (const key of KEYS) {
  const value = process.env[key];
  if (value === undefined || value === "") continue;
  // Escape newlines in values; keep other characters as-is for URLs/JSON-ish strings
  const escaped = String(value).replace(/\r?\n/g, "\\n");
  lines.push(`${key}=${escaped}`);
  written += 1;
}

if (written === 0) {
  console.warn(
    "[ci-write-env] No known env keys found. Configure GitLab CI/CD variables for this environment."
  );
}

writeFileSync(".env", lines.length ? `${lines.join("\n")}\n` : "", "utf8");
console.log(`[ci-write-env] Wrote ${written} keys to .env (values redacted)`);
