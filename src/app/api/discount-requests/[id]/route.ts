import { NextResponse } from "next/server";
import { getMyDiscountRequest } from "@/lib/api/modules/student/discount-requests/service";
import { readWebsiteCategoryId } from "@/lib/api/website-category";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ ok: false, error: "Missing request id." }, { status: 400 });
  }

  try {
    const data = await getMyDiscountRequest(
      accessToken,
      id,
      readWebsiteCategoryId(request)
    );
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return bffErrorResponse(error, "Unable to load this discount request.");
  }
}
