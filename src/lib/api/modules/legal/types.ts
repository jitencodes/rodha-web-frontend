export type LegalPageType =
  | "PRIVACY_POLICY"
  | "TERMS_OF_USE"
  | "REFUND_POLICY"
  | "DISCLAIMER";

export interface LegalPageApi {
  id: number;
  pageType: string;
  content?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  pageTypeLabel?: string | null;
}

export interface LegalTocItemViewModel {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface LegalPageViewModel {
  pageType: string;
  title: string;
  description: string;
  lastUpdated: string;
  html: string;
  toc: LegalTocItemViewModel[];
}
