/**
 * Client helpers for package Buy Now / View Course CTAs.
 */

export function packageDetailHref(slug: string): string {
  return `/courses/${slug}`;
}

export function packageViewCourseHref(packageId: number | string | null): string {
  if (packageId === null || packageId === undefined || packageId === "") {
    return "/account/courses?tab=continue";
  }
  return `/account/courses?tab=continue&packageId=${encodeURIComponent(String(packageId))}`;
}

/** `/courses/:slug?checkout=1` opens the checkout sidebar on arrival. */
export const CHECKOUT_OPEN_QUERY = "checkout";

/** Buy Now from a card: the package page with the checkout sidebar open. */
export function packageBuyNowHref(packageId: number | string, slug?: string): string {
  if (slug) return `${packageDetailHref(slug)}?${CHECKOUT_OPEN_QUERY}=1`;
  // No page to open the sidebar on: straight to the checkout page.
  return `/api/checkout/buy?packageId=${encodeURIComponent(String(packageId))}`;
}

/** Keep checkout on the host the browser opened (IP, domain, or localhost). */
export function sameOriginBuyHref(href: string): string {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  try {
    const url = new URL(href);
    if (!url.pathname.startsWith("/api/checkout/buy")) return href;
    return `${url.pathname}${url.search}`;
  } catch {
    return href;
  }
}

export function isPackageBuyNowHref(href: string): boolean {
  return sameOriginBuyHref(href).startsWith("/api/checkout/buy");
}
