"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckoutPanel } from "@/components/checkout/CheckoutPanel";
import type { CheckoutSession } from "@/lib/checkout/types";

type CheckoutPageClientProps = {
  /** null = empty cart (or it could not be loaded). */
  session: CheckoutSession | null;
};

export function CheckoutPageClient({ session }: CheckoutPageClientProps) {
  const router = useRouter();

  if (!session?.line) {
    return (
      <div className="mx-auto max-w-3xl rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-8 text-center">
        <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
          Checkout
        </h1>
        <p className="mt-2 text-body-sm text-[var(--account-text-muted)]">
          No package selected. Choose a course and click Buy Now to continue.
        </p>
        <Link
          href="/account/courses?tab=buy"
          className="mt-5 inline-flex text-[14px] font-semibold text-[var(--account-accent)]"
        >
          Browse courses →
        </Link>
      </div>
    );
  }

  return (
    <CheckoutPanel
      layout="page"
      session={session}
      onPaid={() => {
        router.push("/account/checkout/success");
        router.refresh();
      }}
    />
  );
}
