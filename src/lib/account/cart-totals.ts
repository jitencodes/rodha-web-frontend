import type { CartItem } from "@/lib/account/types";

export type CartLineDiscount = {
  id: string;
  label: string;
  amount: number;
};

export type CartTotals = {
  itemCount: number;
  /** Sum of sale prices */
  subtotal: number;
  /** Sum of (originalPrice − price) */
  productDiscount: number;
  /** Coupon percent off subtotal when applied */
  couponDiscount: number;
  /** Subtotal after coupon */
  amountBeforeTax: number;
  gst: number;
  total: number;
  /** Product + coupon savings (for banner) */
  totalSavings: number;
  lineDiscounts: CartLineDiscount[];
};

/** INR with two fraction digits for order summary. */
export function formatCartMoney(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Compact label for expandable discount rows. */
export function cartItemDiscountLabel(title: string): string {
  const pipe = title.indexOf("|");
  if (pipe >= 0) {
    const after = title.slice(pipe + 1).trim();
    return after
      .replace(/\s*Comprehensive Batch\s*/i, " Batch")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 36);
  }
  if (title.length <= 28) return title;
  return `${title.slice(0, 28).trimEnd()}…`;
}

export function computeCartTotals(
  items: CartItem[],
  options: {
    gstRate: number;
    couponPercentOff: number;
    couponApplied: boolean;
  }
): CartTotals {
  const itemCount = items.length;
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const lineDiscounts: CartLineDiscount[] = items.map((item) => ({
    id: item.id,
    label: cartItemDiscountLabel(item.title),
    amount: Math.max(0, item.originalPrice - item.price),
  }));
  const productDiscount = lineDiscounts.reduce(
    (sum, line) => sum + line.amount,
    0
  );
  const couponDiscount =
    options.couponApplied && options.couponPercentOff > 0 && subtotal > 0
      ? (subtotal * options.couponPercentOff) / 100
      : 0;
  const amountBeforeTax = Math.max(0, subtotal - couponDiscount);
  const gst = amountBeforeTax * options.gstRate;
  const total = amountBeforeTax + gst;

  return {
    itemCount,
    subtotal,
    productDiscount,
    couponDiscount,
    amountBeforeTax,
    gst,
    total,
    totalSavings: productDiscount + couponDiscount,
    lineDiscounts: lineDiscounts.filter((line) => line.amount > 0),
  };
}
