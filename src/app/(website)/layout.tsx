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
  // #region agent log
  const layoutStartedAt = Date.now();
  fetch("http://127.0.0.1:7331/ingest/539f300b-4ba6-49bb-83d3-9fd84c4ec31d", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "227c1e",
    },
    body: JSON.stringify({
      sessionId: "227c1e",
      runId: "pre-fix",
      hypothesisId: "B",
      location: "website/layout.tsx:entry",
      message: "WebsiteLayout render start",
      data: { layoutStartedAt },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  const [announcements, categories, accessToken, promo, recentPurchase] =
    await Promise.all([
      getActiveAnnouncements(),
      getActiveCategories(),
      getAccessToken(),
      getPromotionalPopup(),
      getRecentPurchase(),
    ]);

  // #region agent log
  fetch("http://127.0.0.1:7331/ingest/539f300b-4ba6-49bb-83d3-9fd84c4ec31d", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "227c1e",
    },
    body: JSON.stringify({
      sessionId: "227c1e",
      runId: "pre-fix",
      hypothesisId: "A",
      location: "website/layout.tsx:after-fetch",
      message: "WebsiteLayout fetches done",
      data: {
        durationMs: Date.now() - layoutStartedAt,
        hasPromo: promo != null,
        announcementCount: announcements.length,
        categoryCount: categories.length,
        isLoggedIn: Boolean(accessToken),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

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
