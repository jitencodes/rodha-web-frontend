import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateUserState } from "@/lib/api/modules/auth/service";
import { getAccessToken } from "@/lib/auth/server-session";
import {
  applySessionCookies,
  AUTH_COOKIE_NAME,
  AUTH_GRAPHY_COOKIE_NAME,
  parseCookieJson,
} from "@/lib/auth/session-cookie";
import type { AuthGraphyViewModel } from "@/lib/api/modules/auth/types";
import { ApiError } from "@/lib/api/types";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";
import { validatePhone } from "@/lib/form-validation";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const record =
    body && typeof body === "object"
      ? (body as { stateId?: unknown; mobile?: unknown })
      : {};

  const hasState = "stateId" in record && record.stateId != null && record.stateId !== "";
  const hasMobile = typeof record.mobile === "string" && record.mobile.trim().length > 0;

  if (!hasState && !hasMobile) {
    return NextResponse.json(
      { ok: false, error: "Nothing to update." },
      { status: 400 }
    );
  }

  const stateId = hasState ? Number(record.stateId) : undefined;
  if (hasState && (!Number.isFinite(stateId) || (stateId ?? 0) <= 0)) {
    return NextResponse.json(
      { ok: false, error: "Please select a valid state." },
      { status: 400 }
    );
  }

  const mobile = hasMobile ? String(record.mobile).replace(/\D/g, "").slice(-10) : undefined;
  if (hasMobile && validatePhone(mobile ?? "")) {
    return NextResponse.json(
      { ok: false, error: "Enter a 10-digit mobile number." },
      { status: 400 }
    );
  }

  try {
    const user = await updateUserState(accessToken, {
      ...(hasState ? { stateId } : {}),
      ...(hasMobile ? { mobile } : {}),
    });
    const jar = await cookies();
    const token = jar.get(AUTH_COOKIE_NAME)?.value || accessToken;
    const graphy = parseCookieJson<AuthGraphyViewModel>(
      jar.get(AUTH_GRAPHY_COOKIE_NAME)?.value
    );
    const response = NextResponse.json({ ok: true, user });
    applySessionCookies(
      response,
      {
        accessToken: token,
        user,
        graphy,
      },
      request
    );
    return response;
  } catch (error) {
    if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    const message =
      error instanceof ApiError
        ? error.message
        : "Unable to update state right now.";
    const status =
      error instanceof ApiError && error.status >= 400 && error.status < 600
        ? error.status
        : 502;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
