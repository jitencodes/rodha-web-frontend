import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountOrdersList } from "@/components/account/AccountOrdersList";
import { getStudentOrders } from "@/lib/api/modules/student/orders/service";
import { getAccessToken } from "@/lib/auth/server-session";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "My Orders — Rodha",
  description: "Your Rodha order history and invoices.",
  path: "/account/orders",
});

export default async function AccountOrdersPage() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login?next=/account/orders");
  }

  let orders: Awaited<ReturnType<typeof getStudentOrders>>["items"] = [];
  try {
    const result = await getStudentOrders(accessToken, 1, 50);
    orders = result.items;
  } catch {
    orders = [];
  }

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
