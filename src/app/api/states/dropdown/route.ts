import { NextResponse } from "next/server";
import {
  getAllStatesDropdown,
  getStatesDropdown,
} from "@/lib/api/modules/states/service";
import { ApiError } from "@/lib/api/types";

export const runtime = "nodejs";

/**
 * Default: return the full state list (paginated upstream until last page).
 * Pass `page=` to fetch a single page instead.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search")?.trim() || undefined;
  const pageParam = url.searchParams.get("page");
  const pageRaw = Number(pageParam);
  const limitRaw = Number(url.searchParams.get("limit"));
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 100) : 50;

  try {
    // Single-page mode when caller explicitly passes page
    if (pageParam != null && pageParam !== "" && Number.isFinite(pageRaw)) {
      const page = pageRaw > 0 ? pageRaw : 1;
      const data = await getStatesDropdown({ search, page, limit });
      return NextResponse.json({ ok: true, ...data });
    }

    const data = await getAllStatesDropdown({ search, limit });
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
