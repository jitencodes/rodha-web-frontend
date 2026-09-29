import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import {
  ACCOUNT_ORDERS,
  ACCOUNT_ORDERS_PAGE_COPY,
} from "@/data/account/orders";
import { AccountOrdersList } from "@/components/account/AccountOrdersList";

export const metadata: Metadata = buildPageMetadata({
  title: "My Orders — Rodha",
  description: "Your Rodha order history.",
  path: "/account/orders",
});

export default function AccountOrdersPage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl">
      <header className="mb-5 sm:mb-6">
        <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
          {ACCOUNT_ORDERS_PAGE_COPY.title}
        </h1>
        <p className="mt-1.5 text-body text-[var(--account-text-muted)]">
          {ACCOUNT_ORDERS_PAGE_COPY.subtitle}
        </p>
      </header>

      <AccountOrdersList orders={ACCOUNT_ORDERS} />
    </div>
  );
}
