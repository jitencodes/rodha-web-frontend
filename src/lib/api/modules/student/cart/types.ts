export interface StudentCartPromocodeApi {
  id?: number | string;
  code?: string;
  title?: string;
}

export interface StudentCartItemApi {
  id: number | string;
  packageId?: number | null;
  courseId?: number | null;
  listPrice?: number | null;
  salePrice?: number | null;
  discountAmount?: number | null;
  payableAmount?: number | null;
  promocode?: StudentCartPromocodeApi | null;
  package?: {
    id?: number | string;
    slug?: string;
    title?: string;
    bannerImageUrl?: string | null;
    language?: string | null;
  } | null;
  course?: {
    id?: number | string;
    slug?: string;
    title?: string;
    bannerImageUrl?: string | null;
  } | null;
  product?: {
    title?: string;
    bannerImageUrl?: string | null;
  } | null;
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

export interface PackagePromocodeApi {
  id: number | string;
  code?: string;
  title?: string;
  discountAmount?: number;
  discountPercent?: number;
}

export interface PackagePromocodesDataApi {
  items?: PackagePromocodeApi[];
  listPrice?: number;
  salePrice?: number;
  suggestedPromocodeId?: number | string | null;
  isNewUser?: boolean;
}
