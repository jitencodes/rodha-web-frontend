"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Lottie } from "lottie-react";
import { trackMetaPurchase } from "@/components/providers/MetaPixel";

export default function CheckoutSuccessPage() {
  useEffect(() => {
    trackMetaPurchase();
  }, []);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-10 text-center">
      <div className="flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
        <Lottie
          src="/assets/lottie/success.json"
          loop
          autoplay
          className="h-full w-full"
        />
      </div>
      <h1 className="mt-2 font-montserrat text-h3 font-bold text-[var(--account-text)]">
        Payment successful
      </h1>
      <p className="mt-2 text-body-sm text-[var(--account-text-muted)]">
        Your enrollment is being prepared. You can continue learning from your
        dashboard.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/account/dashboard"
          className="inline-flex h-11 items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] px-5 text-[14px] font-semibold text-white"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/account/courses?tab=continue"
          className="inline-flex h-11 items-center justify-center rounded-[var(--account-radius)] border border-[var(--account-accent)] px-5 text-[14px] font-semibold text-[var(--account-accent)]"
        >
          Continue Watching
        </Link>
      </div>
    </div>
  );
}
