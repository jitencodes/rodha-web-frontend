import { cookies } from "next/headers";
import type {
  AuthGraphyViewModel,
  AuthUserViewModel,
} from "@/lib/api/modules/auth/types";
import {
  AUTH_COOKIE_NAME,
  AUTH_GRAPHY_COOKIE_NAME,
  AUTH_USER_COOKIE_NAME,
  parseCookieJson,
} from "@/lib/auth/session-cookie";

export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value?.trim();
  return token || null;
}

export async function getSessionUser(): Promise<AuthUserViewModel | null> {
  const jar = await cookies();
  return parseCookieJson<AuthUserViewModel>(
    jar.get(AUTH_USER_COOKIE_NAME)?.value
  );
}

export async function getSessionGraphy(): Promise<AuthGraphyViewModel | null> {
  const jar = await cookies();
  return parseCookieJson<AuthGraphyViewModel>(
    jar.get(AUTH_GRAPHY_COOKIE_NAME)?.value
  );
}

export async function requireAccessToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("Not authenticated");
  }
  return token;
}

export { withSsoToken } from "@/lib/auth/sso";
