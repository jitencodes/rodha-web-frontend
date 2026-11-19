import type {
  CheckoutPromocodeOption,
  PackagePromocodesDataApi,
} from "@/lib/api/modules/student/cart/types";

function rupees(value: number): string {
  return `₹${value.toLocaleString("en-IN")}`;
}

/** "20% off up to ₹3,000" / "20% off" / "₹500 off". */
export function promocodeOfferLabel(promo: {
  discountType?: string | null;
  discountValue?: number | null;
  maxDiscountValue?: number | null;
}): string {
  const value = promo.discountValue ?? 0;
  if (value <= 0) return "";
  if (promo.discountType === "FLAT") return `${rupees(value)} off`;
  const cap = promo.maxDiscountValue ?? 0;
  return cap > 0 ? `${value}% off up to ${rupees(cap)}` : `${value}% off`;
}

/**
 * Listed codes for the checkout page. `suggestedPromocodeId` is flagged as the
 * best offer; best first, then by estimated saving. Codes the API marks as not
 * applicable are left out.
 */
export function mapCheckoutPromocodeOptions(
  data: PackagePromocodesDataApi | null | undefined
): CheckoutPromocodeOption[] {
  const suggested =
    data?.suggestedPromocodeId != null ? String(data.suggestedPromocodeId) : null;

  return (data?.items ?? [])
    .filter((promo) => promo.applicable !== false && Boolean(promo.code || promo.id))
    .map((promo) => {
      const id = String(promo.id);
      return {
        id,
        code: promo.code || id,
        offerLabel: promocodeOfferLabel(promo) || promo.title || "",
        description: promo.description?.trim() || "",
        estimatedDiscount: promo.estimatedDiscount ?? 0,
        validTill: promo.validTill ?? null,
        autoApply: promo.autoApply !== false,
        isBest: suggested === id,
      };
    })
    .sort(
      (a, b) =>
        Number(b.isBest) - Number(a.isBest) ||
        b.estimatedDiscount - a.estimatedDiscount
    );
}
