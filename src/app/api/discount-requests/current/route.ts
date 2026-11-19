import { NextResponse } from "next/server";
import { getCurrentDiscountRequest } from "@/lib/api/modules/student/discount-requests/service";
import { readWebsiteCategoryId } from "@/lib/api/website-category";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

/** Request Discount button state for one package. */
export async function GET(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  const packageId = Number.parseInt(
    new URL(request.url).searchParams.get("packageId") ?? "",
    10
  );
  if (!Number.isFinite(packageId) || packageId <= 0) {
    return NextResponse.json(
      { ok: false, error: "packageId is required." },
      { status: 400 }
    );
  }

  try {
    const data = await getCurrentDiscountRequest(
      accessToken,
      packageId,
      readWebsiteCategoryId(request)
    );
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return bffErrorResponse(error, "Unable to load discount status.");
  }
}
