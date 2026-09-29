import Image from "next/image";
import Link from "next/link";
import { MoreVertical, ShoppingCart } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import type { RecommendedProduct } from "@/lib/account/types";

type AccountRecommendedCardProps = {
  product: RecommendedProduct;
  /** When false, hides the cart CTA (dashboard recommended row). Default true. */
  showCta?: boolean;
  onAddToCart?: (product: RecommendedProduct) => void;
  className?: string;
};

/** Compact product tile for dashboard recommended + cart You May Also Like. */
export function AccountRecommendedCard({
  product,
  showCta = true,
  onAddToCart,
  className,
}: AccountRecommendedCardProps) {
  const cta = product.ctaLabel ?? "Add to Cart";
  const badgeLabel = showCta
    ? product.productType === "test-series"
      ? "Test Series"
      : "Course"
    : product.tag;

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
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-semibold tracking-wide text-[var(--account-accent)] uppercase">
            {badgeLabel}
          </span>
          {!showCta ? (
            <button
              type="button"
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[var(--account-text-muted)] hover:bg-[var(--account-nav-hover)] hover:text-[var(--account-text)]"
              aria-label="More options"
            >
              <MoreVertical className="size-4" strokeWidth={1.75} />
            </button>
          ) : null}
        </div>

        <h3 className="line-clamp-2 font-montserrat text-[14px] leading-snug font-semibold text-[var(--account-text)]">
          <Link
            href={product.href}
            className="hover:text-[var(--account-accent)]"
          >
            {product.title}
          </Link>
        </h3>

        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
          <span className="text-base font-bold text-[var(--account-text)]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price ? (
            <>
              <span className="text-[12px] text-[var(--account-text-muted)] line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-[11px] font-bold text-[var(--account-accent)]">
                {product.discountPercent}% OFF
              </span>
            </>
          ) : null}
        </div>

        {showCta ? (
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--account-accent)] px-3 py-2 text-[13px] font-semibold text-[var(--account-accent)] transition-colors hover:bg-[var(--account-nav-active-bg)]"
          >
            <ShoppingCart className="size-3.5" aria-hidden />
            {cta}
          </button>
        ) : null}
      </div>
    </article>
  );
}
