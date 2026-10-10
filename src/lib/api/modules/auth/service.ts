import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { mapAuthSession, mapAuthUser } from "@/lib/api/modules/auth/mapper";
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
} from "@/lib/api/modules/auth/types";
import { ApiError } from "@/lib/api/types";

const SIGNUP_PATH = "api/auth/user/signup";
const LOGIN_PATH = "api/auth/user/login";
const GOOGLE_PATH = "api/auth/user/google";
const FORGOT_PASSWORD_PATH = "api/auth/user/forgot-password";
const RESET_PASSWORD_PATH = "api/auth/user/reset-password";
const ME_PATH = "api/auth/me";
const ME_STATE_PATH = "api/auth/me/state";

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
 * GET api/auth/me — current user including `stateId` / `state`.
 * Envelope `data` may be the user object or `{ user }`.
 */
export async function getCurrentUser(
  accessToken: string
): Promise<AuthUserViewModel | null> {
  const data = await apiGet<AuthUserApi | { user?: AuthUserApi }>(ME_PATH, {
    accessToken,
    cache: "no-store",
  });

  if (data && typeof data === "object" && "user" in data) {
    return mapAuthUser((data as { user?: AuthUserApi }).user);
  }
  return mapAuthUser(data as AuthUserApi);
}

export async function updateUserState(
  accessToken: string,
  patch: { stateId?: number; mobile?: string }
): Promise<AuthUserViewModel> {
  const body: { stateId?: number; mobile?: string } = {};
  if (patch.stateId != null) body.stateId = patch.stateId;
  if (patch.mobile) body.mobile = patch.mobile;

  await apiPatch<unknown, { stateId?: number; mobile?: string }>(
    ME_STATE_PATH,
    body,
    { accessToken }
  );
  const user = await getCurrentUser(accessToken);
  if (!user) {
    throw new ApiError("Unable to refresh user after profile update", 502);
  }
  return user;
}
