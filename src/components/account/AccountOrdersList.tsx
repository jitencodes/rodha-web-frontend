import Image from "next/image";
import { OrderInvoiceButton } from "@/components/account/OrderInvoiceButton";
import { OrderRetryDelivery } from "@/components/account/OrderRetryDelivery";
import { ClampTooltip } from "@/components/ui/ClampTooltip";
import type { AccountOrder, AccountPaymentStatus } from "@/lib/account/types";
import { COURSE_IMAGE_FALLBACK } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import { ACCOUNT_ORDERS_PAGE_COPY } from "@/data/account/orders";

type AccountOrdersListProps = {
  orders: AccountOrder[];
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

function productLabel(order: AccountOrder): string {
  const count = order.addons?.length ?? 0;
  if (order.addonsOnly) return count === 1 ? "Add-on" : "Add-ons";
  const base = order.isUpgrade
    ? "Upgrade"
    : order.productType === "test-series"
      ? "Test series"
      : "Course";
  return count > 0 ? `${base} + ${count} add-on${count === 1 ? "" : "s"}` : base;
}

/** Add-ons bought with the order, under the product row. */
function OrderAddons({ order }: { order: AccountOrder }) {
  if (!order.addons?.length) return null;
  return (
    <ul
      aria-label="Add-ons in this order"
      className="mt-2 space-y-1 border-l-2 border-[var(--account-accent)]/40 pl-3"
    >
      {order.addons.map((addon) => (
        <li
          key={addon.id}
          className="flex items-baseline justify-between gap-3 text-caption text-[var(--account-text-muted)]"
        >
          <span className="min-w-0">
            <span className="font-medium text-[var(--account-text-secondary)]">
              {addon.name}
            </span>{" "}
            · {addon.typeLabel}
          </span>
          <span className="shrink-0">
            {addon.price > 0 ? formatPrice(addon.price) : "FREE"}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ProductCell({ order }: { order: AccountOrder }) {
  const thumbnail = order.thumbnail?.trim() || COURSE_IMAGE_FALLBACK;
  return (
    <div className="min-w-0">
      <div className="flex min-w-0 items-center gap-3">
        <span className="relative aspect-video w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--account-nav-hover)]">
          <Image
            src={thumbnail}
            alt=""
            fill
            className="object-cover"
            sizes="64px"
          />
        </span>
        <div className="min-w-0">
          <ClampTooltip
            text={order.title}
            lines={2}
            className="text-body-sm font-medium text-[var(--account-text)]"
            tooltipClassName="border-[#3a2418] bg-[#1a0f08] text-[#f5ebe3]"
          />
          <p className="truncate text-caption text-[var(--account-text-muted)]">
            {productLabel(order)}
          </p>
        </div>
      </div>
      <OrderAddons order={order} />
      {order.deliveryFailed ? <OrderRetryDelivery orderId={order.id} /> : null}
    </div>
  );
}

function InvoiceAction({ order }: { order: AccountOrder }) {
  return (
    <OrderInvoiceButton
      orderId={order.id}
      href={order.href}
      available={order.invoiceAvailable}
      generating={order.invoiceGenerating}
    />
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
                  Product
                </th>
                <th className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-[var(--account-text-muted)]">
                  Date
                </th>
                <th className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-[var(--account-text-muted)]">
                  Amount
                </th>
                <th className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-[var(--account-text-muted)]">
                  Payment Status
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
                  <td className="max-w-[340px] px-4 py-3.5">
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
                  <td className="px-4 py-3.5 text-right">
                    <InvoiceAction order={order} />
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
            <ProductCell order={order} />

            <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3">
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
                  Payment status
                </dt>
                <dd className="mt-1">
                  <StatusBadge
                    label={order.paymentStatusLabel}
                    className={PAYMENT_STATUS_CLASS[order.paymentStatus]}
                  />
                </dd>
              </div>
            </dl>
            <div className="mt-4">
              <InvoiceAction order={order} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
