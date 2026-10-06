import type { Metadata } from "next";
import { AccountOrdersList } from "@/components/account/AccountOrdersList";
import { getStudentOrders } from "@/lib/api/modules/student/orders/service";
import {
  isUnauthorizedError,
  redirectSessionExpired,
  withStudentAuth,
} from "@/lib/auth/require-student";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "My Orders — Rodha",
  description: "Your Rodha order history and invoices.",
  path: "/account/orders",
});

export default async function AccountOrdersPage() {
  const orders = await withStudentAuth(async (accessToken) => {
    try {
      const result = await getStudentOrders(accessToken, 1, 50);
      return result.items;
    } catch (error) {
      if (isUnauthorizedError(error)) {
        redirectSessionExpired("/account/orders");
      }
      return [];
    }
  }, "/account/orders");

  return (
    <div className="mx-auto w-full max-w-6xl">
      <header className="mb-6">
        <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
          My Orders
        </h1>
        <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
          Track purchases, payment status, and invoices.
        </p>
      </header>
      <AccountOrdersList orders={orders} />
    </div>
  );
}
