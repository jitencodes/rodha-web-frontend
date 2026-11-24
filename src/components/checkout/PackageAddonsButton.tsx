"use client";

import { useCallback, useState } from "react";
import { PackagePlus } from "lucide-react";
import {
  CheckoutDrawer,
  type CheckoutDrawerProduct,
} from "@/components/checkout/CheckoutDrawer";

/** "Buy add-ons" for a package the student already owns. */
export function PackageAddonsButton({
  product,
  count,
}: {
  product: CheckoutDrawerProduct;
  count: number;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--account-radius)] border border-[var(--account-accent)] px-4 text-[13px] font-semibold text-[var(--account-accent)] transition-colors hover:bg-[var(--account-nav-active-bg)]"
      >
        <PackagePlus className="size-4" aria-hidden />
        Buy add-ons ({count})
      </button>
      <CheckoutDrawer open={open} onClose={close} product={product} isLoggedIn />
    </>
  );
}
