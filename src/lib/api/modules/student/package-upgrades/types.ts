import type {
  AddonCarrierApi,
  AddonViewModel,
} from "@/lib/api/modules/addons/types";

/** Student package upgrade — shapes from Rodha CR package upgrade Postman. */

export interface UpgradeNamedRefApi {
  id?: number;
  name?: string;
  isActive?: boolean;
  sortOrder?: number;
  websiteCategoryId?: number | null;
}

export interface AvailableUpgradeApi {
  id?: number;
  slug?: string;
  title?: string;
  bannerImageUrl?: string | null;
  price?: number | null;
  discountedPrice?: number | null;
  salePrice?: number | null;
  promoDiscount?: number | null;
  promocodeId?: number | null;
  promocodeCode?: string | null;
  oldPaidCredit?: number | null;
  creditSource?: string | null;
  payableAmount?: number | null;
  isFree?: boolean;
  sortOrder?: number | null;
}

/** Upgrade checkout left PENDING (Razorpay closed before paying). */
export interface PendingUpgradeApi {
  upgradeId?: number;
  orderId?: number;
  orderNumber?: string;
  status?: string;
  sourceEnrollmentId?: number;
  sourcePackageId?: number;
  targetPackageId?: number;
  targetPackage?: {
    id?: number;
    slug?: string;
    title?: string;
    bannerImageUrl?: string | null;
  } | null;
  payableAmount?: number | null;
  currency?: string;
  razorpayOrderId?: string | null;
  canResume?: boolean;
  canCancel?: boolean;
}

export interface EnrolledPackageCourseApi {
  id?: number;
  graphyProductId?: string | null;
  title?: string;
  sortOrder?: number | null;
  isActive?: boolean;
}

export interface EnrolledPackageApi extends AddonCarrierApi {
  enrollmentId?: number;
  status?: string;
  assignedAt?: string | null;
  isSelfEnrolled?: boolean;
  id?: number;
  slug?: string;
  title?: string;
  bannerImageUrl?: string | null;
  subtitle?: string | null;
  duration?: string | null;
  mode?: string | null;
  level?: string | null;
  language?: string | null;
  price?: number | null;
  discountedPrice?: number | null;
  averageRating?: number | null;
  ratingCount?: number | null;
  isActive?: boolean;
  bookType?: string | null;
  batchStarts?: string | null;
  batchCourseId?: number | null;
  batchId?: number | null;
  batchCourse?: UpgradeNamedRefApi | null;
  courseEnrolled?: UpgradeNamedRefApi | null;
  batch?: UpgradeNamedRefApi | null;
  batchEnrolled?: UpgradeNamedRefApi | null;
  courses?: EnrolledPackageCourseApi[];
  availableUpgrades?: AvailableUpgradeApi[];
  /** Set while an upgrade is unpaid; `availableUpgrades` is then `[]`. */
  pendingUpgrade?: PendingUpgradeApi | null;
  /** `/enrollments` nests package fields here. */
  package?: { pendingUpgrade?: PendingUpgradeApi | null } | null;
  order?: unknown;
  websiteCategoryId?: number | null;
}

export interface EnrolledPackagesListApi {
  items?: EnrolledPackageApi[];
}

export interface UpgradePackageRefApi extends AddonCarrierApi {
  id?: number;
  slug?: string;
  title?: string;
  bannerImageUrl?: string | null;
  graphyProductId?: string | null;
  websiteCategoryId?: number | null;
  price?: number | null;
  discountedPrice?: number | null;
  isActive?: boolean;
}

export interface UpgradeBestPromoApi {
  id?: number;
  code?: string | null;
  discountAmount?: number | null;
}

export interface UpgradeQuoteApi {
  sourceEnrollmentId?: number;
  sourcePackage?: UpgradePackageRefApi | null;
  targetPackage?: UpgradePackageRefApi | null;
  salePrice?: number | null;
  listPrice?: number | null;
  bestPromo?: UpgradeBestPromoApi | null;
  promoDiscount?: number | null;
  oldPaidCredit?: number | null;
  creditSource?: string | null;
  upgradePayableAmount?: number | null;
  /** Excludes add-ons. */
  payableAmount?: number | null;
  isFree?: boolean;
}

export interface UpgradeCheckoutResponseApi {
  mode?: "free" | "razorpay" | string;
  orderId?: number;
  orderNumber?: string;
  upgradeId?: number;
  status?: string;
  payableAmount?: number;
  currency?: string;
  quote?: UpgradeQuoteApi | null;
  keyId?: string;
  razorpayOrderId?: string;
  amountPaise?: number;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

export interface UpgradeVerifyResponseApi {
  orderId?: number;
  orderNumber?: string;
  status?: string;
  payableAmount?: number;
  invoice?: {
    id?: number;
    invoiceNumber?: string;
    pdfUrl?: string | null;
  } | null;
  upgradeId?: number;
  upgradeStatus?: string;
}

export interface UpgradeResumeResponseApi extends UpgradeCheckoutResponseApi {
  targetPackageTitle?: string;
}

export interface UpgradeCancelResponseApi {
  orderId?: number;
  orderNumber?: string;
  orderStatus?: string;
  upgradeId?: number;
  upgradeStatus?: string;
}

export interface PendingUpgradeViewModel {
  orderId: number;
  orderNumber: string;
  upgradeId: number | null;
  targetPackageId: number | null;
  /** Empty when the API omits `targetPackage` (flat `/packages` shape). */
  targetTitle: string;
  targetSlug: string;
  targetImageUrl: string;
  payableAmount: number;
  currency: string;
  canResume: boolean;
  canCancel: boolean;
}

export interface AvailableUpgradeViewModel {
  id: number;
  slug: string;
  title: string;
  bannerImageUrl: string;
  listPrice: number;
  salePrice: number;
  promoDiscount: number;
  promocodeCode: string | null;
  oldPaidCredit: number;
  creditSource: string | null;
  payableAmount: number;
  isFree: boolean;
}

export interface EnrolledPackageViewModel {
  enrollmentId: number;
  packageId: number;
  slug: string;
  title: string;
  bannerImageUrl: string;
  language: string;
  price: number;
  originalPrice: number | null;
  discountPercent: number;
  courseCount: number;
  websiteCategoryId: number | null;
  status: string;
  /** Add-ons the student can still buy for this package. */
  availableAddons: AddonViewModel[];
  availableUpgrades: AvailableUpgradeViewModel[];
  /** Unpaid upgrade to resume or cancel; options stay hidden until it is cancelled. */
  pendingUpgrade: PendingUpgradeViewModel | null;
}

export interface UpgradeQuoteViewModel {
  sourceEnrollmentId: number;
  sourceTitle: string;
  sourceImageUrl: string;
  sourceSlug: string;
  sourcePackageId: number;
  targetTitle: string;
  targetImageUrl: string;
  targetSlug: string;
  targetPackageId: number;
  websiteCategoryId: number | null;
  listPrice: number;
  salePrice: number;
  promoCode: string | null;
  promoDiscount: number;
  oldPaidCredit: number;
  creditSource: string | null;
  /** Upgrade amount only; selected add-ons are charged on top. */
  payableAmount: number;
  isFree: boolean;
  /** Add-ons of the target package. */
  addons: AddonViewModel[];
}
