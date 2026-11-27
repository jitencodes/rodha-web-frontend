/**
 * Helpers for CMS editor (rich text) HTML such as package descriptions.
 *
 * Content is authored in the admin panel, so this is defence-in-depth rather
 * than a full HTML sanitizer: it removes executable / embedding markup and
 * inline event handlers, and normalises links. Works on server and client.
 */

const HTML_TAG_RE = /<\/?[a-z][\s\S]*?>/i;

const BLOCKED_TAGS =
  "script|style|iframe|object|embed|form|input|button|textarea|select|meta|link|base|noscript|template";
/** Paired blocked elements, including their inner content. */
const BLOCKED_ELEMENTS_RE = new RegExp(
  `<(${BLOCKED_TAGS})\\b[^>]*>[\\s\\S]*?<\\/\\1\\s*>`,
  "gi"
);
/** Any remaining (unclosed / void / closing) blocked tag. */
const BLOCKED_TAG_RE = new RegExp(`<\\/?(?:${BLOCKED_TAGS})\\b[^>]*>`, "gi");
const EVENT_HANDLER_ATTR_RE = /\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const UNSAFE_URL_ATTR_RE =
  /\s+(href|src|xlink:href|formaction)\s*=\s*("\s*(?:javascript|vbscript|data):[^"]*"|'\s*(?:javascript|vbscript|data):[^']*'|(?:javascript|vbscript|data):[^\s>]+)/gi;
const INLINE_STYLE_ATTR_RE = /\s+style\s*=\s*("[^"]*"|'[^']*')/gi;

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  ndash: "–",
  mdash: "—",
  hellip: "…",
};

/** True when the string contains at least one HTML tag. */
export function isRichHtml(value: string | null | undefined): boolean {
  return Boolean(value && HTML_TAG_RE.test(value));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Plain text → paragraphs (blank line) and line breaks (single newline). */
function plainTextToHtml(value: string): string {
  return value
    .trim()
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block.trim()).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

/** Open off-site links in a new tab with a safe `rel`. */
function normaliseLinks(html: string): string {
  return html.replace(/<a\b([^>]*)>/gi, (match, attrs: string) => {
    const href = /href\s*=\s*["']([^"']*)["']/i.exec(attrs)?.[1]?.trim() ?? "";
    const isExternal = /^https?:\/\//i.test(href);
    if (!isExternal) return match;
    let next = attrs.replace(/\s+(target|rel)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
    next += ' target="_blank" rel="noopener noreferrer"';
    return `<a${next}>`;
  });
}

/**
 * Editor HTML (or legacy plain text) → safe HTML string for
 * `dangerouslySetInnerHTML`. Returns "" for empty / whitespace-only content.
 */
export function toSafeRichHtml(value: string | null | undefined): string {
  const raw = value?.trim();
  if (!raw) return "";
  if (!isRichHtml(raw)) return plainTextToHtml(raw);

  const cleaned = raw
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(BLOCKED_ELEMENTS_RE, "")
    .replace(BLOCKED_TAG_RE, "")
    .replace(EVENT_HANDLER_ATTR_RE, "")
    .replace(UNSAFE_URL_ATTR_RE, "")
    // Editor inline colours / fonts fight the site theme.
    .replace(INLINE_STYLE_ATTR_RE, "")
    // Editors leave empty trailing paragraphs (`<p><br></p>`).
    .replace(/(?:<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>\s*)+$/i, "");

  const html = normaliseLinks(cleaned);
  const hasContent = Boolean(htmlToPlainText(html)) || /<img\b/i.test(html);
  return hasContent ? html : "";
}

/** Editor HTML → single-line plain text (cards, hero snippets, SEO). */
export function htmlToPlainText(value: string | null | undefined): string {
  if (!value) return "";
  if (!isRichHtml(value) && !value.includes("&")) {
    return value.replace(/\s+/g, " ").trim();
  }
  return value
    .replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6]|ul|ol|blockquote)>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(parseInt(code, 16))
    )
    .replace(/&([a-z]+);/gi, (match, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? match)
    .replace(/\s+/g, " ")
    .trim();
}
