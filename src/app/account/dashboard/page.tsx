import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";
import {
  ACCOUNT_DASHBOARD_WIDGETS,
  ACCOUNT_WELCOME,
} from "@/data/account/dashboard";
import { WelcomeBanner } from "@/components/account/WelcomeBanner";
import { AccountSectionHeader } from "@/components/account/AccountSectionHeader";
import { AccountContinueWatchingCard } from "@/components/account/AccountContinueWatchingCard";
import { AccountRecommendedCard } from "@/components/account/AccountRecommendedCard";
import { LearningProgressCard } from "@/components/account/LearningProgressCard";
import { OrdersPreviewCard } from "@/components/account/OrdersPreviewCard";
import { QuickLinksCard } from "@/components/account/QuickLinksCard";
import { getStudentDashboard } from "@/lib/api/modules/student/dashboard/service";
import { getStudentOrders } from "@/lib/api/modules/student/orders/service";
import { getStudentProfile } from "@/lib/api/modules/student/profile/service";
import { getAccessToken } from "@/lib/auth/server-session";

export const metadata: Metadata = buildPageMetadata({
  title: "Dashboard — Rodha",
  description: "Your Rodha student dashboard.",
  path: "/account/dashboard",
});

export default async function AccountDashboardPage() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login?next=/account/dashboard");
  }

  let firstName = "there";
  let continueWatching: Awaited<
    ReturnType<typeof getStudentDashboard>
  >["continueWatching"] = [];
  let recommended: Awaited<
    ReturnType<typeof getStudentDashboard>
  >["recommended"] = [];
  let learningProgress = ACCOUNT_DASHBOARD_WIDGETS.learningProgress;
  let previewOrders: Awaited<ReturnType<typeof getStudentOrders>>["items"] =
    [];

  try {
    const [dashboard, profile, orders] = await Promise.all([
      getStudentDashboard(accessToken),
      getStudentProfile(accessToken),
      getStudentOrders(accessToken, 1, 3),
    ]);
    continueWatching = dashboard.continueWatching.slice(0, 4);
    recommended = dashboard.recommended.slice(0, 4);
    learningProgress = dashboard.learningProgress;
    previewOrders = orders.items.slice(0, 3);
    if (profile?.fullName) {
      firstName = profile.fullName.split(/\s+/)[0] || profile.fullName;
    }
  } catch {
    continueWatching = [];
    recommended = [];
  }

  return (
    <div className="mx-auto max-w-360">
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-6">
        <div className="min-w-0 space-y-7">
          <WelcomeBanner welcome={ACCOUNT_WELCOME} firstName={firstName} />

          <section aria-labelledby="continue-watching-heading">
            <AccountSectionHeader
              title="Continue Watching"
              titleId="continue-watching-heading"
              viewAllHref="/account/courses?tab=continue"
            />
            {continueWatching.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {continueWatching.map((item) => (
                  <AccountContinueWatchingCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-[var(--account-text-muted)]">
                No courses in progress yet. Buy a package to get started.
              </p>
            )}
          </section>

          <section aria-labelledby="recommended-heading">
            <AccountSectionHeader
              title="Recommended for You"
              titleId="recommended-heading"
              viewAllHref="/account/courses?tab=buy"
            />
            {recommended.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {recommended.map((product) => (
                  <AccountRecommendedCard
                    key={product.id}
                    product={product}
                    showCta={false}
                  />
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-[var(--account-text-muted)]">
                Recommendations will appear here soon.
              </p>
            )}
          </section>
        </div>

        <aside className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-4">
          <LearningProgressCard progress={learningProgress} />
          <OrdersPreviewCard orders={previewOrders} />
          <QuickLinksCard links={ACCOUNT_DASHBOARD_WIDGETS.quickLinks} />
        </aside>
      </div>
    </div>
  );
}
