import { AccountLiveClassCard } from "@/components/account/AccountLiveClassCard";
import { AccountSectionHeader } from "@/components/account/AccountSectionHeader";
import type { AccountLiveContentItem } from "@/lib/api/modules/student/courses/mapper";

type AccountLiveClassesSectionProps = {
  items: AccountLiveContentItem[];
  title?: string;
  titleId?: string;
};

/** Renders today's / live content section only when items exist. */
export function AccountLiveClassesSection({
  items,
  title = "Live Classes",
  titleId = "live-classes-heading",
}: AccountLiveClassesSectionProps) {
  if (!items.length) return null;

  return (
    <section className="mb-8" aria-labelledby={titleId}>
      <AccountSectionHeader title={title} titleId={titleId} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <AccountLiveClassCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
