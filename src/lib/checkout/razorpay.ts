export type RazorpayPaymentFields = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayCheckoutOptions = {
  keyId?: string;
  amountPaise?: number;
  currency?: string;
  razorpayOrderId?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  description: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: () => void) => void;
    };
  }
}

const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";

async function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Opens Razorpay and resolves with the payment fields, or `null` when the
 * student closes the popup without paying.
 */
export async function openRazorpay(
  options: RazorpayCheckoutOptions
): Promise<RazorpayPaymentFields | null> {
  const loaded = await loadRazorpay();
  const Razorpay = window.Razorpay;
  if (!loaded || !Razorpay) throw new Error("Unable to load Razorpay");

  return new Promise((resolve) => {
    const rzp = new Razorpay({
      key: options.keyId,
      amount: options.amountPaise,
      currency: options.currency || "INR",
      name: "Rodha",
      description: options.description,
      order_id: options.razorpayOrderId,
      prefill: options.prefill,
      handler: (response: RazorpayPaymentFields) => resolve(response),
      modal: { ondismiss: () => resolve(null) },
    });
    rzp.open();
  });
}
