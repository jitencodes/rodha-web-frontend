import { isExternalHref } from "@/lib/utils";

import type {
  SearchHitApi,
  SearchResponseApi,
  SearchResultViewModel,
  SearchViewModel,
} from "@/lib/api/modules/search/types";

const LISTING_PATH: Record<string, string> = {
  PACKAGE: "/courses",
  FACULTY: "/faculty",
  RESOURCE: "/resources",
  BLOG: "/blog",
  FAQ: "/faq",
  SUCCESS_STORY: "/success-stories",
  TESTIMONIAL: "/testimonials",
  STUDENT_RESULT: "/results",
  CATEGORY: "/category",
};

function pickString(
  data: Record<string, unknown>,
  keys: string[]
): string | null {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function titleFor(entityType: string, data: Record<string, unknown>): string | null {
  if (entityType === "FACULTY" || entityType === "TESTIMONIAL" || entityType === "STUDENT_RESULT") {
    return pickString(data, ["fullName", "title", "name"]);
  }
  if (entityType === "FAQ") {
    return pickString(data, ["question", "title"]);
  }
  if (entityType === "CATEGORY") {
    return pickString(data, ["title", "name"]);
  }
  return pickString(data, ["title", "name", "fullName", "question"]);
}

function imageFor(data: Record<string, unknown>): string | null {
  return pickString(data, [
    "imageUrl",
    "bannerImageUrl",
    "profileImageUrl",
    "thumbnailUrl",
    "iconUrl",
  ]);
}

function hrefFor(
  entityType: string,
  data: Record<string, unknown>
): { href: string; external: boolean } | null {
  const explicitPath = pickString(data, ["path"]);
  if (explicitPath?.startsWith("/")) {
    return { href: explicitPath, external: false };
  }

  const redirectUrl = pickString(data, ["redirectUrl", "href", "url"]);
  if (redirectUrl && isExternalHref(redirectUrl)) {
    return { href: redirectUrl, external: true };
  }
  if (redirectUrl?.startsWith("/")) {
    return { href: redirectUrl, external: false };
  }

  const slug = pickString(data, ["slug"]);
  const base = LISTING_PATH[entityType];
  if (!base) return null;

  if (entityType === "FAQ" || entityType === "SUCCESS_STORY" || entityType === "TESTIMONIAL" || entityType === "STUDENT_RESULT") {
    return { href: slug ? `${base}?q=${encodeURIComponent(slug)}` : base, external: false };
  }

  if (slug) {
    return { href: `${base}/${slug}`, external: false };
  }

  return { href: base, external: false };
}

function mapHit(hit: SearchHitApi, index: number): SearchResultViewModel | null {
  const data = hit.data && typeof hit.data === "object" ? hit.data : {};
  const entityType = hit.entityType?.trim() || "UNKNOWN";
  const title = titleFor(entityType, data);
  const target = hrefFor(entityType, data);
  if (!title || !target) return null;

  let pathLabel = target.href;
  if (target.external) {
    try {
      const parsed = new URL(target.href);
      pathLabel = `${parsed.hostname}${parsed.pathname}`;
    } catch {
      pathLabel = target.href;
    }
  }

  return {
    id: `${entityType}-${String(hit.entityId ?? index)}`,
    entityType,
    title,
    imageUrl: imageFor(data),
    href: target.href,
    pathLabel,
    external: target.external,
  };
}

export function mapSearchResults(
  data: SearchResponseApi | null | undefined,
  unavailable = false
): SearchViewModel {
  const items = (data?.items ?? [])
    .map((hit, index) => mapHit(hit, index))
    .filter((item): item is SearchResultViewModel => item !== null);

  return { items, unavailable };
}
