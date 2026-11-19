import { NextResponse } from "next/server";
import { resubmitDiscountRequest } from "@/lib/api/modules/student/discount-requests/service";
import { readWebsiteCategoryId } from "@/lib/api/website-category";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

/** Resubmit a REJECTED request. Proofs not re-uploaded are carried over by the API. */
export async function POST(request: Request, context: RouteContext) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ ok: false, error: "Missing request id." }, { status: 400 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
  }

  try {
    const data = await resubmitDiscountRequest(
      accessToken,
      id,
      form,
      readWebsiteCategoryId(request)
    );
    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch (error) {
    return bffErrorResponse(error, "Unable to resubmit your discount request.");
  }
}
