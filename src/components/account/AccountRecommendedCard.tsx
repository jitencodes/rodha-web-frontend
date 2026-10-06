import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { RecommendedProduct } from "@/lib/account/types";

type AccountRecommendedCardProps = {
  product: RecommendedProduct;
  /** When false, hides the cart/buy CTA. Default true. */
  showCta?: boolean;
  /** Override CTA label (default Buy Now, or Add to Cart when `onAddToCart` is set). */
  ctaLabel?: string;
  onAddToCart?: (product: RecommendedProduct) => void;
  className?: string;
};

/** Compact product tile for dashboard recommended + cart You May Also Like. */
export function AccountRecommendedCard({
  product,
  showCta = true,
  ctaLabel,
  onAddToCart,
  className,
}: AccountRecommendedCardProps) {
  const hasDiscount = product.originalPrice > product.price;
  const label =
    ctaLabel ??
    product.ctaLabel ??
    (onAddToCart ? "Add to Cart" : "Buy Now");
  const badgeLabel =
    product.productType === "test-series" ? "Test Series" : product.tag || "Course";

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] shadow-[var(--account-shadow)]",
        className
      )}
    >
      <Link
        href={product.href}
        className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--account-border)]"
        aria-label={product.title}
      >
        <Image
          src={product.thumbnail}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 220px"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[11px] font-semibold tracking-wide text-[var(--account-accent)] uppercase">
          {badgeLabel}
        </span>

        <h3 className="line-clamp-2 font-montserrat text-[14px] leading-snug font-semibold text-[var(--account-text)]">
          <Link
            href={product.href}
            className="hover:text-[var(--account-accent)]"
          >
            {product.title}
          </Link>
        </h3>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div className="min-w-0">
            <span className="block text-base font-bold leading-none text-[var(--account-text)]">
              {formatPrice(product.price)}
            </span>
            {hasDiscount ? (
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="text-[12px] text-[var(--account-text-muted)] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-[11px] font-bold text-[var(--account-accent)]">
                  {product.discountPercent}% OFF
                </span>
              </div>
            ) : null}
          </div>

          {showCta ? (
            onAddToCart ? (
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-[var(--account-accent)] transition-opacity hover:opacity-80"
              >
                <ShoppingCart className="size-3.5" aria-hidden />
                {label}
              </button>
            ) : (
              <Link
                href={product.href}
                className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-[var(--account-accent)] transition-all hover:gap-2.5 hover:opacity-80"
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
          ) : null}
        </div>
      </div>
    </article>
  );
}
