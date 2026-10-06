import type {
  AuthGraphyApi,
  AuthGraphyViewModel,
  AuthSessionApi,
  AuthSessionViewModel,
  AuthUserApi,
  AuthUserViewModel,
} from "@/lib/api/modules/auth/types";
import { mapAuthState } from "@/lib/api/modules/states/mapper";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function mapAuthUser(
  user: AuthUserApi | null | undefined
): AuthUserViewModel | null {
  if (!user) return null;
  const id = asString(user.id);
  const email = asString(user.email);
  if (!id || !email) return null;

  const state = mapAuthState(user.state ?? null);
  const stateId =
    typeof user.stateId === "number" && Number.isFinite(user.stateId)
      ? user.stateId
      : state?.id ?? null;

  return {
    id,
    email,
    fullName: asString(user.fullName),
    userType: asString(user.userType),
    mobile: asString(user.mobile),
    isActive: user.isActive !== false,
    profilePicturePath:
      typeof user.profilePicturePath === "string"
        ? user.profilePicturePath
        : null,
    stateId,
    state,
  };
}

export function mapAuthGraphy(
  graphy: AuthGraphyApi | null | undefined
): AuthGraphyViewModel | null {
  if (!graphy) return null;
  const ssoToken = asString(graphy.ssoToken);
  const ssoUrl = asString(graphy.ssoUrl);
  if (!ssoToken && !ssoUrl) return null;
  return {
    ssoToken,
    ssoUrl,
    graphyLearnerId: asString(graphy.graphyLearnerId),
  };
}

export function mapAuthSession(
  data: AuthSessionApi | null | undefined
): AuthSessionViewModel | null {
  if (!data) return null;
  const accessToken = asString(data.accessToken);
  const user = mapAuthUser(data.user);
  if (!accessToken || !user) return null;

  return {
    accessToken,
    user,
    roles: Array.isArray(data.roles)
      ? data.roles.filter((role): role is string => typeof role === "string")
      : [],
    graphy: mapAuthGraphy(data.graphy),
  };
}

/** True when the user has a persisted state selection. */
export function userHasState(user: AuthUserViewModel | null | undefined): boolean {
  return Boolean(user?.stateId && user.state);
}
