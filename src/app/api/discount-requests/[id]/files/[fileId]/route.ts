import { NextResponse } from "next/server";
import { getMyDiscountRequestFileLink } from "@/lib/api/modules/student/discount-requests/service";
import { readWebsiteCategoryId } from "@/lib/api/website-category";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string; fileId: string }> };

/** Fresh signed proof link (expires in ~5 minutes) — fetched on click, never cached. */
export async function GET(request: Request, context: RouteContext) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  const { id, fileId } = await context.params;
  if (!id?.trim() || !fileId?.trim()) {
    return NextResponse.json({ ok: false, error: "Missing file id." }, { status: 400 });
  }

  try {
    const data = await getMyDiscountRequestFileLink(
      accessToken,
      id,
      fileId,
      readWebsiteCategoryId(request)
    );
    return NextResponse.json(
      { ok: true, data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return bffErrorResponse(error, "Unable to open this file.");
  }
}
