/** Raw student user from signup / login `data.user`. */
export interface AuthUserApi {
  id: string;
  email: string;
  fullName: string;
  userType: string;
  mobile: string;
  isActive: boolean;
  profilePicturePath: string | null;
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

export interface AuthUserViewModel {
  id: string;
  email: string;
  fullName: string;
  userType: string;
  mobile: string;
  isActive: boolean;
  profilePicturePath: string | null;
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
