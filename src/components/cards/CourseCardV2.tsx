"use client";

import type { SyntheticEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ClampTooltip } from "@/components/ui/ClampTooltip";
import { COURSE_IMAGE_FALLBACK, getCategoryPath } from "@/lib/constants";
import type { Course } from "@/lib/types";

interface CourseCardV2Props {
  course: Course;
  className?: string;
  /** Card body destination (defaults to category nested path or externalLink). */
  href?: string;
  /** CTA destination; defaults to `href` when omitted. */
  ctaHref?: string;
  /** CTA link label; defaults to `course.detailsLabel` or "View Details". */
  ctaLabel?: string;
  /** Smaller price / coupon / CTA text below 2xl (dense account grids). */
  compactPricing?: boolean;
}

const PRICING_TEXT = {
  price: "text-[1.4rem]",
  originalPrice: "text-body-sm",
  discount: "text-caption",
  couponLabel: "text-caption",
  couponCode: "text-[10px]",
  cta: "text-body-sm",
};

const COMPACT_PRICING_TEXT: typeof PRICING_TEXT = {
  price: "text-[1.1rem] 2xl:text-[1.4rem]",
  originalPrice: "text-[12px] 2xl:text-body-sm",
  discount: "text-[10px] 2xl:text-caption",
  couponLabel: "text-[10px] 2xl:text-caption",
  couponCode: "text-[9px] 2xl:text-[10px]",
  cta: "text-[12px] 2xl:text-body-sm",
};

function stopCarouselDrag(event: SyntheticEvent) {
  event.stopPropagation();
}

/** Light-theme course card for MBA category page (homepage-aligned). */
export function CourseCardV2({
  course,
  className,
  href,
  ctaHref,
  ctaLabel,
  compactPricing = false,
}: CourseCardV2Props) {
  const hasDiscount =
    course.originalPrice != null && course.originalPrice > course.price;
  const discountPercent =
    typeof course.discountPercent === "number" && course.discountPercent > 0
      ? Math.round(course.discountPercent)
      : hasDiscount
        ? Math.round(
            ((course.originalPrice! - course.price) / course.originalPrice!) *
              100
          )
        : 0;

  const detailsHref = `${getCategoryPath(course.category)}/courses/${course.slug}`;
  const courseHref = href || course.externalLink || detailsHref;
  const actionHref = ctaHref || courseHref;
  const isExternalCard = Boolean(!href && course.externalLink);
  const isExternalCta = Boolean(ctaHref?.startsWith("http"));
  const ctaNeedsDocumentNavigation = actionHref.startsWith("/api/");
  const posterSrc =
    course.thumbnail ||
    course.facultyImage ||
    COURSE_IMAGE_FALLBACK;
  const label = ctaLabel || course.detailsLabel || "View Details";
  const ctaIsDistinct = actionHref !== courseHref;
  const pricing = compactPricing ? COMPACT_PRICING_TEXT : PRICING_TEXT;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[6px] border border-[#FFEAD6] bg-[#FFF3E8] hover-shine hover:shadow-sm hover:shadow-orange-500/20",
        className
      )}
    >
      <Link
        href={courseHref}
        target={isExternalCard ? "_blank" : undefined}
        rel={isExternalCard ? "noopener noreferrer" : undefined}
        className="absolute inset-0 z-0"
        aria-label={course.title}
        onPointerDown={stopCarouselDrag}
      />

      <div className="relative z-[1] flex h-full flex-col pointer-events-none">
        <div className="relative aspect-video w-full overflow-hidden bg-[#FFF3E8]">
          <Image
            src={posterSrc}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {course.badge && (
            <div className="absolute left-3 top-3 z-10">
              <Badge
                variant="primary"
                size="sm"
                className="uppercase tracking-wide text-[10px] font-bold"
              >
                {course.badge}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6 justify-between">
          <h3 className="pointer-events-auto text-h4 font-montserrat font-medium leading-tight text-neutral-900">
            <ClampTooltip
              text={course.title}
              lines={2}
              className="text-h4 font-montserrat font-medium leading-tight text-neutral-900"
              tooltipClassName="border-[#3a2418] bg-[#1a0f08] text-[#f5ebe3]"
            />
          </h3>

          {(course.shortDescription || course.description) && (
            <p className="mt-2 line-clamp-2 text-body-sm text-neutral-600">
              {course.shortDescription || course.description}
            </p>
          )}
          <div className="mt-2 text-caption leading-relaxed text-neutral-500 flex items-center gap-1 justify-between capitalize">
            {course.caourseCount != null ? (
              <span>{course.caourseCount} Courses</span>
            ) : (
              <span />
            )}
            {course.language ? <span>{course.language}</span> : null}
          </div>
          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <div className="min-w-0">
              <span className={cn("block font-bold text-neutral-900", pricing.price, "leading-none")}>
                {course.price === 0 ? "FREE" : formatPrice(course.price)}
              </span>
              {hasDiscount && discountPercent > 0 ? (
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className={cn("text-neutral-400 line-through", pricing.originalPrice)}>
                    {formatPrice(course.originalPrice!)}
                  </span>
                  <span className={cn("font-bold text-orange-500", pricing.discount)}>
                    {discountPercent}% OFF
                  </span>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col items-end gap-2">
              {course.appliedCouponCode?.trim() ? (
                <div className="flex flex-col items-end gap-1">
                  <span className={cn("font-bold text-orange-500", pricing.couponLabel)}>
                    Eligible Coupon
                  </span>
                  <div className="flex w-fit items-center justify-center rounded-sm border border-dashed border-orange-400 bg-white/70 px-2 py-1">
                    <span className={cn("truncate text-center font-bold tracking-wide text-orange-600", pricing.couponCode)}>
                      {course.appliedCouponCode.trim()}
                    </span>
                  </div>
                </div>
              ) : null}
            {ctaIsDistinct ? (
              ctaNeedsDocumentNavigation ? (
                <a
                  href={actionHref}
                  data-carousel-ignore
                  onPointerDown={stopCarouselDrag}
                  onClick={stopCarouselDrag}
                  className={cn("pointer-events-auto relative z-10 inline-flex shrink-0 items-center gap-1.5 font-semibold text-orange-500 transition-all duration-300 hover:gap-2.5 hover:text-orange-500/80", pricing.cta)}
                >
                  {label}
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.25 4.25a.75.75 0 010 1.08l-4.25 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              ) : (
                <Link
                  href={actionHref}
                  target={isExternalCta ? "_blank" : undefined}
                  rel={isExternalCta ? "noopener noreferrer" : undefined}
                  data-carousel-ignore
                  onPointerDown={stopCarouselDrag}
                  onClick={stopCarouselDrag}
                  className={cn("pointer-events-auto relative z-10 inline-flex shrink-0 items-center gap-1.5 font-semibold text-orange-500 transition-all duration-300 hover:gap-2.5 hover:text-orange-500/80", pricing.cta)}
                >
                  {label}
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.25 4.25a.75.75 0 010 1.08l-4.25 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              )
            ) : (
              <span className={cn("inline-flex shrink-0 items-center gap-1.5 font-semibold text-orange-500 transition-all duration-300 group-hover:gap-2.5 group-hover:text-orange-500/80", pricing.cta)}>
                {label}
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.25 4.25a.75.75 0 010 1.08l-4.25 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
