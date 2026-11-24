import { mapAddons, mapCarrierAddons } from "@/lib/api/modules/addons/mapper";
import type { StudentCartApi } from "@/lib/api/modules/student/cart/types";
import type { CheckoutCart } from "@/lib/checkout/types";
import { COURSE_IMAGE_FALLBACK } from "@/lib/constants";

/** Single-package cart → checkout view model. */
export function mapCheckoutCart(
  cart: StudentCartApi | null | undefined
): CheckoutCart {
  const first = cart?.items?.[0] ?? null;
  const totals = {
    subtotalAmount: cart?.totals?.subtotalAmount ?? 0,
    discountAmount: cart?.totals?.discountAmount ?? 0,
    payableAmount: cart?.totals?.payableAmount ?? 0,
  };
  if (!first) {
    return { product: null, line: null, totals, addons: [], selectedAddonIds: [] };
  }

  const catalogue = mapCarrierAddons(first.package ?? first.product);
  const selected = mapAddons(first.selectedAddons);
  const known = new Set(catalogue.map((addon) => addon.id));
  // A selected add-on that left the catalogue stays visible so it can be removed.
  const orphans = selected
    .filter((addon) => !known.has(addon.id))
    .map((addon) => ({ ...addon, selectable: false }));

  const slug = first.package?.slug || first.product?.slug || first.course?.slug || "";
  const addonAmount =
    first.addonAmount ?? selected.reduce((sum, addon) => sum + addon.price, 0);
  const payableAmount = first.payableAmount ?? totals.payableAmount;

  return {
    product: {
      packageId: typeof first.packageId === "number" ? first.packageId : null,
      slug,
      title:
        first.package?.title ||
        first.course?.title ||
        first.product?.title ||
        "Selected package",
      thumbnail:
        first.package?.bannerImageUrl ||
        first.course?.bannerImageUrl ||
        first.product?.bannerImageUrl ||
        COURSE_IMAGE_FALLBACK,
      detailsHref: slug ? `/courses/${slug}` : "/courses",
    },
    line: {
      cartItemId: String(first.id),
      listPrice: first.listPrice ?? 0,
      salePrice: first.salePrice ?? 0,
      discountAmount: first.discountAmount ?? 0,
      packagePayableAmount:
        first.packagePayableAmount ?? Math.max(0, payableAmount - addonAmount),
      addonAmount,
      payableAmount,
      promocodeCode: first.promocode?.code ?? null,
    },
    totals,
    addons: [...catalogue, ...orphans],
    selectedAddonIds: selected.map((addon) => addon.id),
  };
}
