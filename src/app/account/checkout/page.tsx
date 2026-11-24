import type { Metadata } from "next";
import { CheckoutPageClient } from "@/components/account/CheckoutPageClient";
import {
  isUnauthorizedError,
  redirectSessionExpired,
  withStudentAuth,
} from "@/lib/auth/require-student";
import { getCheckoutSession } from "@/lib/checkout/load-session";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Checkout — Rodha",
  description: "Complete your Rodha package purchase.",
  path: "/account/checkout",
});

export default async function AccountCheckoutPage() {
  const session = await withStudentAuth(async (accessToken) => {
    try {
      return await getCheckoutSession(accessToken);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        redirectSessionExpired("/account/checkout");
      }
      return null;
    }
  }, "/account/checkout");

  return <CheckoutPageClient session={session} />;
}
