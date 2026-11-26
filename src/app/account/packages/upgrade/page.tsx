import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowUpRight, BadgePercent } from "lucide-react";

import { PackageUpgradeCheckoutClient } from "@/components/account/PackageUpgradeCheckoutClient";
import { PendingUpgradeNotice } from "@/components/account/PendingUpgradeNotice";
import { formatCartMoney } from "@/lib/account/cart-totals";
import type { EnrolledPackageViewModel } from "@/lib/api/modules/student/package-upgrades/types";
import {
  getStudentEnrolledPackages,
  getUpgradeQuote,
} from "@/lib/api/modules/student/package-upgrades/service";
import {
  isUnauthorizedError,
  redirectSessionExpired,
  withStudentAuth,
} from "@/lib/auth/require-student";
import { ApiError } from "@/lib/api/types";
import { buildPageMetadata } from "@/lib/seo";
import Image from "next/image";

export const metadata: Metadata = buildPageMetadata({
  title: "Upgrade package — Rodha",
  description: "Choose an upgrade target and complete payment.",
  path: "/account/packages/upgrade",
});

interface UpgradePageProps {
  searchParams: Promise<{
    enrollmentId?: string;
    targetPackageId?: string;
  }>;
}

export default async function PackageUpgradePage({
  searchParams,
}: UpgradePageProps) {
  const params = await searchParams;
  const enrollmentIdRaw = params.enrollmentId?.trim();
  const targetRaw = params.targetPackageId?.trim();
  const enrollmentId = enrollmentIdRaw
    ? Number.parseInt(enrollmentIdRaw, 10)
    : NaN;
  const targetPackageId = targetRaw
    ? Number.parseInt(targetRaw, 10)
    : NaN;

  if (!Number.isFinite(enrollmentId) || enrollmentId <= 0) {
    redirect("/account/packages");
  }

  const data = await withStudentAuth(async (accessToken) => {
    const returnPath = `/account/packages/upgrade?enrollmentId=${enrollmentId}`;
    let source: EnrolledPackageViewModel | null = null;
    try {
      const packages = await getStudentEnrolledPackages(accessToken);
      source = packages.find((pkg) => pkg.enrollmentId === enrollmentId) ?? null;
    } catch (error) {
      if (isUnauthorizedError(error)) redirectSessionExpired(returnPath);
    }
    // A pending upgrade must be resumed or cancelled first (quote would 409).
    if (
      !source ||
      source.pendingUpgrade ||
      !(Number.isFinite(targetPackageId) && targetPackageId > 0)
    ) {
      return { source, quote: null, quoteError: null };
    }

    try {
      const quote = await getUpgradeQuote(
        accessToken,
        { sourceEnrollmentId: enrollmentId, targetPackageId },
        source.websiteCategoryId
      );
      return {
        source,
        quote,
        quoteError: quote ? null : "Unable to load this upgrade right now.",
      };
    } catch (error) {
      if (isUnauthorizedError(error)) redirectSessionExpired(returnPath);
      // 400 not an upgrade target · 409 already enrolled in the target.
      return {
        source,
        quote: null,
        quoteError:
          error instanceof ApiError && error.status < 500
            ? error.message
            : "Unable to load this upgrade right now.",
      };
    }
  }, `/account/packages/upgrade?enrollmentId=${enrollmentId}`);

  if (!data.source) {
    notFound();
  }

  const { source, quote, quoteError } = data;
  const upgrades = source.availableUpgrades;
  const pendingUpgrade = source.pendingUpgrade;

  if (pendingUpgrade) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-6">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-[var(--account-text-muted)]">
            <Link
              href="/account/packages"
              className="hover:text-[var(--account-accent)]"
            >
              Manage Packages
            </Link>
            <span className="mx-1.5">/</span>
            Upgrade
          </p>
          <h1 className="mt-1 font-montserrat text-h3 font-bold text-[var(--account-text)]">
            Complete your upgrade
          </h1>
          <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
            Your last upgrade payment for {source.title} was not completed.
          </p>
        </header>
        <PendingUpgradeNotice
          pending={pendingUpgrade}
          sourceTitle={source.title}
          websiteCategoryId={source.websiteCategoryId}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-[var(--account-text-muted)]">
          <Link
            href="/account/packages"
            className="hover:text-[var(--account-accent)]"
          >
            Manage Packages
          </Link>
          <span className="mx-1.5">/</span>
          Upgrade
        </p>
        <h1 className="mt-1 font-montserrat text-h3 font-bold text-[var(--account-text)]">
          {quote ? "Upgrade summary" : "Available upgrades"}
        </h1>
        <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
          {quote
            ? "Review pricing and continue to secure checkout."
            : `Select a plan to upgrade from ${source.title}.`}
        </p>
      </header>

      {quoteError ? (
        <p
          role="alert"
          className="mb-4 rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-status-pending-bg)] px-4 py-3 text-[13px] font-medium text-[var(--account-status-pending-text)]"
        >
          {quoteError}
        </p>
      ) : null}

      {!quote ? (
        upgrades.length === 0 ? (
          <div className="rounded-[var(--account-radius)] border border-dashed border-[var(--account-border-strong)] bg-[var(--account-surface)] px-6 py-10 text-center">
            <p className="text-[15px] font-semibold text-[var(--account-text)]">
              No upgrades available
            </p>
            <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
              This package does not have an upgrade path right now.
            </p>
            <Link
              href="/account/packages"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-[var(--account-radius)] bg-[var(--account-accent)] px-4 text-[13px] font-semibold text-white"
            >
              Back to packages
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {upgrades.map((upgrade) => (
              <li
                key={upgrade.id}
                className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4 shadow-[var(--account-shadow)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="relative mb-3 aspect-video w-40 overflow-hidden rounded-[var(--account-radius)] bg-[var(--account-border)]">
                      <Image
                        src={upgrade.bannerImageUrl}
                        alt={upgrade.title}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    </div>
                    <p className="text-[15px] font-semibold text-[var(--account-text)]">
                      {upgrade.title}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--account-text-muted)]">
                      {upgrade.listPrice > upgrade.salePrice ? (
                        <span className="line-through">
                          {formatCartMoney(upgrade.listPrice)}
                        </span>
                      ) : null}
                      <span className="font-semibold text-[var(--account-text)]">
                        {formatCartMoney(upgrade.salePrice)}
                      </span>
                      {upgrade.promocodeCode ? (
                        <span className="inline-flex items-center gap-1 text-[var(--account-accent)]">
                          <BadgePercent className="size-3.5" aria-hidden />
                          {upgrade.promocodeCode}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-[13px] font-semibold text-[var(--account-accent)]">
                      {upgrade.isFree || upgrade.payableAmount <= 0
                        ? "Payable: FREE"
                        : `Payable: ${formatCartMoney(upgrade.payableAmount)}`}
                    </p>
                  </div>
                  <Link
                    href={`/account/packages/upgrade?enrollmentId=${source.enrollmentId}&targetPackageId=${upgrade.id}`}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-[var(--account-radius)] bg-[var(--account-accent)] px-4 text-[13px] font-semibold text-white"
                  >
                    Continue
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : (
        <PackageUpgradeCheckoutClient quote={quote} />
      )}
    </div>
  );
}
