"use client";

import Link from "next/link";
import { useState } from "react";
import { usePackageCheckout } from "@/components/checkout/PackageCheckoutProvider";
import { cn } from "@/lib/utils";
import { packageBuyNowHref, packageViewCourseHref } from "@/lib/packages/buy-now";

type PackagePurchaseActionsProps = {
  packageId: number | null;
  slug: string;
  isSelfEnrolled: boolean;
  /** Enrolled student can still buy add-ons for this package. */
  hasAddons?: boolean;
  className?: string;
  fullWidth?: boolean;
};

/**
 * Buy Now / View Course CTA. Inside `PackageCheckoutProvider` Buy Now opens the
 * checkout drawer; elsewhere it goes to the package page with the drawer open.
 */
export function PackagePurchaseActions({
  packageId,
  slug,
  isSelfEnrolled,
  hasAddons = false,
  className,
  fullWidth = true,
}: PackagePurchaseActionsProps) {
  const [pending, setPending] = useState(false);
  const openCheckout = usePackageCheckout(packageId);

  if (isSelfEnrolled) {
    return (
      <>
        <Link
          href={packageViewCourseHref(packageId)}
          className={cn(
            "btn-primary inline-flex items-center justify-center",
            fullWidth && "w-full",
            className
          )}
        >
          View Course
        </Link>
        {hasAddons && openCheckout ? (
          <button
            type="button"
            onClick={openCheckout}
            className={cn(
              "mt-2.5 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-orange-500 bg-white px-4 text-body-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50",
              fullWidth && "w-full"
            )}
          >
            Buy add-ons
          </button>
        ) : null}
      </>
    );
  }

  if (packageId == null) {
    return (
      <Link
        href={`/courses/${slug}`}
        className={cn(
          "btn-primary inline-flex items-center justify-center",
          fullWidth && "w-full",
          className
        )}
      >
        View
      </Link>
    );
  }

  const buyHref = packageBuyNowHref(packageId, slug);

  function handleBuy() {
    if (pending) return;
    if (openCheckout) {
      openCheckout();
      return;
    }
    setPending(true);
    // Full navigation: without a slug this is a Route Handler.
    window.location.assign(buyHref);
  }

  return (
    <button
      type="button"
      onClick={handleBuy}
      disabled={pending}
      className={cn(
        "btn-primary inline-flex items-center justify-center disabled:opacity-60",
        fullWidth && "w-full",
        className
      )}
    >
      {pending ? "Starting checkout…" : "Buy Now"}
    </button>
  );
}
