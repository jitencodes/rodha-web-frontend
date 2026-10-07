/**
 * Typed models for the Student Account Dashboard (static foundation).
 * Listing pages that reuse marketing cards also use `Course` / `TestSeriesItem`
 * from `@/lib/types`.
 */

export type AccountProductType = "course" | "test-series";

export type AccountOrderStatus =
  | "active"
  | "completed"
  | "expired"
  | "refunded"
  | "pending";

export type AccountPaymentStatus =
  | "paid"
  | "pending"
  | "failed"
  | "refunded";

/** Logged-in student shown in account chrome (header, welcome, sidebar). */
export interface AccountUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  hasUnreadNotifications: boolean;
}

/** Continue Watching / in-progress learning card. */
export interface ContinueWatchingItem {
  id: string;
  title: string;
  /** Category chip, e.g. "MBA" */
  tag: string;
  thumbnail: string;
  /** Time spent label for card body (from totalTime), e.g. "32:15" */
  timeSpentLabel?: string;
  /** Valid till display date when available */
  validTillLabel?: string;
  /** Course language when available */
  language?: string;
  progressCurrent: number;
  progressTotal: number;
  /** Display string, e.g. "12 of 45 lectures" */
  progressLabel: string;
  href: string;
}

/** Donut + status counts on the dashboard right rail. */
export interface LearningProgress {
  percent: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  title: string;
  encouragement: string;
}

/** Recommended / You May Also Like product tile (account cards, not CourseCardV2). */
export interface RecommendedProduct {
  id: string;
  title: string;
  tag: string;
  thumbnail: string;
  price: number;
  originalPrice: number;
  /** Whole-number percent off, e.g. 38 */
  discountPercent: number;
  href: string;
  productType: AccountProductType;
  /** CTA for cart "You May Also Like" */
  ctaLabel?: string;
}

export interface AccountOrder {
  id: string;
  /** Display Order ID, e.g. "RDH-2025-08412" */
  orderNumber: string;
  /** Short title for dashboard preview / table */
  title: string;
  productType: AccountProductType;
  /** ISO date for sorting */
  purchasedAt: string;
  /** Display date, e.g. "12 Aug 2025" */
  purchasedAtLabel: string;
  status: AccountOrderStatus;
  statusLabel: string;
  paymentStatus: AccountPaymentStatus;
  paymentStatusLabel: string;
  amount: number;
  thumbnail?: string;
  href?: string;
}

export interface CartItemMeta {
  language?: string;
  mode?: string;
  access?: string;
  /** e.g. "30 Full Length Tests" */
  quantityLabel?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  productType: AccountProductType;
  thumbnail: string;
  /** Sale price in INR (integer rupees) */
  price: number;
  /** MRP in INR */
  originalPrice: number;
  discountPercent: number;
  meta: CartItemMeta;
  detailsHref: string;
}

export interface CartCoupon {
  code: string;
  /** Success copy, e.g. "RODHA10 applied!" */
  appliedLabel: string;
  percentOff: number;
  /** Whether the demo cart starts with this coupon applied */
  isApplied: boolean;
}

/** Profile form initial values. */
export interface AccountProfile {
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  stateId?: number | null;
  stateName?: string;
  stateCode?: string;
  /** @deprecated Prefer fullName — kept for transitional mocks */
  firstName?: string;
  lastName?: string;
}

export interface DashboardWelcome {
  /** Text before the highlighted first name, e.g. "Welcome back," */
  greetingPrefix: string;
  message: string;
  illustrationSrc?: string;
}

export interface DashboardQuickLink {
  id: string;
  label: string;
  href: string;
  /** Optional lucide / icon key for the shell to map */
  icon?: string;
}

export interface AccountSupportCard {
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
}

export interface AccountNavChild {
  id: string;
  label: string;
  href: string;
}

export interface AccountNavItem {
  id: string;
  label: string;
  href?: string;
  children?: AccountNavChild[];
  /** Show cart count badge when set */
  showCartBadge?: boolean;
}

/** Aggregated dashboard right-rail / preview payloads. */
export interface DashboardWidgets {
  learningProgress: LearningProgress;
  orderPreviewIds: string[];
  quickLinks: DashboardQuickLink[];
}

/** Cart summary constants used when computing totals client-side. */
export interface CartSummaryConfig {
  /** GST rate as a fraction, e.g. 0.18 */
  gstRate: number;
  currencySymbol: string;
  secureCheckoutLabel: string;
  savingsBannerTemplate: string;
}
