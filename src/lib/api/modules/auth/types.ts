import type { AuthStateApi } from "@/lib/api/modules/states/types";

/** Raw student user from signup / login / me `data.user` or `data`. */
export interface AuthUserApi {
  id: string;
  email: string;
  fullName: string;
  userType: string;
  mobile: string;
  isActive: boolean;
  profilePicturePath: string | null;
  stateId?: number | null;
  state?: AuthStateApi | null;
}

/** Optional Graphy SSO payload — mapped but unused in the auth UI. */
export interface AuthGraphyApi {
  ssoToken?: string;
  ssoUrl?: string;
  graphyLearnerId?: string;
}

export interface AuthSessionApi {
  accessToken: string;
  user: AuthUserApi;
  roles?: string[];
  graphy?: AuthGraphyApi | null;
}

export interface AuthSignupRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  stateId: number;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
  is_web: true;
}

export interface AuthGoogleRequest {
  idToken: string;
  is_web: true;
}

export interface AuthForgotPasswordRequest {
  email: string;
  is_web: true;
}

export interface AuthResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  is_web: true;
}

export interface AuthPasswordMessageApi {
  message?: string | null;
}

export interface AuthStateViewModel {
  id: number;
  name: string;
  code: string;
}

export interface AuthUserViewModel {
  id: string;
  email: string;
  fullName: string;
  userType: string;
  mobile: string;
  isActive: boolean;
  profilePicturePath: string | null;
  stateId: number | null;
  state: AuthStateViewModel | null;
}

export interface AuthGraphyViewModel {
  ssoToken: string;
  ssoUrl: string;
  graphyLearnerId: string;
}

export interface AuthSessionViewModel {
  accessToken: string;
  user: AuthUserViewModel;
  roles: string[];
  graphy: AuthGraphyViewModel | null;
}
