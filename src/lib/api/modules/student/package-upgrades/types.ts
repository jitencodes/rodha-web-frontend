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

export interface EnrolledPackageCourseApi {
  id?: number;
  graphyProductId?: string | null;
  title?: string;
  sortOrder?: number | null;
  isActive?: boolean;
}

export interface EnrolledPackageApi {
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
  order?: unknown;
  websiteCategoryId?: number | null;
}

export interface EnrolledPackagesListApi {
  items?: EnrolledPackageApi[];
}

export interface UpgradePackageRefApi {
  id?: number;
  slug?: string;
  title?: string;
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

export interface AvailableUpgradeViewModel {
  id: number;
  slug: string;
  title: string;
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
  availableUpgrades: AvailableUpgradeViewModel[];
}

export interface UpgradeQuoteViewModel {
  sourceEnrollmentId: number;
  sourceTitle: string;
  sourceSlug: string;
  sourcePackageId: number;
  targetTitle: string;
  targetSlug: string;
  targetPackageId: number;
  websiteCategoryId: number | null;
  listPrice: number;
  salePrice: number;
  promoCode: string | null;
  promoDiscount: number;
  oldPaidCredit: number;
  creditSource: string | null;
  payableAmount: number;
  isFree: boolean;
}
