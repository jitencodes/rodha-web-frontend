/** Append SSO token to a Graphy take / landing URL. */
export function withSsoToken(
  url: string,
  ssoToken: string | null | undefined
): string {
  const trimmed = url.trim();
  const token = ssoToken?.trim();
  if (!trimmed || !token) return trimmed;
  if (/[?&]ssoToken=/.test(trimmed)) return trimmed;
  const joiner = trimmed.includes("?") ? "&" : "?";
  return `${trimmed}${joiner}ssoToken=${encodeURIComponent(token)}`;
}
