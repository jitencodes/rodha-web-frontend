import Image from "next/image";
import Link from "next/link";
import {
  Clock3,
  Globe2,
  Layers3,
  ListChecks,
  Trash2,
} from "lucide-react";
import { cn, formatPrice, isExternalHref } from "@/lib/utils";
import type { CartItem } from "@/lib/account/types";

type CartItemCardProps = {
  item: CartItem;
  onRemove: (id: string) => void;
  className?: string;
};

function productTypeLabel(type: CartItem["productType"]) {
  return type === "test-series" ? "Test Series" : "Course";
}

export function CartItemCard({ item, onRemove, className }: CartItemCardProps) {
  const external = isExternalHref(item.detailsHref);
  const metaBits: { icon: typeof Globe2; text: string }[] = [];
  if (item.meta.language) {
    metaBits.push({ icon: Globe2, text: item.meta.language });
  }
  if (item.meta.mode) {
    metaBits.push({ icon: Layers3, text: item.meta.mode });
  }
  if (item.meta.quantityLabel) {
    metaBits.push({ icon: ListChecks, text: item.meta.quantityLabel });
  }
  if (item.meta.access) {
    metaBits.push({ icon: Clock3, text: item.meta.access });
  }

  return (
    <article
      className={cn(
        "relative flex flex-col gap-4 rounded-[var(--account-radius)] border border-[var(--account-border)] bg-[var(--account-surface)] p-4 shadow-[var(--account-shadow)] sm:flex-row sm:gap-5 sm:p-5",
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg bg-[var(--account-border)] sm:aspect-auto sm:h-[120px] sm:w-[160px]">
        <Image
          src={item.thumbnail}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 160px"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex rounded-md bg-[var(--account-accent-soft)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--account-accent)]">
            {productTypeLabel(item.productType)}
          </span>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.title} from cart`}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--account-text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-500"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <h3 className="mt-2 font-montserrat text-[15px] font-semibold leading-snug text-[var(--account-text)] sm:text-base">
          {item.title}
        </h3>

        {metaBits.length > 0 ? (
          <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5 text-[12px] text-[var(--account-text-muted)] sm:text-[13px]">
            {metaBits.map(({ icon: Icon, text }) => (
              <li key={text} className="inline-flex items-center gap-1.5">
                <Icon className="size-3.5 shrink-0 opacity-70" aria-hidden />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span className="text-lg font-bold text-[var(--account-text)]">
              {formatPrice(item.price)}
            </span>
            {item.originalPrice > item.price ? (
              <>
                <span className="text-[13px] text-[var(--account-text-muted)] line-through">
                  {formatPrice(item.originalPrice)}
                </span>
                <span className="rounded-md bg-[var(--account-accent-soft)] px-1.5 py-0.5 text-[11px] font-bold text-[var(--account-accent)]">
                  {item.discountPercent}% OFF
                </span>
              </>
            ) : null}
          </div>

          <Link
            href={item.detailsHref}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="inline-flex items-center gap-1 rounded-lg border border-[var(--account-accent)] px-3 py-1.5 text-[13px] font-semibold text-[var(--account-accent)] transition-colors hover:bg-[var(--account-nav-active-bg)]"
          >
            View Details
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
