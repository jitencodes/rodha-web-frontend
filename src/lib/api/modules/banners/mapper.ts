import type {
  BannerCtaViewModel,
  BannerListItemViewModel,
  BannerStackViewModel,
  WebsiteBannerApi,
  WebsiteBannerViewModel,
} from "@/lib/api/modules/banners/types";

const YOUTUBE_ID = /^[\w-]{11}$/;
const VIDEO_FILE = /\.(mp4|webm|ogg|ogv|mov|m4v)(\?|#|$)/i;
const IMAGE_FILE = /\.(png|jpe?g|webp|gif|svg|avif)(\?|#|$)/i;

export function extractYoutubeId(
  url: string | null | undefined
): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();
  const iframeSrc = trimmed.match(/src=["']([^"']+)["']/i)?.[1];
  const candidate = (iframeSrc ?? trimmed).trim();
  const withProtocol = /^https?:\/\//i.test(candidate)
    ? candidate
    : `https://${candidate}`;

  try {
    const parsed = new URL(withProtocol);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      return YOUTUBE_ID.test(id) ? id : null;
    }
    if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "m.youtube.com") {
      const v = parsed.searchParams.get("v");
      if (v && YOUTUBE_ID.test(v)) return v;
      const pathId = parsed.pathname.match(
        /\/(?:embed|shorts|live|v)\/([^/?#]+)/
      )?.[1];
      if (pathId && YOUTUBE_ID.test(pathId)) return pathId;
    }
  } catch {
    // fall through — maybe a bare id
  }

  if (YOUTUBE_ID.test(trimmed)) return trimmed;
  return null;
}

function isDirectVideoUrl(
  url: string | null,
  mediaType: string | null | undefined
): boolean {
  if (!url || extractYoutubeId(url)) return false;
  if (IMAGE_FILE.test(url)) return false;
  if (VIDEO_FILE.test(url)) return true;
  return mediaType?.trim().toUpperCase() === "VIDEO";
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

  const mediaUrl = banner.mediaUrl?.trim() || null;
  const videoId =
    extractYoutubeId(banner.videoYoutubeLink) || extractYoutubeId(mediaUrl);
  const videoUrl =
    !videoId && isDirectVideoUrl(mediaUrl, banner.mediaType) ? mediaUrl : null;

  return {
    overline: banner.overline?.trim() || null,
    title,
    titleHighlights: normalizeTitleHighlights(banner.titleHighlights),
    description: banner.description?.trim() || null,
    videoId,
    videoUrl,
    imageUrl: videoId ? null : mediaUrl,
    stacks: normalizeStacks(banner.stacks),
    listItems: normalizeListItems(banner.listItems),
    ctas: normalizeBannerCtas(banner.cats),
  };
}
