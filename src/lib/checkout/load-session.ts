import { getCurrentUser } from "@/lib/api/modules/auth/service";
import type { PackageDetailViewModel } from "@/lib/api/modules/packages/mapper";
import { getPackageBySlug } from "@/lib/api/modules/packages/service";
import { mapCheckoutPromocodeOptions } from "@/lib/api/modules/student/cart/mapper";
import {
  addPackageToCart,
  clearStudentCart,
  getPackagePromocodes,
  getStudentCart,
  setCartItemPromocode,
} from "@/lib/api/modules/student/cart/service";
import type { StudentCartApi } from "@/lib/api/modules/student/cart/types";
import { getCurrentDiscountRequestOrNull } from "@/lib/api/modules/student/discount-requests/service";
import { ApiError } from "@/lib/api/types";
import { getSessionUser } from "@/lib/auth/server-session";
import { isUnauthorizedError } from "@/lib/auth/session-expired";
import { mapCheckoutCart } from "@/lib/checkout/map-cart";
import type {
  CheckoutCart,
  CheckoutLine,
  CheckoutSession,
} from "@/lib/checkout/types";
import { COURSE_IMAGE_FALLBACK } from "@/lib/constants";

type LoadOptions = {
  /** Package being viewed, when known (also used when the cart has no line). */
  pkg?: PackageDetailViewModel | null;
  packageOwned?: boolean;
};

/** Cart view for a package that has no cart line yet (owned package). */
function cartFromPackage(
  cart: CheckoutCart,
  pkg: PackageDetailViewModel
): CheckoutCart {
  return {
    ...cart,
    product: {
      packageId: pkg.packageId,
      slug: pkg.course.slug,
      title: pkg.course.title,
      thumbnail: pkg.course.thumbnail || COURSE_IMAGE_FALLBACK,
      detailsHref: `/courses/${pkg.course.slug}`,
    },
    addons: pkg.addons,
  };
}

/** A line priced at 0 that only carries add-ons = package already owned. */
function isOwnedLine(cart: CheckoutCart): boolean {
  return Boolean(
    cart.line &&
      cart.line.listPrice === 0 &&
      cart.line.salePrice === 0 &&
      cart.line.addonAmount > 0
  );
}

/** Cart + offers + discount state + student for the checkout page / sidebar. */
export async function loadCheckoutSession(
  accessToken: string,
  apiCart: StudentCartApi,
  options: LoadOptions = {}
): Promise<CheckoutSession> {
  let cart = mapCheckoutCart(apiCart);
  // The cart item has no vertical; the package detail does.
  const pkg =
    options.pkg ??
    (cart.product?.slug
      ? await getPackageBySlug(cart.product.slug, { accessToken })
      : null);

  if (!cart.line && pkg) cart = cartFromPackage(cart, pkg);
  else if (cart.addons.length === 0 && pkg) {
    cart = { ...cart, addons: pkg.addons };
  }

  const packageOwned =
    options.packageOwned ?? (pkg ? pkg.isSelfEnrolled : isOwnedLine(cart));
  const websiteCategoryId = pkg?.websiteCategoryId ?? null;
  const packageId = cart.product?.packageId ?? null;
  const sellsPackage = packageId != null && cart.line != null && !packageOwned;

  const [promos, discountRequest, user] = await Promise.all([
    sellsPackage
      ? // Auth errors bubble up (session expired); anything else hides the offers.
        getPackagePromocodes(accessToken, packageId, websiteCategoryId).catch(
          (error: unknown) => {
            if (isUnauthorizedError(error)) throw error;
            return null;
          }
        )
      : Promise.resolve(null),
    sellsPackage && (cart.line?.salePrice ?? 0) > 0
      ? getCurrentDiscountRequestOrNull(accessToken, packageId, websiteCategoryId)
      : Promise.resolve(null),
    getCurrentUser(accessToken).catch((error: unknown) => {
      if (isUnauthorizedError(error)) throw error;
      return getSessionUser();
    }),
  ]);

  return {
    ...cart,
    packageOwned,
    websiteCategoryId,
    promocodeOptions: mapCheckoutPromocodeOptions(promos),
    discountRequest,
    user,
  };
}

/** Current cart; falls back to the package itself when it has no line. */
export async function getCheckoutSession(
  accessToken: string,
  target?: { packageId: number; slug: string }
): Promise<CheckoutSession> {
  const [cart, pkg] = await Promise.all([
    getStudentCart(accessToken),
    target?.slug
      ? getPackageBySlug(target.slug, { accessToken })
      : Promise.resolve(null),
  ]);
  return loadCheckoutSession(accessToken, cart, { pkg });
}

/**
 * Put one package in the cart (single-package checkout) and load the session.
 * Always re-adds the line so live prices and the best promocode apply again;
 * still-valid add-ons, and a better coupon the student typed, are carried over.
 */
export async function prepareCheckoutSession(
  accessToken: string,
  target: { packageId: number; slug: string; addonIds?: number[] }
): Promise<CheckoutSession> {
  const [current, pkg] = await Promise.all([
    getStudentCart(accessToken),
    target.slug
      ? getPackageBySlug(target.slug, { accessToken })
      : Promise.resolve(null),
  ]);
  const categoryId = pkg?.websiteCategoryId ?? null;
  const currentLine = current.items?.[0];
  const currentCart = mapCheckoutCart(current);

  const samePackage =
    (current.items?.length ?? 0) === 1 &&
    currentLine?.packageId === target.packageId;

  const wanted = new Set<number>(target.addonIds ?? []);
  if (samePackage) {
    currentCart.selectedAddonIds.forEach((id) => wanted.add(id));
  }
  const sellable = new Set(
    (pkg?.addons ?? currentCart.addons)
      .filter((addon) => addon.selectable)
      .map((addon) => addon.id)
  );
  const addonIds = [...wanted].filter((id) => sellable.has(id));

  let cart = current;
  if ((current.items?.length ?? 0) > 0) {
    cart = await clearStudentCart(accessToken, categoryId);
  }

  // An owned package needs at least one add-on to be added to the cart.
  if (pkg?.isSelfEnrolled && addonIds.length === 0) {
    return loadCheckoutSession(accessToken, cart ?? {}, { pkg, packageOwned: true });
  }

  try {
    cart = await addPackageToCart(
      accessToken,
      target.packageId,
      categoryId,
      addonIds
    );
  } catch (error) {
    if (!(error instanceof ApiError) || isUnauthorizedError(error)) throw error;
    if (addonIds.length > 0 && (error.status === 400 || error.status === 409)) {
      // An add-on was withdrawn or bought meanwhile; keep the package itself.
      return prepareWithoutAddons(accessToken, target, pkg, categoryId);
    }
    if (error.status === 409) {
      return resolveConflict(accessToken, target, pkg, error);
    }
    throw error;
  }

  if (samePackage && currentCart.line) {
    cart = await keepBetterCoupon(accessToken, cart, currentCart.line, categoryId);
  }
  return loadCheckoutSession(accessToken, cart, { pkg });
}

/** Re-apply the previous code when it saves more than the auto-applied one. */
async function keepBetterCoupon(
  accessToken: string,
  cart: StudentCartApi,
  previous: CheckoutLine,
  categoryId: number | null
): Promise<StudentCartApi> {
  const line = mapCheckoutCart(cart).line;
  if (
    !line ||
    !previous.promocodeCode ||
    previous.promocodeCode === line.promocodeCode ||
    previous.discountAmount <= line.discountAmount
  ) {
    return cart;
  }
  try {
    return await setCartItemPromocode(
      accessToken,
      line.cartItemId,
      { code: previous.promocodeCode },
      categoryId
    );
  } catch (error) {
    if (isUnauthorizedError(error)) throw error;
    return cart;
  }
}

async function prepareWithoutAddons(
  accessToken: string,
  target: { packageId: number; slug: string },
  pkg: PackageDetailViewModel | null,
  categoryId: number | null
): Promise<CheckoutSession> {
  if (pkg?.isSelfEnrolled) {
    return loadCheckoutSession(accessToken, {}, { pkg, packageOwned: true });
  }
  try {
    const cart = await addPackageToCart(accessToken, target.packageId, categoryId);
    return loadCheckoutSession(accessToken, cart, { pkg });
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return resolveConflict(accessToken, target, pkg, error);
    }
    throw error;
  }
}

/** 409 on add: already in the cart (use that line) or already in the account. */
async function resolveConflict(
  accessToken: string,
  target: { packageId: number },
  pkg: PackageDetailViewModel | null,
  error: ApiError
): Promise<CheckoutSession> {
  const cart = await getStudentCart(accessToken);
  if (cart.items?.some((item) => item.packageId === target.packageId)) {
    return loadCheckoutSession(accessToken, cart, { pkg });
  }
  if (!pkg) throw error;
  return loadCheckoutSession(accessToken, {}, { pkg, packageOwned: true });
}
