/**
 * Append SSO token to a Graphy take / landing URL.
 * Preserves `#fragment` after the query string so deep links like
 * `…/content#abc` become `…/content?ssoToken=…#abc` (not `…#abc?ssoToken=…`).
 */
export function withSsoToken(
  url: string,
  ssoToken: string | null | undefined
): string {
  const trimmed = url.trim();
  const token = ssoToken?.trim();
  if (!trimmed || !token) return trimmed;

  const hashIndex = trimmed.indexOf("#");
  const base = hashIndex >= 0 ? trimmed.slice(0, hashIndex) : trimmed;
  const hash = hashIndex >= 0 ? trimmed.slice(hashIndex) : "";

  if (/[?&]ssoToken=/.test(base)) {
    return `${base}${hash}`;
  }

  const joiner = base.includes("?") ? "&" : "?";
  return `${base}${joiner}ssoToken=${encodeURIComponent(token)}${hash}`;
}
