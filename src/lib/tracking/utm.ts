export const UTM_COOKIE_NAME = "rodha_utm";

const UTM_KEY = /^utm_[a-z0-9_]+$/i;
export const UTM_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const UTM_VALUE_MAX = 200;
const UTM_KEYS_MAX = 20;

/**
 * Keeps only `utm_*` string values. Keys are lowercased so `UTM_Source` and
 * `utm_source` cannot both end up in one stored set.
 */
export function sanitizeUtmRecord(input: unknown): Record<string, string> {
  if (!input || typeof input !== "object") return {};
  const out: Record<string, string> = {};
  for (const [rawKey, value] of Object.entries(input)) {
    if (!UTM_KEY.test(rawKey) || typeof value !== "string") continue;
    const key = rawKey.toLowerCase();
    if (key in out) continue;
    if (Object.keys(out).length >= UTM_KEYS_MAX) break;
    const trimmed = value.trim();
    if (!trimmed) continue;
    out[key] = trimmed.slice(0, UTM_VALUE_MAX);
  }
  return out;
}

export function hasUtm(record: Record<string, string>): boolean {
  return Object.keys(record).length > 0;
}

/** Cookie value for `rodha_utm` (URI-encoded JSON, readable by `parseUtmCookie`). */
export function serializeUtmCookie(record: Record<string, string>): string {
  return encodeURIComponent(JSON.stringify(record));
}

export function readUtmFromSearch(search: string): Record<string, string> {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const raw: Record<string, string> = {};
  params.forEach((value, key) => {
    raw[key] = value;
  });
  return sanitizeUtmRecord(raw);
}

function readCookieValue(header: string, name: string): string | undefined {
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    if (part.slice(0, idx).trim() !== name) continue;
    return part.slice(idx + 1).trim();
  }
  return undefined;
}

/** UTM saved in `rodha_utm`, read in the browser at pay time. */
export function readStoredUtm(): Record<string, string> {
  if (typeof document === "undefined") return {};
  return parseUtmCookie(readCookieValue(document.cookie, UTM_COOKIE_NAME));
}

export function readUtmCookieHeader(
  cookieHeader: string | null | undefined
): Record<string, string> {
  if (!cookieHeader) return {};
  return parseUtmCookie(readCookieValue(cookieHeader, UTM_COOKIE_NAME));
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

/**
 * Replace stored attribution when the current URL has any `utm_*` params.
 * A new campaign always overwrites the whole set; keys from an older campaign
 * are never merged in. URLs without UTM leave the stored set untouched.
 */
export function captureUtmFromSearch(search: string): void {
  if (typeof document === "undefined") return;
  const next = readUtmFromSearch(search);
  if (!hasUtm(next)) return;
  const payload = serializeUtmCookie(next);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${UTM_COOKIE_NAME}=${payload}; Path=/; Max-Age=${UTM_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

/**
 * One attribution set for checkout. The client body wins when it has UTM
 * (it is read from the same cookie); otherwise the request cookie is used.
 * The sources are never merged, so an older campaign cannot leak keys into
 * a newer one.
 */
export function resolveCheckoutUtm(
  body: unknown,
  cookieValue: string | undefined | null
): Record<string, string> {
  const fromBody = sanitizeUtmRecord(body);
  if (hasUtm(fromBody)) return fromBody;
  return parseUtmCookie(cookieValue);
}
