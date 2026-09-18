export interface ContactSubmitRequest {
  fullName: string;
  countryCode: string;
  phone: string;
  email?: string;
  websiteCategoryId?: number;
  message?: string;
}

export interface ContactSubmitApi {
  id: number;
  fullName: string;
  countryCode?: string;
  phone?: string;
  email?: string;
  websiteCategoryId?: number | null;
  message?: string | null;
}

export interface ContactSubmitViewModel {
  id: string;
}
