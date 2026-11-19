import type { Metadata } from "next";
import { CheckoutPageClient } from "@/components/account/CheckoutPageClient";
import { getPackageBySlug } from "@/lib/api/modules/packages/service";
import { mapCheckoutPromocodeOptions } from "@/lib/api/modules/student/cart/mapper";
import {
  getPackagePromocodes,
  getStudentCart,
} from "@/lib/api/modules/student/cart/service";
import type { CheckoutPromocodeOption } from "@/lib/api/modules/student/cart/types";
import { getCurrentDiscountRequestOrNull } from "@/lib/api/modules/student/discount-requests/service";
import type { DiscountCurrentViewModel } from "@/lib/api/modules/student/discount-requests/types";
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
    let websiteCategoryId: number | null = null;
    let promocodeOptions: CheckoutPromocodeOption[] = [];
    let discountRequest: DiscountCurrentViewModel | null = null;

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

        // The cart item has no vertical; the package detail does
        // (needed for `x-website-category-id` on promocode / discount APIs).
        if (slug) {
          const pkg = await getPackageBySlug(slug, { accessToken });
          websiteCategoryId = pkg?.websiteCategoryId ?? null;
        }

        if (first.packageId != null) {
          const packageId = first.packageId;
          const [promos, current] = await Promise.all([
            // Auth errors bubble to the outer catch (session-expired redirect);
            // anything else just hides the offers list.
            getPackagePromocodes(accessToken, packageId, websiteCategoryId).catch(
              (error: unknown) => {
                if (isUnauthorizedError(error)) throw error;
                return null;
              }
            ),
            (first.salePrice ?? 0) > 0
              ? getCurrentDiscountRequestOrNull(
                  accessToken,
                  packageId,
                  websiteCategoryId
                )
              : Promise.resolve(null),
          ]);
          promocodeOptions = mapCheckoutPromocodeOptions(promos);
          discountRequest = current;
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
      websiteCategoryId,
      promocodeOptions,
      discountRequest,
    };
  }, "/account/checkout");

  return (
    <CheckoutPageClient
      item={checkout.item}
      subtotalAmount={checkout.subtotalAmount}
      discountAmount={checkout.discountAmount}
      payableAmount={checkout.payableAmount}
      websiteCategoryId={checkout.websiteCategoryId}
      promocodeOptions={checkout.promocodeOptions}
      discountRequest={checkout.discountRequest}
    />
  );
}
