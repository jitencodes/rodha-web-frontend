"use client";

import { usePathname } from "next/navigation";
import { PromotionalBanner } from "@/components/layout/PromotionalBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingCounsellingCta } from "@/components/layout/FloatingCounsellingCta";
import { CounsellingModalProvider } from "@/components/layout/CounsellingModalProvider";
import type { AnnouncementViewModel } from "@/lib/api/modules/announcements/types";
import type { WebsiteCategoryViewModel } from "@/lib/api/modules/categories/types";

interface SiteFrameProps {
  announcements: AnnouncementViewModel[];
  intervalMs: number;
  categories: WebsiteCategoryViewModel[];
  children: React.ReactNode;
}

/** Public website chrome. Used only under `app/(website)` — not account routes. */
export function SiteFrame({
  announcements,
  intervalMs,
  categories,
  children,
}: SiteFrameProps) {
  const pathname = usePathname();
  const isAuth = pathname === "/login" || pathname === "/signup";

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
      <Header categories={categories} />
      <CounsellingModalProvider>
        <main>{children}</main>
        <FloatingCounsellingCta />
      </CounsellingModalProvider>
      <Footer />
    </>
  );
}
