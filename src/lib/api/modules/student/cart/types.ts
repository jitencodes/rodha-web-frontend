import type { AddonApi, AddonCarrierApi } from "@/lib/api/modules/addons/types";

export interface StudentCartPromocodeApi {
  id?: number | string;
  code?: string;
  title?: string;
  discountType?: "PERCENT" | "FLAT" | string;
  discountValue?: number | null;
  maxDiscountValue?: number | null;
  description?: string | null;
}

export interface StudentCartItemApi {
  id: number | string;
  packageId?: number | null;
  courseId?: number | null;
  promocodeId?: number | null;
  listPrice?: number | null;
  salePrice?: number | null;
  discountAmount?: number | null;
  /** Package only, after discount (0 for a package the student already owns). */
  packagePayableAmount?: number | null;
  addonAmount?: number | null;
  /** Package + add-ons. */
  payableAmount?: number | null;
  selectedAddons?: AddonApi[] | null;
  promocode?: StudentCartPromocodeApi | null;
  package?:
    | (AddonCarrierApi & {
        id?: number | string;
        slug?: string;
        title?: string;
        bannerImageUrl?: string | null;
        language?: string | null;
      })
    | null;
  course?: {
    id?: number | string;
    slug?: string;
    title?: string;
    bannerImageUrl?: string | null;
  } | null;
  product?:
    | (AddonCarrierApi & {
        slug?: string;
        title?: string;
        bannerImageUrl?: string | null;
      })
    | null;
}

export interface StudentCartTotalsApi {
  itemCount?: number;
  subtotalAmount?: number;
  discountAmount?: number;
  payableAmount?: number;
}

export interface StudentCartApi {
  id?: number | string;
  userId?: string;
  items?: StudentCartItemApi[];
  totals?: StudentCartTotalsApi;
  updatedAt?: string;
}

export interface CheckoutResponseApi {
  mode?: "free" | "razorpay" | string;
  orderId?: number;
  orderNumber?: string;
  status?: string;
  payableAmount?: number;
  currency?: string;
  keyId?: string;
  razorpayOrderId?: string;
  amountPaise?: number;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  invoice?: {
    id?: number;
    invoiceNumber?: string;
    pdfUrl?: string | null;
  } | null;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponseApi {
  orderId?: number;
  orderNumber?: string;
  status?: string;
  payableAmount?: number;
  invoice?: {
    id?: number;
    invoiceNumber?: string;
    pdfUrl?: string | null;
  } | null;
}

/** Item of `GET /student/packages/:packageId/promocodes` (Promocodes FE Postman). */
export interface PackagePromocodeApi {
  id: number | string;
  code?: string;
  /** Legacy field — kept for older payloads. */
  title?: string;
  source?: "GRAPHY" | "RODHA" | string;
  websiteCategoryId?: number | null;
  discountType?: "PERCENT" | "FLAT" | string;
  discountValue?: number | null;
  maxDiscountValue?: number | null;
  minCartValue?: number | null;
  validFrom?: string | null;
  validTill?: string | null;
  description?: string | null;
  autoApply?: boolean;
  estimatedDiscount?: number | null;
  estimatedPayable?: number | null;
  applicable?: boolean;
}

/** Listed code shown on the checkout (cart) page. */
export interface CheckoutPromocodeOption {
  id: string;
  code: string;
  /** "20% off up to ₹3,000" / "₹500 off" */
  offerLabel: string;
  description: string;
  estimatedDiscount: number;
  validTill: string | null;
  autoApply: boolean;
  isBest: boolean;
}

export interface PackagePromocodesDataApi {
  packageId?: number;
  items?: PackagePromocodeApi[];
  listPrice?: number;
  salePrice?: number;
  suggestedPromocodeId?: number | string | null;
  isNewUser?: boolean;
}
