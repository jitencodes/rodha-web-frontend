import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import {
  mapAuthSession,
  mapAuthUser,
  mapPurchaseIdentify,
} from "@/lib/api/modules/auth/mapper";
import type {
  AuthForgotPasswordRequest,
  AuthGoogleRequest,
  AuthLoginRequest,
  AuthPasswordMessageApi,
  AuthResetPasswordRequest,
  AuthSessionApi,
  AuthSessionViewModel,
  AuthSignupRequest,
  AuthUserApi,
  AuthUserViewModel,
  PurchaseIdentifyApi,
  PurchaseIdentifyRequest,
  PurchaseIdentifyViewModel,
} from "@/lib/api/modules/auth/types";
import { ApiError } from "@/lib/api/types";

const SIGNUP_PATH = "api/auth/user/signup";
const LOGIN_PATH = "api/auth/user/login";
const GOOGLE_PATH = "api/auth/user/google";
const FORGOT_PASSWORD_PATH = "api/auth/user/forgot-password";
const RESET_PASSWORD_PATH = "api/auth/user/reset-password";
const PURCHASE_PATH = "api/auth/purchase";
const ME_PATH = "api/auth/me";
const ME_DETAILS_PATH = "api/auth/me/details";

async function postSession<TBody>(
  path: string,
  body: TBody
): Promise<AuthSessionViewModel> {
  const data = await apiPost<AuthSessionApi, TBody>(path, body);
  const mapped = mapAuthSession(data);
  if (!mapped) {
    throw new ApiError("Auth response was missing a session", 502, data);
  }
  return mapped;
}

export async function signupStudent(input: {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  stateId: number;
}): Promise<AuthSessionViewModel> {
  const body: AuthSignupRequest = {
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    password: input.password,
    phoneNumber: input.phoneNumber.trim(),
    stateId: input.stateId,
  };
  return postSession(SIGNUP_PATH, body);
}

export async function loginStudent(input: {
  email: string;
  password: string;
}): Promise<AuthSessionViewModel> {
  const body: AuthLoginRequest = {
    email: input.email.trim(),
    password: input.password,
    is_web: true,
  };
  return postSession(LOGIN_PATH, body);
}

export async function loginWithGoogle(input: {
  idToken: string;
}): Promise<AuthSessionViewModel> {
  const body: AuthGoogleRequest = {
    idToken: input.idToken.trim(),
    is_web: true,
  };
  return postSession(GOOGLE_PATH, body);
}

/** Guest checkout: start a purchase journey and learn how this email signs in. */
export async function identifyPurchaseGuest(
  body: PurchaseIdentifyRequest
): Promise<PurchaseIdentifyViewModel> {
  const data = await apiPost<PurchaseIdentifyApi, PurchaseIdentifyRequest>(
    `${PURCHASE_PATH}/identify`,
    body
  );
  const mapped = mapPurchaseIdentify(data);
  if (!mapped) {
    throw new ApiError("Purchase identity response was incomplete", 502, data);
  }
  return mapped;
}

/** Emails the purchase OTP; the API uses one endpoint to send and resend. */
export async function sendPurchaseOtp(input: {
  journeyId: number;
  email: string;
}): Promise<void> {
  await apiPost<unknown, { journeyId: number; email: string }>(
    `${PURCHASE_PATH}/email-otp/resend`,
    { journeyId: input.journeyId, email: input.email.trim() }
  );
}

/** Verifies the email OTP and signs the student in (creates new accounts). */
export async function verifyPurchaseOtp(input: {
  journeyId: number;
  email: string;
  otp: string;
}): Promise<AuthSessionViewModel> {
  return postSession(`${PURCHASE_PATH}/email-otp/verify`, {
    journeyId: input.journeyId,
    email: input.email.trim(),
    otp: input.otp.trim(),
  });
}

export async function forgotPassword(input: {
  email: string;
}): Promise<string> {
  const body: AuthForgotPasswordRequest = {
    email: input.email.trim(),
    is_web: true,
  };
  const data = await apiPost<AuthPasswordMessageApi, AuthForgotPasswordRequest>(
    FORGOT_PASSWORD_PATH,
    body
  );
  return (
    (typeof data?.message === "string" && data.message.trim()) ||
    "Password reset link has been sent"
  );
}

export async function resetPassword(input: {
  email: string;
  token: string;
  newPassword: string;
}): Promise<string> {
  const body: AuthResetPasswordRequest = {
    email: input.email.trim(),
    token: input.token.trim(),
    newPassword: input.newPassword,
    is_web: true,
  };
  const data = await apiPost<AuthPasswordMessageApi, AuthResetPasswordRequest>(
    RESET_PASSWORD_PATH,
    body
  );
  return (
    (typeof data?.message === "string" && data.message.trim()) ||
    "Password has been reset successfully"
  );
}

/**
 * GET api/auth/me, unmapped. Envelope `data` may be the user object or `{ user }`.
 */
export async function getMe(accessToken: string): Promise<AuthUserApi | null> {
  const data = await apiGet<AuthUserApi | { user?: AuthUserApi } | null>(ME_PATH, {
    accessToken,
    cache: "no-store",
  });
  if (data && typeof data === "object" && "user" in data) return data.user ?? null;
  return data as AuthUserApi | null;
}

/** Current user including `stateId` / `state` and verification flags. */
export async function getCurrentUser(
  accessToken: string
): Promise<AuthUserViewModel | null> {
  return mapAuthUser(await getMe(accessToken));
}

/** Emails a code to the account address, or texts one to `mobile`. */
export async function sendVerificationOtp(
  accessToken: string,
  input: { channel: "email" } | { channel: "mobile"; mobile: string }
): Promise<void> {
  await apiPost<unknown, { mobile?: string }>(
    `api/auth/${input.channel}-verification/otp/send`,
    input.channel === "mobile" ? { mobile: input.mobile } : {},
    { accessToken }
  );
}

/** Wrong code = 401. A verified mobile is saved on the account and locked. */
export async function verifyVerificationOtp(
  accessToken: string,
  input:
    | { channel: "email"; otp: string }
    | { channel: "mobile"; otp: string; mobile: string }
): Promise<void> {
  await apiPost<unknown, { otp: string; mobile?: string }>(
    `api/auth/${input.channel}-verification/otp/verify`,
    input.channel === "mobile"
      ? { mobile: input.mobile, otp: input.otp }
      : { otp: input.otp },
    { accessToken }
  );
}

/**
 * PATCH api/auth/me/details — students only, state only (a mobile number is
 * set through the verification OTP). Returns the updated profile.
 */
export async function updateUserDetails(
  accessToken: string,
  patch: { stateId: number }
): Promise<AuthUserViewModel> {
  const data = await apiPatch<
    AuthUserApi | { user?: AuthUserApi },
    { stateId: number }
  >(ME_DETAILS_PATH, { stateId: patch.stateId }, { accessToken });

  const mapped =
    data && typeof data === "object" && "user" in data
      ? mapAuthUser(data.user)
      : mapAuthUser(data as AuthUserApi);
  if (mapped) return mapped;

  const user = await getCurrentUser(accessToken);
  if (!user) {
    throw new ApiError("Unable to refresh user after profile update", 502);
  }
  return user;
}

/**
 * PATCH api/auth/me/details with the full complete-profile payload.
 * Backend field contract is pending; extra keys may be ignored until expanded.
 */
export async function updateCompleteProfile(
  accessToken: string,
  payload: Record<string, unknown>
): Promise<AuthUserViewModel> {
  const data = await apiPatch<
    AuthUserApi | { user?: AuthUserApi },
    Record<string, unknown>
  >(ME_DETAILS_PATH, payload, { accessToken });

  const mapped =
    data && typeof data === "object" && "user" in data
      ? mapAuthUser(data.user)
      : mapAuthUser(data as AuthUserApi);
  if (mapped) return mapped;

  const user = await getCurrentUser(accessToken);
  if (!user) {
    throw new ApiError("Unable to refresh user after profile update", 502);
  }
  return user;
}

/** Placeholder upstream path — swap when the email-update request API lands. */
export const EMAIL_UPDATE_REQUEST_PATH =
  "api/auth/me/email-update-request";

export async function requestEmailUpdate(
  accessToken: string,
  requestedEmail: string
): Promise<{ message?: string } | null> {
  return apiPost<{ message?: string } | null, { requestedEmail: string }>(
    EMAIL_UPDATE_REQUEST_PATH,
    { requestedEmail: requestedEmail.trim() },
    { accessToken }
  );
}
