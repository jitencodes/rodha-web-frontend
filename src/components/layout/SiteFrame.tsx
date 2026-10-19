"use client";

import { usePathname } from "next/navigation";
import { PromotionalBanner } from "@/components/layout/PromotionalBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCounsellingCta } from "@/components/layout/FloatingCounsellingCta";
import { CounsellingModalProvider } from "@/components/layout/CounsellingModalProvider";
import { PromoDialog } from "@/components/layout/PromoDialog";
import { PurchaseToast } from "@/components/layout/PurchaseToast";
import type { PromotionalPopupViewModel } from "@/lib/api/modules/promotional-popup/types";
import type { RecentPurchaseViewModel } from "@/lib/api/modules/recent-purchases/types";
import type { AnnouncementViewModel } from "@/lib/api/modules/announcements/types";
import type { WebsiteCategoryViewModel } from "@/lib/api/modules/categories/types";

interface SiteFrameProps {
  announcements: AnnouncementViewModel[];
  intervalMs: number;
  categories: WebsiteCategoryViewModel[];
  isLoggedIn?: boolean;
  promo: PromotionalPopupViewModel | null;
  promoDelayMs: number;
  recentPurchase: RecentPurchaseViewModel | null;
  purchaseToastMs: number;
  children: React.ReactNode;
}

/** Public website chrome. Used only under `app/(website)` — not account routes. */
export function SiteFrame({
  announcements,
  intervalMs,
  categories,
  isLoggedIn = false,
  promo,
  promoDelayMs,
  recentPurchase,
  purchaseToastMs,
  children,
}: SiteFrameProps) {
  const pathname = usePathname();
  const isAuth =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  if (isAuth) {
    return (
      <div className="min-h-dvh bg-[#FFF5ED] text-neutral-900 lg:h-dvh lg:overflow-hidden">
        {children}
      </div>
    );
  }

  return (
    <>
      <PromotionalBanner
        announcements={announcements}
        intervalMs={intervalMs}
      />
      <Header categories={categories} isLoggedIn={isLoggedIn} />
      <CounsellingModalProvider>
        <main>{children}</main>
        <FloatingCounsellingCta />
      </CounsellingModalProvider>
      <Footer />
      <PromoDialog
        popup={promo}
        delayMs={promoDelayMs}
        isLoggedIn={isLoggedIn}
        categories={categories}
      />
      <PurchaseToast purchase={recentPurchase} durationMs={purchaseToastMs} />
    </>
  );
}
