import { NextResponse } from "next/server";
import { identifyPurchaseGuest } from "@/lib/api/modules/auth/service";
import {
  validateEmail,
  validateIndianMobile,
  validateName,
} from "@/lib/form-validation";
import { bffErrorResponse } from "@/lib/http/bff-response";

export const runtime = "nodejs";

const STATE_NAME_MAX = 80;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Guest checkout step 1: `{ fullName, email, mobile, stateName, packageId }`. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const fullName = readString(payload.fullName).replace(/\s+/g, " ");
  const email = readString(payload.email);
  const mobile = readString(payload.mobile);
  const stateName = readString(payload.stateName);
  const packageId = Number(payload.packageId);

  const errors: Record<string, string> = {};
  const nameError = validateName(fullName);
  const emailError = validateEmail(email);
  const mobileError = validateIndianMobile(mobile);
  if (nameError) errors.fullName = nameError;
  if (emailError) errors.email = emailError;
  if (mobileError) errors.mobile = mobileError;
  if (!stateName || stateName.length > STATE_NAME_MAX) {
    errors.stateName = "Please select your state.";
  }
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, error: "Please check your details.", errors },
      { status: 400 }
    );
  }

  try {
    const identity = await identifyPurchaseGuest({
      fullName,
      email,
      mobile,
      stateName,
      countryCode: "+91",
      ...(Number.isInteger(packageId) && packageId > 0 ? { packageId } : {}),
    });
    return NextResponse.json({ ok: true, identity });
  } catch (error) {
    return bffErrorResponse(error, "Unable to continue right now.");
  }
}
