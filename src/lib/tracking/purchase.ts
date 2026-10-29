/** GTM / dataLayer purchase ecommerce payload after confirmed payment. */

export type PurchaseEcommerce = {
  transaction_id: string;
  value: number;
  currency: string;
};

const PENDING_KEY = "rodha.purchase.pending";
const FIRED_PREFIX = "rodha.purchase.fired:";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function normalizePurchase(
  input: Partial<PurchaseEcommerce> | null | undefined
): PurchaseEcommerce | null {
  if (!input) return null;
  const transaction_id =
    typeof input.transaction_id === "string"
      ? input.transaction_id.trim()
      : "";
  const value = Number(input.value);
  const currency =
    typeof input.currency === "string" && input.currency.trim()
      ? input.currency.trim().toUpperCase()
      : "INR";
  if (!transaction_id || !Number.isFinite(value) || value < 0) return null;
  return { transaction_id, value, currency };
}

/** Persist purchase details across the redirect to the success page. */
export function storePendingPurchase(
  input: Partial<PurchaseEcommerce>
): void {
  if (!isBrowser()) return;
  const purchase = normalizePurchase(input);
  if (!purchase) return;
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(purchase));
  } catch {
    // ignore quota / private mode
  }
}

function readPendingPurchase(): PurchaseEcommerce | null {
  if (!isBrowser()) return null;
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    return normalizePurchase(JSON.parse(raw) as Partial<PurchaseEcommerce>);
  } catch {
    return null;
  }
}

function clearPendingPurchase(): void {
  if (!isBrowser()) return;
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    // ignore
  }
}

function wasPurchaseFired(transactionId: string): boolean {
  if (!isBrowser()) return true;
  try {
    return sessionStorage.getItem(`${FIRED_PREFIX}${transactionId}`) === "1";
  } catch {
    return false;
  }
}

function markPurchaseFired(transactionId: string): void {
  if (!isBrowser()) return;
  try {
    sessionStorage.setItem(`${FIRED_PREFIX}${transactionId}`, "1");
  } catch {
    // ignore
  }
}

/** Push GA4-style ecommerce purchase to GTM dataLayer. */
export function pushPurchaseDataLayer(purchase: PurchaseEcommerce): void {
  if (!isBrowser()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: purchase.transaction_id,
      value: purchase.value,
      currency: purchase.currency,
    },
  });
}

/**
 * Read pending purchase from checkout redirect, fire dataLayer once per
 * transaction_id, then clear pending. Returns the purchase only when newly
 * fired so Meta Pixel can use the same values without duplicates.
 */
export function consumePendingPurchase(): PurchaseEcommerce | null {
  const purchase = readPendingPurchase();
  if (!purchase) return null;
  clearPendingPurchase();
  if (wasPurchaseFired(purchase.transaction_id)) {
    return null;
  }
  pushPurchaseDataLayer(purchase);
  markPurchaseFired(purchase.transaction_id);
  return purchase;
}
