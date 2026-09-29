import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { AccountOrder, AccountOrderStatus } from "@/lib/account/types";

type OrdersPreviewCardProps = {
  orders: AccountOrder[];
  className?: string;
};

const STATUS_CLASS: Record<AccountOrderStatus, string> = {
  active:
    "bg-[var(--account-status-active-bg)] text-[var(--account-status-active-text)]",
  completed:
    "bg-[var(--account-status-completed-bg)] text-[var(--account-status-completed-text)]",
  expired:
    "bg-[var(--account-status-expired-bg)] text-[var(--account-status-expired-text)]",
  refunded:
    "bg-[var(--account-status-refunded-bg)] text-[var(--account-status-refunded-text)]",
  pending:
    "bg-[var(--account-status-pending-bg)] text-[var(--account-status-pending-text)]",
};

export function OrdersPreviewCard({
  orders,
  className,
}: OrdersPreviewCardProps) {
  return (
    <section
      className={cn(
        "rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4 shadow-[var(--account-shadow)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-montserrat text-[15px] font-semibold text-[var(--account-text)]">
          My Orders
        </h2>
        <Link
          href="/account/orders"
          className="text-[13px] font-semibold text-[var(--account-accent)] transition-opacity hover:opacity-80"
        >
          View All →
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="mt-4 text-[13px] text-[var(--account-text-muted)]">
          No orders yet.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-[var(--account-border)]">
          {orders.map((order) => (
            <li key={order.id} className="flex items-center gap-3 py-3 first:pt-1 last:pb-0">
              <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-[var(--account-progress-track)]">
                {order.thumbnail ? (
                  <Image
                    src={order.thumbnail}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[var(--account-text)]">
                  {order.title}
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--account-text-muted)]">
                  Purchased on {order.purchasedAtLabel}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  STATUS_CLASS[order.status]
                )}
              >
                {order.statusLabel}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
