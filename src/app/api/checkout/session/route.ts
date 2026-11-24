import { NextResponse } from "next/server";
import { readAddonIds } from "@/lib/api/modules/addons/mapper";
import { getAccessToken } from "@/lib/auth/server-session";
import {
  getCheckoutSession,
  prepareCheckoutSession,
} from "@/lib/checkout/load-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

const SLUG_MAX = 200;

function readPackageId(value: unknown): number | null {
  const id =
    typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function readSlug(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, SLUG_MAX) : "";
}

function sessionJson(session: unknown) {
  return NextResponse.json(
    { ok: true, session },
    { headers: { "Cache-Control": "no-store" } }
  );
}

/** Current cart + offers. `?packageId=&slug=` keeps the package shown when the cart is empty. */
export async function GET(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  const { searchParams } = new URL(request.url);
  const packageId = readPackageId(searchParams.get("packageId"));
  const slug = readSlug(searchParams.get("slug"));

  try {
    return sessionJson(
      await getCheckoutSession(
        accessToken,
        packageId != null ? { packageId, slug } : undefined
      )
    );
  } catch (error) {
    return bffErrorResponse(error, "Unable to load checkout");
  }
}

/** Buy Now: put the package in the cart and return the checkout session. */
export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const packageId = readPackageId(payload.packageId);
  if (packageId == null) {
    return NextResponse.json(
      { ok: false, error: "Select a package to continue." },
      { status: 400 }
    );
  }

  try {
    return sessionJson(
      await prepareCheckoutSession(accessToken, {
        packageId,
        slug: readSlug(payload.slug),
        addonIds: readAddonIds(payload.addonIds),
      })
    );
  } catch (error) {
    return bffErrorResponse(error, "Unable to start checkout");
  }
}
