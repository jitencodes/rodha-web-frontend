"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  packageBuyNowHref,
  packageViewCourseHref,
} from "@/lib/packages/buy-now";

type PackagePurchaseActionsProps = {
  packageId: number | null;
  slug: string;
  isSelfEnrolled: boolean;
  isLoggedIn: boolean;
  className?: string;
  fullWidth?: boolean;
};

/** Buy Now / View Course CTA wired to single-package checkout or account courses. */
export function PackagePurchaseActions({
  packageId,
  slug,
  isSelfEnrolled,
  isLoggedIn,
  className,
  fullWidth = true,
}: PackagePurchaseActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  if (isSelfEnrolled) {
    return (
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
        View Details
      </Link>
    );
  }

  const buyHref = packageBuyNowHref(packageId, slug);

  async function handleBuy() {
    if (pending) return;
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(buyHref)}`);
      return;
    }
    setPending(true);
    // Full navigation so the checkout buy Route Handler runs with cookies.
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
