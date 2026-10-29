/**
 * Browser-facing origin for redirects and cookie Secure.
 * Prefer proxy headers so HTTP IP deployments and HTTPS domains
 * stay on the host the user actually opened.
 */

export function requestProtocol(request: Request): string {
  const forwarded = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();
  if (forwarded === "https" || forwarded === "http") return forwarded;
  try {
    const protocol = new URL(request.url).protocol.replace(":", "");
    if (protocol === "https" || protocol === "http") return protocol;
  } catch {
    // Fall through to the production default below.
  }
  return process.env.NODE_ENV === "production" ? "https" : "http";
}

export function requestIsSecure(request?: Request): boolean {
  if (!request) return process.env.NODE_ENV === "production";
  return requestProtocol(request) === "https";
}

export function publicOrigin(request: Request): string {
  const host = (
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    ""
  )
    .split(",")[0]
    ?.trim();
  if (!host) return new URL(request.url).origin;
  return `${requestProtocol(request)}://${host}`;
}

export function publicUrl(request: Request, path: string): URL {
  return new URL(path, publicOrigin(request));
}
