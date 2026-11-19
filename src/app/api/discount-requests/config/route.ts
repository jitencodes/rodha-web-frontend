import { NextResponse } from "next/server";
import { getDiscountRequestConfig } from "@/lib/api/modules/student/discount-requests/service";
import { readWebsiteCategoryId } from "@/lib/api/website-category";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

/** Dropdown data for the discount request form. */
export async function GET(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  try {
    const data = await getDiscountRequestConfig(
      accessToken,
      readWebsiteCategoryId(request)
    );
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return bffErrorResponse(error, "Unable to load the discount form.");
  }
}
