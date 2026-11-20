import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkoutPackageUpgrade } from "@/lib/api/modules/student/package-upgrades/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";
import {
  resolveCheckoutUtm,
  UTM_COOKIE_NAME,
} from "@/lib/tracking/utm";

export const runtime = "nodejs";

const STATE_NAME_MAX = 80;

function readStateName(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const value = (body as { stateName?: unknown }).stateName;
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > STATE_NAME_MAX) return undefined;
  return trimmed;
}

function readPositiveInt(value: unknown): number | null {
  const n =
    typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Start package upgrade checkout (free or Razorpay). */
export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const sourceEnrollmentId = readPositiveInt(record.sourceEnrollmentId);
  const targetPackageId = readPositiveInt(record.targetPackageId);
  if (sourceEnrollmentId == null || targetPackageId == null) {
    return NextResponse.json(
      { ok: false, error: "sourceEnrollmentId and targetPackageId are required." },
      { status: 400 }
    );
  }

  const stateName = readStateName(body);
  const websiteCategoryId =
    typeof record.websiteCategoryId === "number" ||
    typeof record.websiteCategoryId === "string"
      ? record.websiteCategoryId
      : null;

  try {
    const jar = await cookies();
    const utm = resolveCheckoutUtm(body, jar.get(UTM_COOKIE_NAME)?.value);
    const checkout = await checkoutPackageUpgrade(
      accessToken,
      {
        sourceEnrollmentId,
        targetPackageId,
        ...utm,
        ...(stateName ? { stateName } : {}),
      },
      websiteCategoryId
    );
    return NextResponse.json({
      ok: true,
      mode: checkout.mode,
      orderId: checkout.orderId,
      orderNumber: checkout.orderNumber,
      upgradeId: checkout.upgradeId,
      status: checkout.status,
      payableAmount: checkout.payableAmount,
      currency: checkout.currency,
      keyId: checkout.keyId,
      razorpayOrderId: checkout.razorpayOrderId,
      amountPaise: checkout.amountPaise,
      prefill: checkout.prefill,
      quote: checkout.quote,
    });
  } catch (error) {
    return bffErrorResponse(error, "Upgrade checkout failed");
  }
}
