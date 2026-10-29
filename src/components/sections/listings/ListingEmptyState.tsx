import Link from "next/link";

interface ListingEmptyStateProps {
  href: string;
  query: string;
  hasCategory: boolean;
  hasType?: boolean;
  noun: string;
}

export function ListingEmptyState({
  href,
  query,
  hasCategory,
  hasType = false,
  noun,
}: ListingEmptyStateProps) {
  const message = query
    ? `We couldn't find any ${noun} matching your search. Try a different keyword or browse another category.`
    : hasCategory
      ? `There are no ${noun} in this category at the moment. Please explore another category.`
      : hasType
        ? `There are no ${noun} of this type at the moment. Try another type.`
        : `There are no ${noun} available at the moment. Please check back soon.`;

  return (
    <div className="rounded-xl border border-section-beige bg-white px-6 py-12 text-center shadow-sm">
      <p className="text-h4 font-semibold text-neutral-900">
        No {noun} found
      </p>
      <p className="mt-2 text-body text-neutral-500">{message}</p>
      <Link
        href={href}
        className="mt-5 inline-block text-body-sm font-medium text-orange-500 transition-colors hover:text-orange-600"
      >
        Clear filters
      </Link>
    </div>
  );
}
