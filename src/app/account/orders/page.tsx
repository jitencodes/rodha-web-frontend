import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountOrdersList } from "@/components/account/AccountOrdersList";
import { AccountPagination } from "@/components/account/AccountPagination";
import { parsePageParam } from "@/lib/account/pagination";
import { getStudentOrders } from "@/lib/api/modules/student/orders/service";
import {
  isUnauthorizedError,
  redirectSessionExpired,
  withStudentAuth,
} from "@/lib/auth/require-student";
import { buildPageMetadata } from "@/lib/seo";

const BASE_PATH = "/account/orders";
const PAGE_SIZE = 10;

export const metadata: Metadata = buildPageMetadata({
  title: "My Orders — Rodha",
  description: "Your Rodha order history and invoices.",
  path: BASE_PATH,
});

interface AccountOrdersPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AccountOrdersPage({
  searchParams,
}: AccountOrdersPageProps) {
  const page = parsePageParam((await searchParams).page);

  const orders = await withStudentAuth(async (accessToken) => {
    try {
      return await getStudentOrders(accessToken, page, PAGE_SIZE);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        redirectSessionExpired(BASE_PATH);
      }
      return null;
    }
  }, BASE_PATH);

  // Past the last page the API returns no items, which would read as "no orders".
  if (orders && orders.items.length === 0 && page > 1) {
    const lastPage = Math.max(1, orders.totalPages);
    redirect(
      lastPage > 1 && lastPage < page ? `${BASE_PATH}?page=${lastPage}` : BASE_PATH
    );
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
      {orders ? (
        <AccountOrdersList orders={orders.items} />
      ) : (
        <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-6 py-12 text-center">
          <p className="text-body text-[var(--account-text-muted)]">
            Unable to load your orders right now. Please try again.
          </p>
        </div>
      )}
      {orders && orders.totalPages > 1 ? (
        <AccountPagination
          currentPage={orders.page}
          totalPages={orders.totalPages}
          basePath={BASE_PATH}
          className="pt-8"
        />
      ) : null}
    </div>
  );
}
