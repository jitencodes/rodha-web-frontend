/**
 * Absolute URL for redirects using the browser Host, not the bind address.
 * Standalone/Docker sets HOSTNAME=0.0.0.0, so `request.url` can be
 * `http://0.0.0.0:3000/...` and send the user off the IP they opened.
 */
export function publicRequestUrl(request: Request, path: string): URL {
  const incoming = new URL(request.url);
  const forwardedHost = firstHeader(request.headers.get("x-forwarded-host"));
  const hostHeader = request.headers.get("host")?.trim();
  const host = forwardedHost || hostHeader || incoming.host;
  const hostname = host.replace(/:\d+$/, "");
  const forwardedProto = firstHeader(request.headers.get("x-forwarded-proto"));

  let protocol = incoming.protocol;
  if (
    forwardedHost &&
    (forwardedProto === "http" || forwardedProto === "https")
  ) {
    protocol = `${forwardedProto}:`;
  }
  if (protocol !== "http:" && protocol !== "https:") {
    protocol = "http:";
  }

  const target = path.startsWith("/") ? path : `/${path}`;
  const hostIsBind =
    hostname === "0.0.0.0" || hostname === "::" || hostname === "[::]";

  if (host && !hostIsBind) {
    return new URL(`${protocol}//${host}${target}`);
  }

  return new URL(target, incoming.origin);
}

function firstHeader(value: string | null): string {
  return value?.split(",")[0]?.trim() || "";
}
