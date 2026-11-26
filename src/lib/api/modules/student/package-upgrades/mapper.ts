import { mapCarrierAddons } from "@/lib/api/modules/addons/mapper";
import { COURSE_IMAGE_FALLBACK } from "@/lib/constants";
import type { Course } from "@/lib/types";
import type {
  AvailableUpgradeApi,
  AvailableUpgradeViewModel,
  EnrolledPackageApi,
  EnrolledPackageViewModel,
  PendingUpgradeApi,
  PendingUpgradeViewModel,
  UpgradeQuoteApi,
  UpgradeQuoteViewModel,
} from "./types";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function asId(value: unknown): number | null {
  const n =
    typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function mapAvailableUpgrade(
  item: AvailableUpgradeApi | null | undefined
): AvailableUpgradeViewModel | null {
  const id = asId(item?.id);
  const title = asString(item?.title);
  if (id == null || !title) return null;

  const listPrice = asNumber(item?.price);
  const salePrice =
    item?.salePrice != null
      ? asNumber(item.salePrice)
      : item?.discountedPrice != null
        ? asNumber(item.discountedPrice)
        : listPrice;
  const payableAmount = asNumber(item?.payableAmount);
  const isFree = item?.isFree === true || payableAmount <= 0;

  return {
    id,
    slug: asString(item?.slug),
    title,
    bannerImageUrl: asString(item?.bannerImageUrl) || COURSE_IMAGE_FALLBACK,
    listPrice,
    salePrice,
    promoDiscount: asNumber(item?.promoDiscount),
    promocodeCode: asString(item?.promocodeCode) || null,
    oldPaidCredit: asNumber(item?.oldPaidCredit),
    creditSource: asString(item?.creditSource) || null,
    payableAmount,
    isFree,
  };
}

export function mapPendingUpgrade(
  item: PendingUpgradeApi | null | undefined
): PendingUpgradeViewModel | null {
  const orderId = asId(item?.orderId);
  if (orderId == null) return null;
  const status = asString(item?.status).toUpperCase();
  if (status && status !== "PENDING") return null;
  const target = item?.targetPackage;
  return {
    orderId,
    orderNumber: asString(item?.orderNumber) || String(orderId),
    upgradeId: asId(item?.upgradeId),
    targetPackageId: asId(item?.targetPackageId ?? target?.id),
    targetTitle: asString(target?.title),
    targetSlug: asString(target?.slug),
    targetImageUrl: asString(target?.bannerImageUrl) || COURSE_IMAGE_FALLBACK,
    payableAmount: asNumber(item?.payableAmount),
    currency: asString(item?.currency) || "INR",
    canResume: item?.canResume !== false,
    canCancel: item?.canCancel !== false,
  };
}

export function mapEnrolledPackage(
  item: EnrolledPackageApi | null | undefined
): EnrolledPackageViewModel | null {
  const enrollmentId = asId(item?.enrollmentId);
  const packageId = asId(item?.id);
  const title = asString(item?.title);
  if (enrollmentId == null || packageId == null || !title) return null;

  const sale = asNumber(item?.discountedPrice ?? item?.price);
  const mrp = asNumber(item?.price);
  const originalPrice = mrp > sale ? mrp : null;
  const discountPercent =
    originalPrice != null && originalPrice > 0
      ? Math.round(((originalPrice - sale) / originalPrice) * 100)
      : 0;

  const websiteCategoryId =
    typeof item?.websiteCategoryId === "number"
      ? item.websiteCategoryId
      : typeof item?.courseEnrolled?.websiteCategoryId === "number"
        ? item.courseEnrolled.websiteCategoryId
        : typeof item?.batchCourse?.websiteCategoryId === "number"
          ? item.batchCourse.websiteCategoryId
          : null;

  const upgrades = (item?.availableUpgrades ?? [])
    .map(mapAvailableUpgrade)
    .filter((u): u is AvailableUpgradeViewModel => u != null)
    .sort((a, b) => a.payableAmount - b.payableAmount);

  return {
    enrollmentId,
    packageId,
    slug: asString(item?.slug),
    title,
    bannerImageUrl: asString(item?.bannerImageUrl) || COURSE_IMAGE_FALLBACK,
    language: asString(item?.language),
    price: sale,
    originalPrice,
    discountPercent,
    courseCount: Array.isArray(item?.courses) ? item.courses.length : 0,
    websiteCategoryId,
    status: asString(item?.status) || "ACTIVE",
    availableAddons: mapCarrierAddons(item).filter((addon) => addon.selectable),
    availableUpgrades: upgrades,
    pendingUpgrade: mapPendingUpgrade(
      item?.pendingUpgrade ?? item?.package?.pendingUpgrade
    ),
  };
}

export function mapEnrolledPackages(
  items: EnrolledPackageApi[] | null | undefined
): EnrolledPackageViewModel[] {
  if (!Array.isArray(items)) return [];
  return items
    .map(mapEnrolledPackage)
    .filter((item): item is EnrolledPackageViewModel => item != null);
}

/** Map enrolled package → Course for CourseCardV2 (Buy Courses card UI). */
export function enrolledPackageToCourse(
  pkg: EnrolledPackageViewModel
): Course {
  const hasUpgrades =
    pkg.pendingUpgrade != null || pkg.availableUpgrades.length > 0;
  return {
    id: String(pkg.packageId),
    title: pkg.title,
    slug: pkg.slug,
    language: pkg.language || undefined,
    category: "cat",
    description: pkg.title,
    shortDescription: pkg.title,
    price: pkg.price,
    originalPrice: pkg.originalPrice ?? undefined,
    discountPercent: pkg.discountPercent || undefined,
    duration: pkg.courseCount > 0 ? `${pkg.courseCount} courses` : "",
    features: [],
    highlights: [],
    enrollmentUrl: hasUpgrades
      ? `/account/packages/upgrade?enrollmentId=${pkg.enrollmentId}`
      : pkg.slug
        ? `/courses/${pkg.slug}`
        : "/account/packages",
    thumbnail: pkg.bannerImageUrl,
    image: pkg.bannerImageUrl,
    tags: [],
    detailsLabel: pkg.pendingUpgrade
      ? "Complete upgrade"
      : hasUpgrades
        ? "Available upgrades"
        : "View package",
    caourseCount: pkg.courseCount,
  };
}

export function mapUpgradeQuote(
  data: UpgradeQuoteApi | null | undefined
): UpgradeQuoteViewModel | null {
  const sourceEnrollmentId = asId(data?.sourceEnrollmentId);
  const sourcePackageId = asId(data?.sourcePackage?.id);
  const targetPackageId = asId(data?.targetPackage?.id);
  const sourceTitle = asString(data?.sourcePackage?.title);
  const targetTitle = asString(data?.targetPackage?.title);
  const sourceImageUrl = asString(data?.sourcePackage?.bannerImageUrl || COURSE_IMAGE_FALLBACK);
  const targetImageUrl = asString(data?.targetPackage?.bannerImageUrl || COURSE_IMAGE_FALLBACK);
  if (
    sourceEnrollmentId == null ||
    sourcePackageId == null ||
    targetPackageId == null ||
    !sourceTitle ||
    !targetTitle
  ) {
    return null;
  }

  const payableAmount = asNumber(data?.payableAmount);
  const isFree = data?.isFree === true || payableAmount <= 0;
  const websiteCategoryId =
    typeof data?.targetPackage?.websiteCategoryId === "number"
      ? data.targetPackage.websiteCategoryId
      : typeof data?.sourcePackage?.websiteCategoryId === "number"
        ? data.sourcePackage.websiteCategoryId
        : null;

  return {
    sourceEnrollmentId,
    sourceTitle,
    sourceImageUrl,
    sourceSlug: asString(data?.sourcePackage?.slug),
    sourcePackageId,
    targetTitle,
    targetImageUrl,
    targetSlug: asString(data?.targetPackage?.slug),
    targetPackageId,
    websiteCategoryId,
    listPrice: asNumber(data?.listPrice),
    salePrice: asNumber(data?.salePrice),
    promoCode: asString(data?.bestPromo?.code) || null,
    promoDiscount: asNumber(
      data?.promoDiscount ?? data?.bestPromo?.discountAmount
    ),
    oldPaidCredit: asNumber(data?.oldPaidCredit),
    creditSource: asString(data?.creditSource) || null,
    payableAmount,
    isFree,
    addons: mapCarrierAddons(data?.targetPackage),
  };
}
