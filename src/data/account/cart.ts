import type {
  CartCoupon,
  CartItem,
  CartSummaryConfig,
} from "@/lib/account/types";

const CAT = "/assets/images/courses/cat";

/**
 * Cart line items with numeric prices so subtotal / discount / GST / total
 * can be computed on the cart page.
 */
export const ACCOUNT_CART_ITEMS: CartItem[] = [
  {
    id: "cart-r8-hinglish",
    productId: "acct-r8-hinglish",
    title: "CAT 2026 | R8 (Hinglish) Comprehensive Batch",
    productType: "course",
    thumbnail: `${CAT}/cat-2026-r8-hinglish-comprehensive-batch.jpg`,
    price: 24999,
    originalPrice: 40000,
    discountPercent: 38,
    meta: {
      language: "Hinglish",
      mode: "Live + Recorded",
      access: "2 Years Access",
    },
    detailsHref:
      "/category/cat/courses/cat-2026-r8-hinglish-comprehensive-batch",
  },
  {
    id: "cart-mock-series",
    productId: "ts-cat-mocks",
    title: "CAT 2026 Mock Test Series",
    productType: "test-series",
    thumbnail: `${CAT}/rodha-cat-mocks.png`,
    price: 4999,
    originalPrice: 7000,
    discountPercent: 29,
    meta: {
      language: "Hinglish",
      quantityLabel: "30 Full Length Tests",
      access: "1 Year Access",
    },
    detailsHref: "https://mocks.rodha.co.in/",
  },
];

/** Demo coupon matching the cart reference (RODHA10 @ 10%). */
export const ACCOUNT_CART_COUPON: CartCoupon = {
  code: "RODHA10",
  appliedLabel: "RODHA10 applied!",
  percentOff: 10,
  isApplied: true,
};

export const ACCOUNT_CART_SUMMARY_CONFIG: CartSummaryConfig = {
  gstRate: 0.18,
  currencySymbol: "₹",
  secureCheckoutLabel: "Secure checkout via Razorpay",
  savingsBannerTemplate:
    "You're saving {amount} on this order! Keep learning with Rodha.",
};

export const ACCOUNT_CART_PAGE_COPY = {
  title: "My Cart",
  subtitle: "Review your selected courses and test series before checkout.",
  emptyMessage: "Your cart is empty. Explore courses to get started.",
  continueCtaPrefix: "Continue to Pay",
  recommendedTitle: "You May Also Like",
  recommendedSubtitle: "Popular picks to pair with your cart.",
} as const;
