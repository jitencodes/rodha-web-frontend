import Image from "next/image";
import { Eye } from "lucide-react";
import type {
  AccountOrder,
  AccountOrderStatus,
  AccountPaymentStatus,
} from "@/lib/account/types";
import { cn, formatPrice } from "@/lib/utils";
import { ACCOUNT_ORDERS_PAGE_COPY } from "@/data/account/orders";

type AccountOrdersListProps = {
  orders: AccountOrder[];
};

const ORDER_STATUS_CLASS: Record<AccountOrderStatus, string> = {
  active: "bg-emerald-500/15 text-emerald-600",
  completed: "bg-sky-500/15 text-sky-600",
  expired: "bg-[var(--account-nav-hover)] text-[var(--account-text-muted)]",
  refunded: "bg-orange-500/15 text-orange-600",
  pending: "bg-amber-500/15 text-amber-600",
};

const PAYMENT_STATUS_CLASS: Record<AccountPaymentStatus, string> = {
  paid: "bg-emerald-500/15 text-emerald-600",
  pending: "bg-amber-500/15 text-amber-600",
  failed: "bg-red-500/15 text-red-600",
  refunded: "bg-orange-500/15 text-orange-600",
};

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center truncate rounded-full px-2.5 py-0.5 text-caption font-medium",
        className
      )}
    >
      {label}
    </span>
  );
}

function ProductCell({ order }: { order: AccountOrder }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {order.thumbnail ? (
        <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-[var(--account-nav-hover)]">
          <Image
            src={order.thumbnail}
            alt=""
            fill
            className="object-cover"
            sizes="40px"
          />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="truncate text-body-sm font-medium text-[var(--account-text)]">
          {order.title}
        </p>
        <p className="truncate text-caption text-[var(--account-text-muted)] capitalize">
          {order.productType === "test-series" ? "Test series" : "Course"}
        </p>
      </div>
    </div>
  );
}

function ViewAction() {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--account-border-strong)] bg-[var(--account-surface)] px-3 py-1.5 text-caption font-medium text-[var(--account-text-secondary)]",
        "transition-colors hover:border-[var(--account-accent)] hover:text-[var(--account-accent)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--account-accent)]/40"
      )}
    >
      <Eye className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden />
      {ACCOUNT_ORDERS_PAGE_COPY.viewLabel}
    </button>
  );
}

export function AccountOrdersList({ orders }: AccountOrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-5 py-10 text-center shadow-[var(--account-shadow)]">
        <p className="text-body text-[var(--account-text-muted)]">
          {ACCOUNT_ORDERS_PAGE_COPY.empty}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] shadow-[var(--account-shadow)] md:block">
        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--account-border)] bg-[var(--account-nav-hover)]/60">
                <th className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-[var(--account-text-muted)]">
                  Order ID
                </th>
                <th className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-[var(--account-text-muted)]">
                  Product
                </th>
                <th className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-[var(--account-text-muted)]">
                  Date
                </th>
                <th className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-[var(--account-text-muted)]">
                  Amount
                </th>
                <th className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-[var(--account-text-muted)]">
                  Payment
                </th>
                <th className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-[var(--account-text-muted)]">
                  Status
                </th>
                <th className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-[var(--account-text-muted)]">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[var(--account-border)] last:border-b-0"
                >
                  <td className="whitespace-nowrap px-4 py-3.5 font-mono text-caption text-[var(--account-text-secondary)]">
                    {order.orderNumber}
                  </td>
                  <td className="max-w-[240px] px-4 py-3.5">
                    <ProductCell order={order} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-body-sm text-[var(--account-text-secondary)]">
                    {order.purchasedAtLabel}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-body-sm font-medium text-[var(--account-text)]">
                    {formatPrice(order.amount)}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge
                      label={order.paymentStatusLabel}
                      className={PAYMENT_STATUS_CLASS[order.paymentStatus]}
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge
                      label={order.statusLabel}
                      className={ORDER_STATUS_CLASS[order.status]}
                    />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <ViewAction />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards — no page-level horizontal overflow */}
      <ul className="flex flex-col gap-3 md:hidden">
        {orders.map((order) => (
          <li
            key={order.id}
            className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4 shadow-[var(--account-shadow)]"
          >
            <div className="flex items-start justify-between gap-3">
              <ProductCell order={order} />
              <ViewAction />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3">
              <div className="min-w-0">
                <dt className="text-caption text-[var(--account-text-muted)]">
                  Order ID
                </dt>
                <dd className="mt-0.5 truncate font-mono text-caption text-[var(--account-text-secondary)]">
                  {order.orderNumber}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-caption text-[var(--account-text-muted)]">
                  Date
                </dt>
                <dd className="mt-0.5 text-body-sm text-[var(--account-text-secondary)]">
                  {order.purchasedAtLabel}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-caption text-[var(--account-text-muted)]">
                  Amount
                </dt>
                <dd className="mt-0.5 text-body-sm font-medium text-[var(--account-text)]">
                  {formatPrice(order.amount)}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-caption text-[var(--account-text-muted)]">
                  Payment
                </dt>
                <dd className="mt-1">
                  <StatusBadge
                    label={order.paymentStatusLabel}
                    className={PAYMENT_STATUS_CLASS[order.paymentStatus]}
                  />
                </dd>
              </div>
              <div className="min-w-0 col-span-2">
                <dt className="text-caption text-[var(--account-text-muted)]">
                  Order status
                </dt>
                <dd className="mt-1">
                  <StatusBadge
                    label={order.statusLabel}
                    className={ORDER_STATUS_CLASS[order.status]}
                  />
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
