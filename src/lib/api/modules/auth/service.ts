import { apiPost } from "@/lib/api/client";
import { mapAuthSession } from "@/lib/api/modules/auth/mapper";
import type {
  AuthGoogleRequest,
  AuthLoginRequest,
  AuthSessionApi,
  AuthSessionViewModel,
  AuthSignupRequest,
} from "@/lib/api/modules/auth/types";
import { ApiError } from "@/lib/api/types";

const SIGNUP_PATH = "api/auth/user/signup";
const LOGIN_PATH = "api/auth/user/login";
const GOOGLE_PATH = "api/auth/user/google";

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
}): Promise<AuthSessionViewModel> {
  const body: AuthSignupRequest = {
    fullName: input.fullName.trim(),
    email: input.email.trim(),
    password: input.password,
    phoneNumber: input.phoneNumber.trim(),
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
