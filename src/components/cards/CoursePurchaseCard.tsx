import { AppImage } from "@/components/ui/AppImage";
import { Badge } from "@/components/ui/Badge";
import { PackagePromocodeOffers } from "@/components/cards/PackagePromocodeOffers";
import { PackagePurchaseActions } from "@/components/cards/PackagePurchaseActions";
import { DiscountRequestCta } from "@/components/account/discount-requests/DiscountRequestCta";
import type { DiscountStudentInfo } from "@/components/account/discount-requests/DiscountRequestDialog";
import type { CheckoutPromocodeOption } from "@/lib/api/modules/student/cart/types";
import type { DiscountCurrentViewModel } from "@/lib/api/modules/student/discount-requests/types";
import { COURSE_IMAGE_FALLBACK } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import type { Course } from "@/lib/types";

/** Request Discount CTA data for a package (API-backed course pages only). */
export interface CoursePurchaseDiscountProps {
  websiteCategoryId: number | null;
  current: DiscountCurrentViewModel | null;
  student: DiscountStudentInfo | null;
  loginHref: string;
}

interface CoursePurchaseCardProps {
  course: Course;
  categoryLabel: string;
  className?: string;
  packageId?: number | null;
  isSelfEnrolled?: boolean;
  isLoggedIn?: boolean;
  discount?: CoursePurchaseDiscountProps;
  /** Listed package promocodes (logged-in); apply happens on checkout. */
  promocodeOffers?: CheckoutPromocodeOption[];
}

/** Compact sticky purchase card — image, essentials, price, Buy Now. */
export function CoursePurchaseCard({
  course,
  categoryLabel,
  className,
  packageId = null,
  isSelfEnrolled = false,
  isLoggedIn = false,
  discount,
  promocodeOffers = [],
}: CoursePurchaseCardProps) {
  const posterSrc =
    course.thumbnail ||
    course.image ||
    COURSE_IMAGE_FALLBACK;
  const enrollHref = course.externalLink || course.enrollmentUrl || "#";
  const usePackageCheckout = packageId != null || isSelfEnrolled;
  const appliedCode = course.appliedCouponCode?.trim() || "";
  const bestOffer =
    promocodeOffers.find((offer) => offer.isBest) ?? promocodeOffers[0] ?? null;
  const chipCode = appliedCode || bestOffer?.code || "";
  const isBestChip =
    Boolean(bestOffer) &&
    (!appliedCode ||
      appliedCode.toUpperCase() === bestOffer!.code.toUpperCase());
  const showCouponChip = Boolean(chipCode) && !isSelfEnrolled;

  return (
    <aside
      className={cn(
        "flex flex-col rounded-[6px] border border-section-beige bg-white shadow-sm shadow-orange-500/10",
        className
      )}
    >
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[#FFF8F1]">
        <AppImage
          src={posterSrc}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 340px"
        />
      </div>

      <div className="flex flex-col p-4 md:p-5">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="default"
            className="rounded-full border-neutral-800 bg-neutral-800 text-[10px] uppercase tracking-wide text-white"
          >
            {categoryLabel}
          </Badge>
          {course.language && (
            <Badge
              variant="outline"
              className="rounded-full border-section-beige! bg-transparent! text-[10px] uppercase tracking-wide text-neutral-600!"
            >
              {course.language}
            </Badge>
          )}
        </div>

        <h2 className="mt-2.5 line-clamp-2 text-h4 font-semibold leading-snug text-neutral-900">
          {course.title}
        </h2>

        {(course.shortDescription || course.description) && (
          <p className="mt-1.5 line-clamp-2 text-body-sm text-neutral-600">
            {course.shortDescription || course.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-neutral-500">
          {course.duration && <span>{course.duration}</span>}
          {course.mode && (
            <>
              {course.duration && <span aria-hidden>·</span>}
              <span>{course.mode}</span>
            </>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="flex flex-wrap items-end gap-2">
            <span className="text-[1.5rem] font-bold leading-none text-orange-500">
              {course.price === 0 ? "FREE" : formatPrice(course.price)}
            </span>
            {course.originalPrice != null &&
              course.originalPrice > course.price && (
                <span className="text-body-sm text-neutral-400 line-through">
                  {formatPrice(course.originalPrice)}
                </span>
              )}
          </div>
          {showCouponChip ? (
            <div className="flex max-w-[50%] flex-col items-end gap-1">
              {isBestChip ? (
                <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">
                  Best offer
                </span>
              ) : (
                <span className="rounded-full bg-orange-50 px-1.5 py-0.5 text-[9px] font-semibold text-orange-600">
                  Applied
                </span>
              )}
              <div className="flex w-fit max-w-full items-center justify-center rounded-sm border border-dashed border-orange-400 bg-white/70 px-2 py-1">
                <span className="truncate text-center text-[10px] font-bold tracking-wide text-orange-600">
                  {chipCode}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        {promocodeOffers.length > 0 && !isSelfEnrolled ? (
          <PackagePromocodeOffers
            className="mt-3"
            offers={promocodeOffers}
            appliedCode={appliedCode || null}
          />
        ) : null}

        {usePackageCheckout ? (
          <div className="mt-4">
            <PackagePurchaseActions
              packageId={packageId}
              slug={course.slug}
              isSelfEnrolled={isSelfEnrolled}
              isLoggedIn={isLoggedIn}
              className="btn-primary-premium premium-border-glow glow-accent-orange h-11 rounded-md bg-orange-500 px-6 text-body font-semibold text-white hover:bg-orange-600"
            />
            {discount &&
            packageId != null &&
            !isSelfEnrolled &&
            course.price > 0 ? (
              <DiscountRequestCta
                className="mt-2.5"
                packageId={packageId}
                packageTitle={course.title}
                websiteCategoryId={discount.websiteCategoryId}
                isLoggedIn={isLoggedIn}
                current={discount.current}
                student={discount.student}
                loginHref={discount.loginHref}
                variant="website"
              />
            ) : null}
          </div>
        ) : (
          <a
            href={enrollHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-premium premium-border-glow glow-accent-orange mt-4 inline-flex h-11 w-full shrink-0 items-center justify-center rounded-md bg-orange-500 px-6 text-body font-semibold text-white hover:bg-orange-600"
          >
            {course.price === 0 ? "Start Free" : "Buy Now"}
          </a>
        )}
      </div>
    </aside>
  );
}
