import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { FacultyPublication } from "@/lib/types";

interface FacultyPublicationCardProps {
  title?: string;
  items: FacultyPublication[];
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

const LIGHT_CARD =
  "rounded-xl border border-section-beige bg-white shadow-sm shadow-orange-500/5";

export function FacultyPublicationCard({
  title = "Publications / Content",
  items,
  viewAllHref = "/blog",
  viewAllLabel = "View All →",
  className,
}: FacultyPublicationCardProps) {
  return (
    <div
      className={cn(
        "card-premium-hover hover-shine flex flex-col p-5 md:p-6 h-full",
        LIGHT_CARD,
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-h4 font-semibold text-neutral-900">{title}</h3>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="btn-view-all text-caption text-orange-500 hover:text-orange-600 whitespace-nowrap"
          >
            {viewAllLabel}
          </Link>
        )}
      </div>

      <ul className="mt-4 flex flex-col divide-y divide-section-beige">
        {items.map((item) => {
          const content = (
            <>
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-section-beige">
                <Image
                  src={item.thumbnail}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-body-sm font-medium text-neutral-900 leading-snug line-clamp-2">
                  {item.title}
                </p>
                <p className="mt-1 text-caption text-neutral-500">{item.meta}</p>
              </div>
            </>
          );

          const rowClass =
            "flex items-center gap-3 py-3 first:pt-0 last:pb-0 transition-colors";

          if (item.href) {
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(rowClass, "hover:bg-section-beige -mx-2 px-2 rounded-md")}
                >
                  {content}
                </Link>
              </li>
            );
          }

          return (
            <li key={item.id} className={rowClass}>
              {content}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
