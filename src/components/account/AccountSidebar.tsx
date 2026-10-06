"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Headphones,
  LayoutDashboard,
  Package,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCOUNT_SUPPORT_CARD } from "@/data/account/user";

type AccountSidebarProps = {
  open: boolean;
  onClose: () => void;
};

function isProductsRoute(pathname: string) {
  return (
    pathname.startsWith("/account/courses") ||
    pathname.startsWith("/account/test-series")
  );
}

export function AccountSidebar({ open, onClose }: AccountSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [productsOpen, setProductsOpen] = useState(() =>
    isProductsRoute(pathname)
  );

  useEffect(() => {
    if (isProductsRoute(pathname)) setProductsOpen(true);
  }, [pathname]);

  const dashboardActive = pathname.startsWith("/account/dashboard");
  const ordersActive = pathname.startsWith("/account/orders");
  const profileActive = pathname.startsWith("/account/profile");
  const continueActive =
    pathname.startsWith("/account/courses") &&
    (tab === null ||
      tab === "continue" ||
      tab === "continue-watching");
  const buyActive =
    pathname.startsWith("/account/courses") &&
    (tab === "buy" || tab === "buy-courses");
  const testSeriesActive = pathname.startsWith("/account/test-series");

  return (
    <aside
      id="account-sidebar"
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-[var(--account-sidebar-width)] flex-col border-r border-[var(--account-border)] bg-[var(--account-sidebar-bg)] transition-transform duration-300 ease-out",
        "lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-[var(--account-header-height)] shrink-0 items-center px-5">
        <Link
          href="/account/dashboard"
          onClick={onClose}
          className="inline-flex items-center"
        >
          <Image
            src="/assets/images/rodha-logo.webp"
            alt="Rodha"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 pb-4">
        <SidebarLink
          href="/account/dashboard"
          active={dashboardActive}
          icon={<LayoutDashboard className="size-[18px]" strokeWidth={1.75} />}
          onClick={onClose}
        >
          Dashboard
        </SidebarLink>

        <div>
          <button
            type="button"
            onClick={() => setProductsOpen((v) => !v)}
            className={cn(
              "flex w-full items-center gap-3 rounded-[var(--account-radius)] px-3 py-2.5 text-left text-[14px] font-medium transition-colors",
              isProductsRoute(pathname)
                ? "text-[var(--account-nav-active-text)]"
                : "text-[var(--account-text-secondary)] hover:bg-[var(--account-nav-hover)] hover:text-[var(--account-text)]"
            )}
            aria-expanded={productsOpen}
          >
            <Package className="size-[18px] shrink-0" strokeWidth={1.75} />
            <span className="flex-1">My Products</span>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 transition-transform",
                productsOpen && "rotate-180"
              )}
              strokeWidth={1.75}
            />
          </button>

          {productsOpen ? (
            <div className="mt-0.5 ml-3 space-y-0.5 border-l border-[var(--account-border)] pl-3">
              <SidebarSubLink
                href="/account/courses?tab=continue"
                active={continueActive}
                onClick={onClose}
              >
                Continue Watching
              </SidebarSubLink>
              <SidebarSubLink
                href="/account/courses?tab=buy"
                active={buyActive}
                onClick={onClose}
              >
                Buy Courses
              </SidebarSubLink>
              {/* Test Series hidden from My Products (Graphy integration). */}
              {false && (
                <SidebarSubLink
                  href="/account/test-series"
                  active={testSeriesActive}
                  onClick={onClose}
                >
                  Test Series
                </SidebarSubLink>
              )}
            </div>
          ) : null}
        </div>

        {/* My Cart replaced by single-package Checkout (not shown in nav). */}

        <SidebarLink
          href="/account/orders"
          active={ordersActive}
          icon={<ShoppingBag className="size-[18px]" strokeWidth={1.75} />}
          onClick={onClose}
        >
          My Orders
        </SidebarLink>

        <SidebarLink
          href="/account/profile"
          active={profileActive}
          icon={<UserRound className="size-[18px]" strokeWidth={1.75} />}
          trailing={
            <ChevronRight className="size-4 opacity-60" strokeWidth={1.75} />
          }
          onClick={onClose}
        >
          My Profile
        </SidebarLink>
      </nav>

      <div className="shrink-0 p-3">
        <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-help-bg)] p-4">
          <div className="flex items-center gap-2">
            <Headphones
              className="size-5 text-[var(--account-accent)]"
              strokeWidth={1.75}
            />
            <p className="text-[14px] font-semibold text-[var(--account-text)]">
              {ACCOUNT_SUPPORT_CARD.title}
            </p>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-[var(--account-text-muted)]">
            {ACCOUNT_SUPPORT_CARD.description}
          </p>
          <a
            href={ACCOUNT_SUPPORT_CARD.href}
            className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--account-accent)] transition-opacity hover:opacity-80"
          >
            {ACCOUNT_SUPPORT_CARD.ctaLabel}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  active,
  icon,
  badge,
  trailing,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  icon: ReactNode;
  badge?: number;
  trailing?: ReactNode;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-[var(--account-radius)] px-3 py-2.5 text-[14px] font-medium transition-colors",
        active
          ? "bg-[var(--account-nav-active-bg)] text-[var(--account-nav-active-text)]"
          : "text-[var(--account-text-secondary)] hover:bg-[var(--account-nav-hover)] hover:text-[var(--account-text)]"
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex-1">{children}</span>
      {badge !== undefined ? (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--account-badge-bg)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--account-badge-text)]">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
      {trailing}
    </Link>
  );
}

function SidebarSubLink({
  href,
  active,
  onClick,
  children,
}: {
  href: string;
  active: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "block rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
        active
          ? "text-[var(--account-nav-active-text)]"
          : "text-[var(--account-text-muted)] hover:text-[var(--account-text)]"
      )}
    >
      {children}
    </Link>
  );
}
