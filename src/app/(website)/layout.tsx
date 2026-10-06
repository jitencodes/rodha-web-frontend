import { SiteFrame } from "@/components/layout/SiteFrame";
import { WebsiteStoreProvider } from "@/components/providers/WebsiteStoreProvider";
import { getAnnouncementIntervalMs } from "@/lib/api/env";
import { getActiveAnnouncements } from "@/lib/api/modules/announcements/service";
import { getActiveCategories } from "@/lib/api/modules/categories/service";
import { getAccessToken } from "@/lib/auth/server-session";

export default async function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [announcements, categories, accessToken] = await Promise.all([
    getActiveAnnouncements(),
    getActiveCategories(),
    getAccessToken(),
  ]);

  return (
    <WebsiteStoreProvider categories={categories}>
      <SiteFrame
        announcements={announcements}
        intervalMs={getAnnouncementIntervalMs()}
        categories={categories}
        isLoggedIn={Boolean(accessToken)}
      >
        {children}
      </SiteFrame>
    </WebsiteStoreProvider>
  );
}
