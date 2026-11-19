import { NextResponse } from "next/server";
import {
  getMyDiscountRequests,
  submitDiscountRequest,
} from "@/lib/api/modules/student/discount-requests/service";
import { readWebsiteCategoryId } from "@/lib/api/website-category";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

/** My discount requests (dashboard). */
export async function GET(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  try {
    const items = await getMyDiscountRequests(
      accessToken,
      readWebsiteCategoryId(request)
    );
    return NextResponse.json({ ok: true, items });
  } catch (error) {
    return bffErrorResponse(error, "Unable to load discount requests.");
  }
}

/** Submit a new request (multipart, files forwarded as-is). */
export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid form data." },
      { status: 400 }
    );
  }

  try {
    const data = await submitDiscountRequest(
      accessToken,
      form,
      readWebsiteCategoryId(request)
    );
    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch (error) {
    return bffErrorResponse(error, "Unable to submit your discount request.");
  }
}
