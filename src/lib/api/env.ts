/**
 * API env helpers. Base URL must include a trailing slash
 * (Postman concatenates as `{{baseUrl}}api/website/...`).
 */

const DEFAULT_ANNOUNCEMENT_INTERVAL_MS = 8000;
const DEFAULT_REVALIDATE_SECONDS = 60;

export function getApiBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!raw) return null;
  return raw.endsWith("/") ? raw : `${raw}/`;
}

export function getApiSource(): string {
  return process.env.NEXT_PUBLIC_API_SOURCE?.trim() || "website";
}

/** Optional server-only key — only sent when set. */
export function getApiKey(): string | null {
  const key = process.env.API_KEY?.trim();
  return key || null;
}

export function getAnnouncementIntervalMs(): number {
  const raw = process.env.NEXT_PUBLIC_ANNOUNCEMENT_INTERVAL_MS?.trim();
  if (!raw) return DEFAULT_ANNOUNCEMENT_INTERVAL_MS;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_ANNOUNCEMENT_INTERVAL_MS;
}

export function getApiRevalidateSeconds(): number {
  const raw = process.env.API_REVALIDATE_SECONDS?.trim();
  if (!raw) return DEFAULT_REVALIDATE_SECONDS;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : DEFAULT_REVALIDATE_SECONDS;
}
