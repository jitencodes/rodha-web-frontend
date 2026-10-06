import { NextResponse } from "next/server";
import { getStatesDropdown } from "@/lib/api/modules/states/service";
import { ApiError } from "@/lib/api/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim() || undefined;
  const pageRaw = Number(url.searchParams.get("page"));
  const limitRaw = Number(url.searchParams.get("limit"));
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 100) : 50;

  try {
    const data = await getStatesDropdown({ search, page, limit });
    return NextResponse.json({ ok: true, ...data });
  } catch (error) {
    const message =
      error instanceof ApiError
        ? error.message
        : "Unable to load states right now.";
    const status =
      error instanceof ApiError && error.status >= 400 && error.status < 600
        ? error.status
        : 502;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
