import { apiGet, apiPatch, apiPost } from "@/lib/api/client";
import { mapAuthSession, mapAuthUser } from "@/lib/api/modules/auth/mapper";
import type {
  AuthGoogleRequest,
  AuthLoginRequest,
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
  stateId: number
): Promise<AuthUserViewModel> {
  await apiPatch<unknown, { stateId: number }>(
    ME_STATE_PATH,
    { stateId },
    { accessToken }
  );
  const user = await getCurrentUser(accessToken);
  if (!user) {
    throw new ApiError("Unable to refresh user after state update", 502);
  }
  return user;
}
