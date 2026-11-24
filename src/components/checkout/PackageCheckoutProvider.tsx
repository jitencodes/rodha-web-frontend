"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  CheckoutDrawer,
  type CheckoutDrawerProduct,
} from "@/components/checkout/CheckoutDrawer";
import { CHECKOUT_OPEN_QUERY } from "@/lib/packages/buy-now";

type PackageCheckoutContextValue = {
  packageId: number;
  openCheckout: () => void;
};

const PackageCheckoutContext = createContext<PackageCheckoutContextValue | null>(
  null
);

/** The checkout drawer of the surrounding page, when it sells this package. */
export function usePackageCheckout(
  packageId: number | null
): (() => void) | null {
  const context = useContext(PackageCheckoutContext);
  return context && context.packageId === packageId
    ? context.openCheckout
    : null;
}

type PackageCheckoutProviderProps = {
  product: CheckoutDrawerProduct;
  isLoggedIn: boolean;
  children: ReactNode;
};

/** One checkout drawer for every Buy Now button of a package page. */
export function PackageCheckoutProvider({
  product,
  isLoggedIn,
  children,
}: PackageCheckoutProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [clicked, setClicked] = useState(false);
  // Arrived from a card's Buy Now: open right away.
  const requested = searchParams.get(CHECKOUT_OPEN_QUERY) === "1";

  const close = useCallback(() => {
    setClicked(false);
    if (!requested) return;
    // Drop the param so a reload or a shared link does not reopen it.
    const params = new URLSearchParams(searchParams.toString());
    params.delete(CHECKOUT_OPEN_QUERY);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  }, [requested, searchParams, pathname]);
  const value = useMemo(
    () => ({ packageId: product.packageId, openCheckout: () => setClicked(true) }),
    [product.packageId]
  );

  return (
    <PackageCheckoutContext.Provider value={value}>
      {children}
      <CheckoutDrawer
        open={clicked || requested}
        onClose={close}
        product={product}
        isLoggedIn={isLoggedIn}
      />
    </PackageCheckoutContext.Provider>
  );
}
