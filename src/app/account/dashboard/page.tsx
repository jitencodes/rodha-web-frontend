import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import {
  ACCOUNT_DASHBOARD_WIDGETS,
  ACCOUNT_WELCOME,
  ACCOUNT_WELCOME_FIRST_NAME,
} from "@/data/account/dashboard";
import { ACCOUNT_DASHBOARD_CONTINUE_WATCHING } from "@/data/account/continue-watching";
import { ACCOUNT_DASHBOARD_RECOMMENDED } from "@/data/account/recommended";
import { getAccountOrdersByIds } from "@/data/account/orders";
import { WelcomeBanner } from "@/components/account/WelcomeBanner";
import { AccountSectionHeader } from "@/components/account/AccountSectionHeader";
import { AccountContinueWatchingCard } from "@/components/account/AccountContinueWatchingCard";
import { AccountRecommendedCard } from "@/components/account/AccountRecommendedCard";
import { LearningProgressCard } from "@/components/account/LearningProgressCard";
import { OrdersPreviewCard } from "@/components/account/OrdersPreviewCard";
import { QuickLinksCard } from "@/components/account/QuickLinksCard";

export const metadata: Metadata = buildPageMetadata({
  title: "Dashboard — Rodha",
  description: "Your Rodha student dashboard.",
  path: "/account/dashboard",
});

export default function AccountDashboardPage() {
  const previewOrders = getAccountOrdersByIds(
    ACCOUNT_DASHBOARD_WIDGETS.orderPreviewIds
  );

  return (
    <div className="mx-auto max-w-360">
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-6">
        <div className="min-w-0 space-y-7">
          <WelcomeBanner
            welcome={ACCOUNT_WELCOME}
            firstName={ACCOUNT_WELCOME_FIRST_NAME}
          />

          <section aria-labelledby="continue-watching-heading">
            <AccountSectionHeader
              title="Continue Watching"
              titleId="continue-watching-heading"
              viewAllHref="/account/courses?tab=continue"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {ACCOUNT_DASHBOARD_CONTINUE_WATCHING.map((item) => (
                <AccountContinueWatchingCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section aria-labelledby="recommended-heading">
            <AccountSectionHeader
              title="Recommended for You"
              titleId="recommended-heading"
              viewAllHref="/account/courses?tab=buy"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {ACCOUNT_DASHBOARD_RECOMMENDED.map((product) => (
                <AccountRecommendedCard
                  key={product.id}
                  product={product}
                  showCta={false}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-4">
          <LearningProgressCard
            progress={ACCOUNT_DASHBOARD_WIDGETS.learningProgress}
          />
          <OrdersPreviewCard orders={previewOrders} />
          <QuickLinksCard links={ACCOUNT_DASHBOARD_WIDGETS.quickLinks} />
        </aside>
      </div>
    </div>
  );
}
