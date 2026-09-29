import type { Metadata } from "next";
import { CartPageClient } from "@/components/account/CartPageClient";
import {
  ACCOUNT_CART_COUPON,
  ACCOUNT_CART_ITEMS,
  ACCOUNT_CART_PAGE_COPY,
  ACCOUNT_CART_SUMMARY_CONFIG,
} from "@/data/account/cart";
import { ACCOUNT_RECOMMENDED_PRODUCTS } from "@/data/account/recommended";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "My Cart — Rodha",
  description: "Review your selected Rodha courses and test series before checkout.",
  path: "/account/cart",
});

export default function AccountCartPage() {
  return (
    <CartPageClient
      initialItems={ACCOUNT_CART_ITEMS}
      coupon={ACCOUNT_CART_COUPON}
      summaryConfig={ACCOUNT_CART_SUMMARY_CONFIG}
      pageCopy={ACCOUNT_CART_PAGE_COPY}
      recommended={ACCOUNT_RECOMMENDED_PRODUCTS}
    />
  );
}
