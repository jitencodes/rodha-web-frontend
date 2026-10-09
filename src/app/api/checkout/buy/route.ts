import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session-cookie";
import { publicRequestUrl } from "@/lib/http/public-url";
import {
  addPackageToCart,
  clearStudentCart,
} from "@/lib/api/modules/student/cart/service";
import { ApiError } from "@/lib/api/types";

export const runtime = "nodejs";

function redirectTo(request: Request, path: string) {
  return NextResponse.redirect(publicRequestUrl(request, path));
}

function redirectToLogin(request: Request, packageId: string, slug: string) {
  const buyParams = new URLSearchParams({ packageId });
  if (slug) buyParams.set("slug", slug);
  const next = `/api/checkout/buy?${buyParams.toString()}`;
  return redirectTo(
    request,
    `/login?next=${encodeURIComponent(next)}`
  );
}

/**
 * Buy Now entry: require auth → clear cart → add package → checkout.
 * GET so cards/links can navigate directly.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const packageIdRaw = searchParams.get("packageId")?.trim() || "";
  const slug = searchParams.get("slug")?.trim() || "";
  const packageId = Number.parseInt(packageIdRaw, 10);

  if (!packageIdRaw || !Number.isFinite(packageId)) {
    return redirectTo(request, "/courses");
  }

  const jar = await cookies();
  const accessToken = jar.get(AUTH_COOKIE_NAME)?.value?.trim();
  if (!accessToken) {
    return redirectToLogin(request, packageIdRaw, slug);
  }

  try {
    await clearStudentCart(accessToken);
    await addPackageToCart(accessToken, packageId);
    return redirectTo(request, "/account/checkout");
  } catch (error) {
    console.error("[api/checkout/buy]", error);
    const message =
      error instanceof ApiError ? error.message : "Unable to start checkout";
    const failPath = slug ? `/courses/${slug}` : "/courses";
    const fail = new URLSearchParams({ checkoutError: message });
    return redirectTo(request, `${failPath}?${fail.toString()}`);
  }
}
