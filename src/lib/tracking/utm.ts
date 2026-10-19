export const UTM_COOKIE_NAME = "rodha_utm";

const UTM_KEY = /^utm_[a-z0-9_]+$/i;
const UTM_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const UTM_VALUE_MAX = 200;

export function sanitizeUtmRecord(input: unknown): Record<string, string> {
  if (!input || typeof input !== "object") return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (!UTM_KEY.test(key) || typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed || trimmed.length > UTM_VALUE_MAX) continue;
    out[key] = trimmed;
  }
  return out;
}

export function readUtmFromSearch(search: string): Record<string, string> {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const raw: Record<string, string> = {};
  params.forEach((value, key) => {
    raw[key] = value;
  });
  return sanitizeUtmRecord(raw);
}

export function parseUtmCookie(raw: string | undefined | null): Record<string, string> {
  if (!raw) return {};
  const candidates = [raw];
  try {
    const decoded = decodeURIComponent(raw);
    if (decoded !== raw) candidates.push(decoded);
  } catch {
    // Cookie value was not URI-encoded.
  }
  for (const candidate of candidates) {
    try {
      const parsed = sanitizeUtmRecord(JSON.parse(candidate) as unknown);
      if (Object.keys(parsed).length > 0 || candidate.trim().startsWith("{")) {
        return parsed;
      }
    } catch {
      // Try the next encoding.
    }
  }
  return {};
}

/** Replace stored attribution when the current URL has any `utm_*` params. */
export function captureUtmFromSearch(search: string): void {
  if (typeof document === "undefined") return;
  const next = readUtmFromSearch(search);
  if (Object.keys(next).length === 0) return;
  const payload = encodeURIComponent(JSON.stringify(next));
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${UTM_COOKIE_NAME}=${payload}; Path=/; Max-Age=${UTM_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}
