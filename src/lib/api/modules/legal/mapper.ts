import type {
  LegalPageApi,
  LegalPageType,
  LegalPageViewModel,
  LegalTocItemViewModel,
} from "@/lib/api/modules/legal/types";

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text: string, index: number, used: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 72) || `section-${index + 1}`;

  let slug = base;
  let n = 2;
  while (used.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  used.add(slug);
  return slug;
}

function formatLastUpdated(raw?: string): string {
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const HEADING_TAG = /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi;

  function injectHeadingIds(html: string): {
    html: string;
    toc: LegalTocItemViewModel[];
  } {
    const used = new Set<string>();
    const toc: LegalTocItemViewModel[] = [];
  
    const next = html.replace(
      /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
      (full, level, attrs, inner) => {
        const title = stripTags(inner);
  
        if (!title) {
          return full;
        }
  
        const existingId = String(attrs).match(/\sid=(["'])(.*?)\1/i)?.[2];
  
        const id =
          existingId && !used.has(existingId)
            ? existingId
            : slugify(title, toc.length, used);
  
        used.add(id);
  
        toc.push({
          id,
          title,
          level: Number(level) as 2 | 3,
        });
  
        const cleanedAttrs = String(attrs).replace(
          /\s*id=(["']).*?\1/i,
          ""
        );
  
        return `<h${level}${cleanedAttrs} id="${id}">${inner}</h${level}>`;
      }
    );
  
    return {
      html: next,
      toc,
    };
  }

const PAGE_TITLES: Record<LegalPageType, string> = {
  PRIVACY_POLICY: "Privacy Policy",
  TERMS_OF_USE: "Terms & Conditions",
  REFUND_POLICY: "Refund Policy",
  DISCLAIMER: "Disclaimer",
};

export function mapLegalPage(
  items: LegalPageApi[] | LegalPageApi | null | undefined,
  pageType: LegalPageType
): LegalPageViewModel | null {
  if (!items) return null;

  const list = Array.isArray(items) ? items : [items];
  const match = list.find(
    (item) =>
      item.pageType === pageType &&
      item.isActive !== false &&
      Boolean(item.content?.trim())
  );

  if (!match?.content?.trim()) return null;

  const { html, toc } = injectHeadingIds(match.content);
  const plain = stripTags(match.content);

  return {
    pageType: match.pageType,
    title: match.pageTypeLabel?.trim() || PAGE_TITLES[pageType],
    description: plain.slice(0, 160).trim(),
    lastUpdated: formatLastUpdated(match.updatedAt),
    html,
    toc,
  };
}
