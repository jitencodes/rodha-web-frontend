"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CartItemCard } from "@/components/account/CartItemCard";
import { CartOrderSummary } from "@/components/account/CartOrderSummary";
import { AccountRecommendedCard } from "@/components/account/AccountRecommendedCard";
import { computeCartTotals } from "@/lib/account/cart-totals";
import type {
  CartCoupon,
  CartItem,
  CartSummaryConfig,
  RecommendedProduct,
} from "@/lib/account/types";

type CartPageClientProps = {
  initialItems: CartItem[];
  coupon: CartCoupon;
  summaryConfig: CartSummaryConfig;
  pageCopy: {
    title: string;
    subtitle: string;
    emptyMessage: string;
    continueCtaPrefix: string;
    recommendedTitle: string;
    recommendedSubtitle: string;
  };
  recommended: RecommendedProduct[];
};

function recommendedToCartItem(product: RecommendedProduct): CartItem {
  return {
    id: `cart-from-${product.id}`,
    productId: product.id,
    title: product.title,
    productType: product.productType,
    thumbnail: product.thumbnail,
    price: product.price,
    originalPrice: product.originalPrice,
    discountPercent: product.discountPercent,
    meta: {},
    detailsHref: product.href,
  };
}

export function CartPageClient({
  initialItems,
  coupon,
  summaryConfig,
  pageCopy,
  recommended,
}: CartPageClientProps) {
  const [items, setItems] = useState(initialItems);
  const [couponApplied, setCouponApplied] = useState(coupon.isApplied);
  const [couponInput, setCouponInput] = useState(
    coupon.isApplied ? coupon.code : ""
  );
  const [couponError, setCouponError] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const totals = computeCartTotals(items, {
    gstRate: summaryConfig.gstRate,
    couponPercentOff: coupon.percentOff,
    couponApplied,
  });

  const cartProductIds = new Set(items.map((item) => item.productId));
  const recommendedVisible = recommended.filter(
    (product) => !cartProductIds.has(product.id)
  );

  function handleRemove(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleApplyCoupon() {
    const code = couponInput.trim();
    if (!code) return;
    if (code.toUpperCase() === coupon.code.toUpperCase()) {
      setCouponApplied(true);
      setCouponInput(coupon.code);
      setCouponError(null);
      return;
    }
    setCouponError("Invalid coupon code. Try RODHA10.");
  }

  function handleRemoveCoupon() {
    setCouponApplied(false);
    setCouponInput("");
    setCouponError(null);
  }

  function handleAddRecommended(product: RecommendedProduct) {
    setItems((prev) => {
      if (prev.some((item) => item.productId === product.id)) return prev;
      return [...prev, recommendedToCartItem(product)];
    });
  }

  function scrollRecommended(direction: "prev" | "next") {
    const el = railRef.current;
    if (!el) return;
    const delta = Math.min(320, el.clientWidth * 0.8);
    el.scrollBy({
      left: direction === "next" ? delta : -delta,
      behavior: "smooth",
    });
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <nav aria-label="Breadcrumb" className="mb-3">
        <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-[var(--account-text-muted)]">
          <li>
            <Link
              href="/account/dashboard"
              className="hover:text-[var(--account-accent)]"
            >
              Home
            </Link>
          </li>
          <li aria-hidden className="opacity-60">
            ›
          </li>
          <li className="font-medium text-[var(--account-text-secondary)]">
            My Cart
          </li>
        </ol>
      </nav>

      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
            {pageCopy.title}
          </h1>
          <span className="rounded-full bg-[var(--account-border)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--account-text-secondary)]">
            {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
          </span>
        </div>
        <p className="mt-1.5 text-body-sm text-[var(--account-text-muted)] sm:text-body">
          {pageCopy.subtitle}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="min-w-0 space-y-8">
          {items.length === 0 ? (
            <div className="rounded-[var(--account-radius)] border border-dashed border-[var(--account-border-strong)] bg-[var(--account-surface)] px-5 py-10 text-center">
              <p className="text-[var(--account-text-secondary)]">
                {pageCopy.emptyMessage}
              </p>
              <Link
                href="/account/courses?tab=buy"
                className="mt-4 inline-flex rounded-lg bg-[var(--account-accent)] px-4 py-2.5 text-[14px] font-semibold text-white hover:opacity-90"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id}>
                  <CartItemCard item={item} onRemove={handleRemove} />
                </li>
              ))}
            </ul>
          )}

          {recommendedVisible.length > 0 ? (
            <section aria-labelledby="cart-recommended-heading">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h2
                    id="cart-recommended-heading"
                    className="font-montserrat text-lg font-bold text-[var(--account-text)]"
                  >
                    {pageCopy.recommendedTitle}
                  </h2>
                  <p className="mt-0.5 text-[13px] text-[var(--account-text-muted)]">
                    {pageCopy.recommendedSubtitle}
                  </p>
                </div>
                <div className="hidden shrink-0 gap-2 sm:flex">
                  <button
                    type="button"
                    aria-label="Previous recommendations"
                    onClick={() => scrollRecommended("prev")}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--account-border-strong)] bg-[var(--account-surface)] text-[var(--account-text-secondary)] transition-colors hover:border-[var(--account-accent)] hover:text-[var(--account-accent)]"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next recommendations"
                    onClick={() => scrollRecommended("next")}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--account-border-strong)] bg-[var(--account-surface)] text-[var(--account-text-secondary)] transition-colors hover:border-[var(--account-accent)] hover:text-[var(--account-accent)]"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              <div
                ref={railRef}
                className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 scroll-smooth [scrollbar-width:thin]"
              >
                {recommendedVisible.map((product) => (
                  <div
                    key={product.id}
                    className="w-[220px] shrink-0 sm:w-[240px]"
                  >
                    <AccountRecommendedCard
                      product={product}
                      onAddToCart={handleAddRecommended}
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <CartOrderSummary
          totals={totals}
          config={summaryConfig}
          coupon={coupon}
          couponApplied={couponApplied}
          couponInput={couponInput}
          couponError={couponError}
          onCouponInputChange={(value) => {
            setCouponInput(value);
            if (couponError) setCouponError(null);
          }}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          continueCtaPrefix={pageCopy.continueCtaPrefix}
        />
      </div>
    </div>
  );
}
