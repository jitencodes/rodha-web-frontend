import { SiteFrame } from "@/components/layout/SiteFrame";
import { WebsiteStoreProvider } from "@/components/providers/WebsiteStoreProvider";
import {
  getAnnouncementIntervalMs,
  getPromoDialogDelayMs,
  getPurchaseToastGapMs,
  getPurchaseToastMs,
} from "@/lib/api/env";
import { getActiveAnnouncements } from "@/lib/api/modules/announcements/service";
import { getActiveCategories } from "@/lib/api/modules/categories/service";
import { getPromotionalBanner } from "@/lib/api/modules/promotional-banner/service";
import { getRecentPurchases } from "@/lib/api/modules/recent-purchases/service";
import { getAccessToken } from "@/lib/auth/server-session";

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [announcements, categories, accessToken, promo, recentPurchases] =
    await Promise.all([
      getActiveAnnouncements(),
      getActiveCategories(),
      getAccessToken(),
      getPromotionalBanner(),
      getRecentPurchases(),
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
        recentPurchases={recentPurchases}
        purchaseToastMs={getPurchaseToastMs()}
        purchaseToastGapMs={getPurchaseToastGapMs()}
      >
        {children}
      </SiteFrame>
    </WebsiteStoreProvider>
  );
}
