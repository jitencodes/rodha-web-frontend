import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/types";

/** `{ fieldName: "first message" }` from the API's `errors: { field: [msg] }`. */
export type BffFieldErrors = Record<string, string>;

export function readApiFieldErrors(body: unknown): BffFieldErrors | undefined {
  if (!body || typeof body !== "object") return undefined;
  const errors = (body as { errors?: unknown }).errors;
  if (!errors || typeof errors !== "object") return undefined;
  const out: BffFieldErrors = {};
  for (const [field, value] of Object.entries(errors as Record<string, unknown>)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (typeof first === "string" && first.trim()) out[field] = first;
  }
  return Object.keys(out).length ? out : undefined;
}

export function bffUnauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

/**
 * Turn an upstream failure into `{ ok: false, error, errors? }`, keeping the
 * API status (400 / 404 / 409 / 429) so the client can react to it.
 */
export function bffErrorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiError) {
    const status = error.status >= 400 && error.status < 600 ? error.status : 502;
    return NextResponse.json(
      {
        ok: false,
        error: error.message || fallbackMessage,
        errors: readApiFieldErrors(error.body),
      },
      { status }
    );
  }
  return NextResponse.json({ ok: false, error: fallbackMessage }, { status: 502 });
}
