/**
 * Picks one committed env file and leaves only `.env` on disk for the build.
 *
 * Next.js `next build` sets NODE_ENV=production and then loads `.env.production`
 * on top of `.env`. If both files stay in the tree, every build — including
 * development — bakes the production API URL. This script copies the file for
 * APP_ENV and deletes `.env.production` before `next build` / `docker build`.
 *
 * APP_ENV=production | development
 * When unset: GitLab branch `production` → production, otherwise development.
 *
 * Committed files are the source of truth for NEXT_PUBLIC_* (including
 * NEXT_PUBLIC_API_BASE_URL). CI may only append server secrets that are absent
 * from the file: EMAIL_SMTP_PASS, API_KEY.
 */
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const EXPECTED_API_BASE = {
  development: "https://innowrap.co.in/rodha/",
  production: "https://api.rodha.co.in/rodha/",
};

const SECRET_OVERLAY_KEYS = ["EMAIL_SMTP_PASS", "API_KEY"];

function resolveAppEnv() {
  const explicit = process.env.APP_ENV?.trim();
  if (explicit === "production" || explicit === "development") return explicit;
  if (
    process.env.CI_COMMIT_BRANCH === "production" ||
    process.env.CI_ENVIRONMENT_NAME === "production" ||
    process.env.VERCEL_ENV === "production"
  ) {
    return "production";
  }
  return "development";
}

function readApiBase(contents) {
  const match = contents.match(/^NEXT_PUBLIC_API_BASE_URL=(.*)$/m);
  return match?.[1]?.trim() ?? "";
}

const appEnv = resolveAppEnv();
const expected = EXPECTED_API_BASE[appEnv];

if (appEnv === "production") {
  if (!existsSync(".env.production") && !existsSync(".env")) {
    console.error("[select-env] Missing .env.production");
    process.exit(1);
  }
  if (existsSync(".env.production")) {
    writeFileSync(".env", readFileSync(".env.production"));
  }
} else if (!existsSync(".env")) {
  console.error("[select-env] Missing .env (development defaults)");
  process.exit(1);
}

let contents = readFileSync(".env", "utf8");
if (!contents.endsWith("\n")) contents += "\n";

const apiBase = readApiBase(contents);
if (apiBase !== expected) {
  console.error(
    `[select-env] ${appEnv} .env has NEXT_PUBLIC_API_BASE_URL=${apiBase || "(empty)"}; expected ${expected}`
  );
  process.exit(1);
}

const overlay = [];
for (const key of SECRET_OVERLAY_KEYS) {
  const value = process.env[key];
  if (!value || new RegExp(`^${key}=`, "m").test(contents)) continue;
  overlay.push(`${key}=${String(value).replace(/\r?\n/g, "\\n")}`);
}
if (overlay.length) {
  contents += `${overlay.join("\n")}\n`;
}

writeFileSync(".env", contents);

const isolate =
  process.env.CI === "true" ||
  process.env.GITLAB_CI === "true" ||
  process.env.VERCEL === "1" ||
  process.env.SELECT_ENV_ISOLATE === "1";

if (isolate) {
  rmSync(".env.production", { force: true });
  rmSync(".env.local", { force: true });
  rmSync(".env.development.local", { force: true });
  rmSync(".env.production.local", { force: true });
}

console.log(
  `[select-env] ${appEnv} → .env (API ${expected})${
    isolate ? ". Removed .env.production so Next cannot override it." : "."
  }`
);
