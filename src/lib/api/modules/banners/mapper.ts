import type {
  BannerCtaViewModel,
  BannerListItemViewModel,
  BannerStackViewModel,
  WebsiteBannerApi,
  WebsiteBannerViewModel,
} from "@/lib/api/modules/banners/types";

export function extractYoutubeId(
  url: string | null | undefined
): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();

  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }
    const v = parsed.searchParams.get("v");
    if (v) return v;
    const embedMatch = parsed.pathname.match(/\/embed\/([^/]+)/);
    if (embedMatch?.[1]) return embedMatch[1];
  } catch {
    // fall through — maybe a bare id
  }

  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

export function normalizeTitleHighlights(raw: unknown): string[] {
  if (raw == null) return [];
  if (typeof raw === "string") {
    const text = raw.trim();
    return text ? [text] : [];
  }
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (
        item &&
        typeof item === "object" &&
        "text" in item &&
        typeof (item as { text: unknown }).text === "string"
      ) {
        return (item as { text: string }).text.trim();
      }
      if (
        item &&
        typeof item === "object" &&
        "value" in item &&
        typeof (item as { value: unknown }).value === "string"
      ) {
        return (item as { value: string }).value.trim();
      }
      return "";
    })
    .filter(Boolean);
}

function asRecord(item: unknown): Record<string, unknown> | null {
  if (!item || typeof item !== "object") return null;
  return item as Record<string, unknown>;
}

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeStacks(raw: unknown): BannerStackViewModel[] {
  if (raw == null || !Array.isArray(raw)) return [];

  return raw
    .map((item, index): BannerStackViewModel | null => {
      const record = asRecord(item);
      if (!record) return null;

      const value =
        asTrimmedString(record.value) ||
        asTrimmedString(record.count) ||
        asTrimmedString(record.stat);
      const label =
        asTrimmedString(record.label) ||
        asTrimmedString(record.title) ||
        asTrimmedString(record.name);
      if (!value || !label) return null;

      const id =
        (typeof record.id === "string" && record.id) ||
        (typeof record.id === "number" && String(record.id)) ||
        `stack-${index}`;

      const icon = asTrimmedString(record.iconUrl);
      const prefix = asTrimmedString(record.overline);

      return {
        id,
        value,
        label,
        icon: icon || undefined,
        prefix: prefix || undefined,
      };
    })
    .filter((item): item is BannerStackViewModel => item !== null);
}

export function normalizeListItems(raw: unknown): BannerListItemViewModel[] {
  if (raw == null || !Array.isArray(raw)) return [];

  return raw
    .map((item, index): BannerListItemViewModel | null => {
      const record = asRecord(item);
      if (!record) return null;

      const value =
        asTrimmedString(record.title) || asTrimmedString(record.count);
      const label =
        asTrimmedString(record.description) || asTrimmedString(record.label);
      if (!value || !label) return null;

      return {
        id:
          (typeof record.id === "string" && record.id) ||
          (typeof record.id === "number" && String(record.id)) ||
          `list-${index}`,
        value,
        label,
        icon: asTrimmedString(record.iconUrl),
      };
    })
    .filter((item): item is BannerListItemViewModel => item !== null);
}

export function normalizeBannerCtas(raw: unknown): BannerCtaViewModel[] {
  if (raw == null || !Array.isArray(raw)) return [];

  return raw
    .map((item): BannerCtaViewModel | null => {
      const record = asRecord(item);
      if (!record) return null;
      const label = asTrimmedString(record.name);
      const href = asTrimmedString(record.redirectUrl);
      if (!label || !href) return null;
      return { label, href };
    })
    .filter((item): item is BannerCtaViewModel => item !== null);
}

/**
 * Map a CMS banner. Video wins when both `videoYoutubeLink` and `mediaUrl` exist.
 */
export function mapWebsiteBanner(
  banner: WebsiteBannerApi | null | undefined
): WebsiteBannerViewModel | null {
  if (!banner || banner.isActive === false) return null;
  const title = banner.title?.trim();
  if (!title) return null;

  const videoId = extractYoutubeId(banner.videoYoutubeLink);
  const imageUrl = banner.mediaUrl?.trim() || null;

  return {
    overline: banner.overline?.trim() || null,
    title,
    titleHighlights: normalizeTitleHighlights(banner.titleHighlights),
    description: banner.description?.trim() || null,
    videoId,
    imageUrl: videoId ? null : imageUrl,
    stacks: normalizeStacks(banner.stacks),
    listItems: normalizeListItems(banner.listItems),
    ctas: normalizeBannerCtas(banner.cats),
  };
}
