import { SiteFrame } from "@/components/layout/SiteFrame";
import { WebsiteStoreProvider } from "@/components/providers/WebsiteStoreProvider";
import {
  getAnnouncementIntervalMs,
  getPromoDialogDelayMs,
  getPurchaseToastMs,
} from "@/lib/api/env";
import { getActiveAnnouncements } from "@/lib/api/modules/announcements/service";
import { getActiveCategories } from "@/lib/api/modules/categories/service";
import { getPromotionalPopup } from "@/lib/api/modules/promotional-popup/service";
import { getRecentPurchase } from "@/lib/api/modules/recent-purchases/service";
import { getAccessToken } from "@/lib/auth/server-session";

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [announcements, categories, accessToken, promo, recentPurchase] =
    await Promise.all([
      getActiveAnnouncements(),
      getActiveCategories(),
      getAccessToken(),
      getPromotionalPopup(),
      getRecentPurchase(),
    ]);

  return (
    <WebsiteStoreProvider categories={categories}>
      <SiteFrame
        announcements={announcements}
        intervalMs={getAnnouncementIntervalMs()}
        categories={categories}
        isLoggedIn={Boolean(accessToken)}
        promo={promo}
        promoDelayMs={getPromoDialogDelayMs()}
        recentPurchase={recentPurchase}
        purchaseToastMs={getPurchaseToastMs()}
      >
        {children}
      </SiteFrame>
    </WebsiteStoreProvider>
  );
}
