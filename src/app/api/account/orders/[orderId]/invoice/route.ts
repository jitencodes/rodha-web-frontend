import { NextResponse } from "next/server";
import { getStudentOrderInvoiceUrl } from "@/lib/api/modules/student/orders/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { bffErrorResponse, bffUnauthorized } from "@/lib/http/bff-response";

export const runtime = "nodejs";

/** `{ ok, pdfUrl }` — `pdfUrl` is `null` while the invoice PDF is generating. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const accessToken = await getAccessToken();
  if (!accessToken) return bffUnauthorized();

  const { orderId } = await params;
  if (!/^\d+$/.test(orderId)) {
    return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
  }

  try {
    const pdfUrl = await getStudentOrderInvoiceUrl(accessToken, orderId);
    return NextResponse.json(
      { ok: true, pdfUrl },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return bffErrorResponse(error, "Unable to load the invoice right now.");
  }
}
