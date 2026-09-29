import type { Metadata } from "next";
import { AccountPagination } from "@/components/account/AccountPagination";
import { TestSeriesCardV2 } from "@/components/cards/TestSeriesCardV2";
import { ACCOUNT_TEST_SERIES } from "@/data/account/test-series";
import { paginateItems, parsePageParam } from "@/lib/account/pagination";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Test Series — Rodha",
  description: "Your Rodha test series.",
  path: "/account/test-series",
});

interface AccountTestSeriesPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function AccountTestSeriesPage({
  searchParams,
}: AccountTestSeriesPageProps) {
  const params = await searchParams;
  const page = parsePageParam(params.page);
  const paged = paginateItems(ACCOUNT_TEST_SERIES, page);

  return (
    <div className="mx-auto w-full max-w-7xl">
      <header className="mb-6">
        <h1 className="font-montserrat text-h3 font-bold text-[var(--account-text)]">
          Test Series
        </h1>
        <p className="mt-1 text-body-sm text-[var(--account-text-muted)]">
          Full-length mocks, sectionals, and practice packs for your exam prep.
        </p>
      </header>

      {paged.items.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paged.items.map((item) => (
            <TestSeriesCardV2 key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] px-6 py-12 text-center">
          <p className="text-body text-[var(--account-text-muted)]">
            No test series available right now.
          </p>
        </div>
      )}

      {paged.totalPages > 1 ? (
        <AccountPagination
          currentPage={paged.page}
          totalPages={paged.totalPages}
          basePath="/account/test-series"
          className="pt-8"
        />
      ) : null}
    </div>
  );
}
