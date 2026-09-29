import type { RecommendedProduct } from "@/lib/account/types";

const CAT = "/assets/images/courses/cat";
const MOCKS = "/assets/images/category/cat/mocks";

/**
 * Dashboard "Recommended for You" + cart "You May Also Like".
 */
export const ACCOUNT_RECOMMENDED_PRODUCTS: RecommendedProduct[] = [
  {
    id: "rec-r4-english",
    title: "CAT 2026 | R4 (Complete English) Comprehensive Batch",
    tag: "MBA",
    thumbnail: `${CAT}/cat-2026-r4-complete-english-comprehensive-batch.jpg`,
    price: 24999,
    originalPrice: 40000,
    discountPercent: 38,
    href: "/account/courses?tab=buy",
    productType: "course",
    ctaLabel: "Add to Cart",
  },
  {
    id: "rec-lrdi-booster",
    title: "CAT 2026 LRDI Booster Course",
    tag: "MBA",
    thumbnail: `${CAT}/high-intensity-lrdi-course-for-cat-2026-r6.jpg`,
    price: 8999,
    originalPrice: 12000,
    discountPercent: 25,
    href: "/account/courses?tab=buy",
    productType: "course",
    ctaLabel: "Add to Cart",
  },
  {
    id: "rec-qa-1000",
    title: "CAT 2026 QA 1000 Questions",
    tag: "MBA",
    thumbnail: `${MOCKS}/cat mocks-3.png`,
    price: 6999,
    originalPrice: 10000,
    discountPercent: 30,
    href: "/account/test-series",
    productType: "test-series",
    ctaLabel: "Add to Cart",
  },
  {
    id: "rec-varc-1000",
    title: "CAT 2026 VARC 1000 Questions",
    tag: "MBA",
    thumbnail: `${MOCKS}/cat sectionals-2.png`,
    price: 6999,
    originalPrice: 10000,
    discountPercent: 30,
    href: "/account/test-series",
    productType: "test-series",
    ctaLabel: "Add to Cart",
  },
  {
    id: "rec-r7-hinglish",
    title: "CAT 2026 | R7 (Hinglish) Comprehensive Batch",
    tag: "MBA",
    thumbnail: `${CAT}/cat-2026-r7-hinglish-comprehensive-batch.jpg`,
    price: 22999,
    originalPrice: 36000,
    discountPercent: 36,
    href: "/account/courses?tab=buy",
    productType: "course",
    ctaLabel: "Add to Cart",
  },
  {
    id: "rec-quant-booster",
    title: "CAT 2026 Quant Booster Course",
    tag: "MBA",
    thumbnail: `${CAT}/high-intensity-quants-batch-for-cat-2026-r6.jpg`,
    price: 8999,
    originalPrice: 12000,
    discountPercent: 25,
    href: "/account/courses?tab=buy",
    productType: "course",
    ctaLabel: "Add to Cart",
  },
  {
    id: "rec-omets-package",
    title: "CAT + OMETs Mock Package",
    tag: "MBA",
    thumbnail: `${CAT}/rodha-cat-mocks-and-omets-package.png`,
    price: 6999,
    originalPrice: 9999,
    discountPercent: 30,
    href: "/account/test-series",
    productType: "test-series",
    ctaLabel: "Add to Cart",
  },
  {
    id: "rec-accelerator",
    title: "Rodha CAT Accelerator — Practice Engine",
    tag: "MBA",
    thumbnail: `${CAT}/rodha-cat-accelerator-the-ultimate-practice-engine.jpg`,
    price: 9999,
    originalPrice: 15000,
    discountPercent: 33,
    href: "/account/courses?tab=buy",
    productType: "course",
    ctaLabel: "Add to Cart",
  },
];

/** First four items mirror the dashboard recommended row in the UI reference. */
export const ACCOUNT_DASHBOARD_RECOMMENDED = ACCOUNT_RECOMMENDED_PRODUCTS.slice(
  0,
  4
);
