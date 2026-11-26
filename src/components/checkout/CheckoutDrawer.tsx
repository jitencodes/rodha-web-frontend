"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, X } from "lucide-react";
import { toast } from "sonner";
import { AccountThemedPortal } from "@/components/account/AccountThemedPortal";
import { CheckoutPanel } from "@/components/checkout/CheckoutPanel";
import { CheckoutProductCard } from "@/components/checkout/CheckoutSections";
import {
  EMPTY_GUEST_DETAILS,
  GuestDetailsForm,
  type GuestDetails,
} from "@/components/checkout/GuestDetailsForm";
import { GuestVerify } from "@/components/checkout/GuestVerify";
import { Skeleton } from "@/components/ui/Skeleton";
import type {
  AuthUserViewModel,
  PurchaseIdentifyViewModel,
} from "@/lib/api/modules/auth/types";
import { SOFT_BLOCK_STATUS } from "@/lib/api/soft-block";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";
import type {
  CheckoutProduct,
  CheckoutSession,
  CheckoutSessionResponse,
} from "@/lib/checkout/types";
import { requestStudentGateCheck } from "@/lib/student-gate";

export type CheckoutDrawerProduct = CheckoutProduct & {
  packageId: number;
  price: number;
  originalPrice?: number | null;
};

type CheckoutDrawerProps = {
  open: boolean;
  onClose: () => void;
  product: CheckoutDrawerProduct;
  isLoggedIn: boolean;
};

type View =
  | { step: "loading" }
  | { step: "error"; message: string }
  | { step: "guest" }
  | {
      step: "verify";
      identity: PurchaseIdentifyViewModel;
      /** Kept here so reopening the drawer does not email another code. */
      otpSentAt: number | null;
    }
  | { step: "checkout"; session: CheckoutSession };

const SUCCESS_PATH = "/account/checkout/success";

/** Right-side checkout: guest details → sign in → the full checkout, in place. */
export function CheckoutDrawer({
  open,
  onClose,
  product,
  isLoggedIn,
}: CheckoutDrawerProps) {
  const router = useRouter();
  const titleId = useId();
  const formId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const celebratedCodeRef = useRef<string | null>(null);
  const requestRef = useRef(0);
  const otpAutoSendRef = useRef(false);

  const [view, setView] = useState<View>({ step: "loading" });
  const [details, setDetails] = useState<GuestDetails>(EMPTY_GUEST_DETAILS);
  const [guestPending, setGuestPending] = useState(false);
  const [busy, setBusy] = useState(false);
  /** Signed in here: the page behind still shows the guest view. */
  const signedInRef = useRef(false);
  // Read only when opening, so a refresh behind the drawer can't restart it.
  const isLoggedInRef = useRef(isLoggedIn);
  useEffect(() => {
    isLoggedInRef.current = isLoggedIn;
  }, [isLoggedIn]);

  const { packageId, slug } = product;

  const loadSession = useCallback(async () => {
    const request = ++requestRef.current;
    setView({ step: "loading" });
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId, slug }),
      });
      if (request !== requestRef.current) return;
      if (isUnauthorizedStatus(res.status)) {
        // No (or expired) session: continue as a guest instead of leaving the page.
        setView({ step: "guest" });
        return;
      }
      const data = (await res.json().catch(() => null)) as CheckoutSessionResponse | null;
      if (request !== requestRef.current) return;
      if (!res.ok || !data?.ok || !data.session) {
        if (res.status === SOFT_BLOCK_STATUS) requestStudentGateCheck(true);
        setView({ step: "error", message: data?.error || "Unable to start checkout" });
        return;
      }
      setView({ step: "checkout", session: data.session });
    } catch {
      if (request !== requestRef.current) return;
      setView({
        step: "error",
        message: "Something went wrong. Check your connection and try again.",
      });
    }
  }, [packageId, slug]);

  useEffect(() => {
    if (!open) return;
    if (isLoggedInRef.current || signedInRef.current) void loadSession();
    else setView((prev) => (prev.step === "verify" ? prev : { step: "guest" }));
    return () => {
      // Ignore a response that lands after the drawer closed.
      requestRef.current += 1;
    };
  }, [open, loadSession]);

  const close = useCallback(() => {
    if (busy) return;
    onClose();
    // Refresh only now: it turns on the registration gate, which would open
    // its dialog over the checkout.
    if (signedInRef.current) router.refresh();
  }, [busy, onClose, router]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      previousFocus?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      // Escape belongs to the dialog on top (offers, discount form, state picker).
      const modals = document.querySelectorAll('[aria-modal="true"]');
      if (modals.length > 1 || document.querySelector('[role="listbox"]')) return;
      close();
    }
    // Capture: read the open dialogs before one of them handles Escape and unmounts.
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, close]);

  if (!open) return null;

  function handleSignedIn(user: AuthUserViewModel | null) {
    signedInRef.current = true;
    const typed = details.email.trim().toLowerCase();
    if (user?.email && user.email.toLowerCase() !== typed) {
      toast.info(`You are signed in as ${user.email}`, {
        description: "The package will be added to this account.",
      });
    }
    void loadSession();
  }

  const showProductCard = view.step === "guest" || view.step === "verify";

  return (
    <AccountThemedPortal>
      <div className="fixed inset-0 z-[100] flex justify-end">
        <button
          type="button"
          aria-label="Close checkout"
          tabIndex={-1}
          className="absolute inset-0 animate-[checkout-fade-in_200ms_ease-out] cursor-default bg-black/50"
          onClick={close}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative z-[101] flex h-dvh w-full max-w-[460px] animate-[checkout-drawer-in_260ms_cubic-bezier(0.22,1,0.36,1)] flex-col border-l border-[var(--account-border)] bg-[var(--account-bg)] text-[var(--account-text)] shadow-xl motion-reduce:animate-none"
        >
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--account-border)] bg-[var(--account-surface)] px-4 py-4 sm:px-5">
            <div className="min-w-0">
              <h2
                id={titleId}
                className="font-montserrat text-base font-bold text-[var(--account-text)]"
              >
                Checkout
              </h2>
              <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[var(--account-text-muted)]">
                <LockKeyhole className="size-3" aria-hidden />
                Secure payment
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              disabled={busy}
              aria-label="Close checkout"
              className="cursor-pointer rounded-lg p-1.5 text-[var(--account-text-muted)] hover:bg-[var(--account-nav-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X className="size-5" aria-hidden />
            </button>
          </header>

          {view.step === "checkout" ? (
            <CheckoutPanel
              layout="drawer"
              session={view.session}
              knownStateName={details.stateName || null}
              knownMobile={details.mobile}
              onBusyChange={setBusy}
              celebratedCodeRef={celebratedCodeRef}
              // Full navigation: the session cookie may have been set in this tab.
              onPaid={() => window.location.assign(SUCCESS_PATH)}
            />
          ) : (
            <>
              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
                {showProductCard ? (
                  <CheckoutProductCard
                    product={product}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    showDetailsLink={false}
                  />
                ) : null}

                {view.step === "loading" ? (
                  <div className="space-y-4" aria-busy="true" aria-label="Loading checkout">
                    <Skeleton className="h-28 w-full rounded-[var(--account-radius)]" />
                    <Skeleton className="h-40 w-full rounded-[var(--account-radius)]" />
                    <Skeleton className="h-32 w-full rounded-[var(--account-radius)]" />
                  </div>
                ) : null}

                {view.step === "error" ? (
                  <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-5 py-10 text-center">
                    <p className="text-[14px] text-[var(--account-text-secondary)]" role="alert">
                      {view.message}
                    </p>
                    <button
                      type="button"
                      onClick={() => void loadSession()}
                      className="mt-4 cursor-pointer text-[13px] font-semibold text-[var(--account-accent)]"
                    >
                      Try again
                    </button>
                  </div>
                ) : null}

                {showProductCard ? (
                  <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4 shadow-[var(--account-shadow)]">
                    {view.step === "guest" ? (
                      <GuestDetailsForm
                        formId={formId}
                        packageId={packageId}
                        details={details}
                        onChange={(patch) =>
                          setDetails((prev) => ({ ...prev, ...patch }))
                        }
                        onPendingChange={setGuestPending}
                        onIdentified={(identity) => {
                          otpAutoSendRef.current = false;
                          setView({ step: "verify", identity, otpSentAt: null });
                        }}
                      />
                    ) : view.step === "verify" ? (
                      <GuestVerify
                        key={view.identity.journeyId}
                        identity={view.identity}
                        email={details.email.trim()}
                        otpSentAt={view.otpSentAt}
                        autoSendStartedRef={otpAutoSendRef}
                        onOtpSent={() =>
                          setView((prev) =>
                            prev.step === "verify"
                              ? { ...prev, otpSentAt: Date.now() }
                              : prev
                          )
                        }
                        onEditDetails={() => setView({ step: "guest" })}
                        onSignedIn={handleSignedIn}
                      />
                    ) : null}
                  </div>
                ) : null}

                {showProductCard ? (
                  <p className="text-center text-[11px] text-[var(--account-text-muted)]">
                    By continuing, you agree to our{" "}
                    <Link
                      href="/privacy-policy"
                      target="_blank"
                      className="font-medium text-[var(--account-accent)]"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/terms-and-conditions"
                      target="_blank"
                      className="font-medium text-[var(--account-accent)]"
                    >
                      Terms of Use
                    </Link>
                    .
                  </p>
                ) : null}
              </div>

              {view.step === "guest" ? (
                <footer className="shrink-0 border-t border-[var(--account-border)] bg-[var(--account-surface)] px-4 py-4 sm:px-5">
                  <button
                    type="submit"
                    form={formId}
                    disabled={guestPending}
                    className="inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] px-4 text-[14px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {guestPending ? "Please wait…" : "Continue"}
                  </button>
                </footer>
              ) : null}
            </>
          )}
        </aside>
      </div>
    </AccountThemedPortal>
  );
}
