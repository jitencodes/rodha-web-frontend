import type { Metadata } from "next";
import { CheckoutPageClient } from "@/components/account/CheckoutPageClient";
import {
  getPackagePromocodes,
  getStudentCart,
} from "@/lib/api/modules/student/cart/service";
import {
  isUnauthorizedError,
  redirectSessionExpired,
  withStudentAuth,
} from "@/lib/auth/require-student";
import { COURSE_IMAGE_FALLBACK } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Checkout — Rodha",
  description: "Complete your Rodha package purchase.",
  path: "/account/checkout",
});

export default async function AccountCheckoutPage() {
  const checkout = await withStudentAuth(async (accessToken) => {
    let item = null;
    let subtotalAmount = 0;
    let discountAmount = 0;
    let payableAmount = 0;
    let promocodeOptions: Array<{ id: string; code: string; title: string }> =
      [];

    try {
      const cart = await getStudentCart(accessToken);
      const first = cart.items?.[0];
      subtotalAmount = cart.totals?.subtotalAmount ?? 0;
      discountAmount = cart.totals?.discountAmount ?? 0;
      payableAmount = cart.totals?.payableAmount ?? 0;

      if (first) {
        const title =
          first.package?.title ||
          first.course?.title ||
          first.product?.title ||
          "Selected package";
        const slug = first.package?.slug || "";
        item = {
          cartItemId: String(first.id),
          packageId:
            typeof first.packageId === "number" ? first.packageId : null,
          title,
          thumbnail:
            first.package?.bannerImageUrl ||
            first.course?.bannerImageUrl ||
            first.product?.bannerImageUrl ||
            COURSE_IMAGE_FALLBACK,
          listPrice: first.listPrice ?? 0,
          salePrice: first.salePrice ?? 0,
          discountAmount: first.discountAmount ?? 0,
          payableAmount: first.payableAmount ?? 0,
          promocodeCode: first.promocode?.code ?? null,
          detailsHref: slug ? `/courses/${slug}` : "/courses",
        };

        if (first.packageId != null) {
          try {
            const promos = await getPackagePromocodes(
              accessToken,
              first.packageId
            );
            promocodeOptions = (promos.items ?? []).map((promo) => ({
              id: String(promo.id),
              code: promo.code || String(promo.id),
              title: promo.title || promo.code || "",
            }));
          } catch (error) {
            if (isUnauthorizedError(error)) {
              redirectSessionExpired("/account/checkout");
            }
            promocodeOptions = [];
          }
        }
      }
    } catch (error) {
      if (isUnauthorizedError(error)) {
        redirectSessionExpired("/account/checkout");
      }
      item = null;
    }

    return {
      item,
      subtotalAmount,
      discountAmount,
      payableAmount,
      promocodeOptions,
    };
  }, "/account/checkout");

  return (
    <CheckoutPageClient
      item={checkout.item}
      subtotalAmount={checkout.subtotalAmount}
      discountAmount={checkout.discountAmount}
      payableAmount={checkout.payableAmount}
      promocodeOptions={checkout.promocodeOptions}
    />
  );
}
