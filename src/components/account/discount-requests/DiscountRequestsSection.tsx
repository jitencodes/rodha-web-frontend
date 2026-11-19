"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { AccountSectionHeader } from "@/components/account/AccountSectionHeader";
import { DiscountRequestDetailDrawer } from "@/components/account/discount-requests/DiscountRequestDetailDrawer";
import { DiscountRequestDialog } from "@/components/account/discount-requests/DiscountRequestDialog";
import { DiscountRequestStatusBadge } from "@/components/account/discount-requests/DiscountRequestStatusBadge";
import { DiscountValidityCountdown } from "@/components/account/discount-requests/DiscountValidityCountdown";
import {
  discountStatusMessage,
  formatDiscountDate,
} from "@/lib/api/modules/student/discount-requests/mapper";
import type { DiscountRequestApi } from "@/lib/api/modules/student/discount-requests/types";
import { userAtom } from "@/lib/store/user";

export const DISCOUNT_REQUEST_QUERY = "discountRequestId";

type DiscountRequestsSectionProps = {
  requests: DiscountRequestApi[];
  /** `?discountRequestId=` from the Approved / Rejected email link. */
  initialOpenId?: string | null;
};

const LINK_BUTTON =
  "text-[13px] font-semibold text-[var(--account-accent)] transition-opacity hover:opacity-80";

/** Student dashboard → My Discount Requests (hidden when there are none). */
export function DiscountRequestsSection({
  requests,
  initialOpenId = null,
}: DiscountRequestsSectionProps) {
  const router = useRouter();
  const authUser = useAtomValue(userAtom);
  const [openId, setOpenId] = useState<string | null>(initialOpenId);
  const [resubmitting, setResubmitting] = useState<DiscountRequestApi | null>(null);

  const closeDrawer = useCallback(() => {
    setOpenId(null);
    // Drop the email deep-link param so a refresh doesn't reopen the drawer.
    const url = new URL(window.location.href);
    if (url.searchParams.has(DISCOUNT_REQUEST_QUERY)) {
      url.searchParams.delete(DISCOUNT_REQUEST_QUERY);
      router.replace(`${url.pathname}${url.search}`, { scroll: false });
    }
  }, [router]);

  if (requests.length === 0 && !openId) return null;

  const openRequest = openId
    ? requests.find((request) => String(request.id) === openId) ?? null
    : null;

  return (
    <section aria-labelledby="discount-requests-heading">
      {requests.length > 0 ? (
        <>
          <AccountSectionHeader
            title="My Discount Requests"
            titleId="discount-requests-heading"
          />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {requests.map((request) => {
              const packageHref = request.item?.slug
                ? `/courses/${request.item.slug}`
                : null;
              return (
                <li
                  key={request.id}
                  className="flex flex-col rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4 shadow-[var(--account-shadow)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[14px] font-semibold text-[var(--account-text)]">
                        {request.item?.title || "Package"}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[var(--account-text-muted)]">
                        {request.discountTypeName || request.discountType}
                        {request.createdAt
                          ? ` · Requested ${formatDiscountDate(request.createdAt)}`
                          : ""}
                      </p>
                    </div>
                    <DiscountRequestStatusBadge status={request.status} />
                  </div>

                  <p className="mt-3 text-[13px] text-[var(--account-text-secondary)]">
                    {discountStatusMessage(request)}
                  </p>
                  {request.status === "PENDING" && (request.suggestedPercent ?? 0) > 0 ? (
                    <p className="mt-1 text-[12px] text-[var(--account-text-muted)]">
                      Suggested discount: {request.suggestedPercent}%
                    </p>
                  ) : null}
                  {request.status === "APPROVED" && request.validTill ? (
                    <DiscountValidityCountdown
                      validTill={request.validTill}
                      className="mt-1 block text-[12px] font-medium text-[var(--account-status-active-text)]"
                    />
                  ) : null}

                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setOpenId(String(request.id))}
                      className={LINK_BUTTON}
                    >
                      View details
                    </button>
                    {request.status === "REJECTED" ? (
                      <button
                        type="button"
                        onClick={() => setResubmitting(request)}
                        className={LINK_BUTTON}
                      >
                        Resubmit
                      </button>
                    ) : null}
                    {request.status === "APPROVED" && packageHref ? (
                      <Link href={packageHref} className={LINK_BUTTON}>
                        Buy now →
                      </Link>
                    ) : null}
                    {(request.status === "EXPIRED" || request.status === "REVOKED") &&
                    packageHref ? (
                      <Link href={packageHref} className={LINK_BUTTON}>
                        Request again
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}

      {openId ? (
        <DiscountRequestDetailDrawer
          key={openId}
          request={openRequest}
          requestId={openId}
          onClose={closeDrawer}
          onResubmit={(request) => {
            closeDrawer();
            setResubmitting(request);
          }}
        />
      ) : null}

      {resubmitting ? (
        <DiscountRequestDialog
          open
          onClose={() => setResubmitting(null)}
          packageId={resubmitting.packageId}
          packageTitle={resubmitting.item?.title || "Package"}
          websiteCategoryId={resubmitting.item?.websiteCategoryId ?? null}
          student={{
            name: authUser?.fullName ?? "",
            email: authUser?.email ?? "",
            mobile: authUser?.mobile ?? "",
          }}
          resubmitRequest={resubmitting}
          onSubmitted={() => router.refresh()}
        />
      ) : null}
    </section>
  );
}
