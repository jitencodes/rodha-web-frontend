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

export function packageBuyNowHref(packageId: number | string, slug?: string): string {
  const params = new URLSearchParams({
    packageId: String(packageId),
  });
  if (slug) params.set("slug", slug);
  return `/api/checkout/buy?${params.toString()}`;
}

export function packageLoginBuyHref(packageId: number | string, slug?: string): string {
  const next = packageBuyNowHref(packageId, slug);
  return `/login?next=${encodeURIComponent(next)}`;
}
