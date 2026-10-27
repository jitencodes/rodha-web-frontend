import { NextResponse } from "next/server";

import { searchWebsite } from "@/lib/api/modules/search/service";
import type { SearchScope } from "@/lib/api/modules/search/types";
import { ApiError } from "@/lib/api/types";
import { getAccessToken } from "@/lib/auth/server-session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const entityTypes = url.searchParams.get("entityTypes")?.trim() || undefined;
  const scopeParam = url.searchParams.get("scope");
  const scope: SearchScope = scopeParam === "account" ? "account" : "website";
  const page = Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1;
  const limit = Number.parseInt(url.searchParams.get("limit") ?? "10", 10) || 10;

  if (!q) {
    return NextResponse.json({ ok: true, items: [], unavailable: false });
  }

  try {
    const accessToken = await getAccessToken();
    const result = await searchWebsite({
      q,
      entityTypes,
      scope,
      page,
      limit,
      accessToken: accessToken ?? undefined,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Search is unavailable.";
    return NextResponse.json(
      { ok: false, error: message, items: [], unavailable: false },
      { status: 200 }
    );
  }
}
