import type { AddonViewModel } from "@/lib/api/modules/addons/types";
import type { AuthUserViewModel } from "@/lib/api/modules/auth/types";
import type { CheckoutPromocodeOption } from "@/lib/api/modules/student/cart/types";
import type { DiscountCurrentViewModel } from "@/lib/api/modules/student/discount-requests/types";

/** What is being bought (also known before a cart line exists). */
export interface CheckoutProduct {
  /** Null for a single-course cart line (no add-ons / offers). */
  packageId: number | null;
  slug: string;
  title: string;
  thumbnail: string;
  detailsHref: string;
}

export interface CheckoutLine {
  cartItemId: string;
  listPrice: number;
  salePrice: number;
  discountAmount: number;
  /** Package only, after discount. */
  packagePayableAmount: number;
  addonAmount: number;
  /** Package + add-ons. */
  payableAmount: number;
  promocodeCode: string | null;
}

export interface CheckoutTotals {
  subtotalAmount: number;
  discountAmount: number;
  payableAmount: number;
}

/** Everything a cart response changes. */
export interface CheckoutCart {
  product: CheckoutProduct | null;
  line: CheckoutLine | null;
  totals: CheckoutTotals;
  addons: AddonViewModel[];
  selectedAddonIds: number[];
}

/** Cart plus the surrounding data the checkout page / sidebar needs. */
export interface CheckoutSession extends CheckoutCart {
  /** The student already owns the package: only add-ons can be bought. */
  packageOwned: boolean;
  /** Package vertical for `x-website-category-id` (null → API default). */
  websiteCategoryId: number | null;
  promocodeOptions: CheckoutPromocodeOption[];
  /** Request Discount state; null = unavailable (hidden). */
  discountRequest: DiscountCurrentViewModel | null;
  user: AuthUserViewModel | null;
}

/** `{ ok: true, … }` / `{ ok: false, error }` bodies of the checkout BFF. */
export type CheckoutSessionResponse = {
  ok: boolean;
  error?: string;
  session?: CheckoutSession;
};

export type CheckoutCartResponse = {
  ok: boolean;
  error?: string;
  errors?: Record<string, string>;
  cart?: CheckoutCart;
};

export type CheckoutPayResponse = {
  ok: boolean;
  error?: string;
  mode?: string;
  keyId?: string;
  razorpayOrderId?: string;
  amountPaise?: number;
  currency?: string;
  orderId?: number;
  orderNumber?: string;
  payableAmount?: number;
  prefill?: { name?: string; email?: string; contact?: string };
};

export type CheckoutVerifyResponse = {
  ok: boolean;
  error?: string;
  orderId?: number;
  orderNumber?: string;
  payableAmount?: number;
};
