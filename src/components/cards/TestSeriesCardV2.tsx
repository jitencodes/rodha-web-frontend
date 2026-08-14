import Link from "next/link";
import { cn } from "@/lib/utils";
import type { TestSeriesItem } from "@/lib/types";

interface TestSeriesCardV2Props {
  item: TestSeriesItem;
  className?: string;
}

/** Peach-surface test series card for contrast on white MBA section. */
export function TestSeriesCardV2({ item, className }: TestSeriesCardV2Props) {
  const isExternal = item.href.startsWith("http");

  return (
    <Link
      href={item.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "group relative flex h-full min-h-[180px] flex-col overflow-hidden rounded-[6px] border border-[#FFEAD6] bg-[#FFF3E8] p-5 md:p-6 hover-shine hover:shadow-sm hover:shadow-orange-500/70",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-orange-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex h-full flex-col">
        <span className="text-[2.5rem] font-black leading-none tracking-tight text-orange-500 transition-transform duration-300 group-hover:translate-x-1 md:text-[2.75rem]">
          {item.value}
        </span>

        <h3 className="mt-4 text-h4 font-montserrat font-medium text-neutral-900">
          {item.title}
        </h3>

        <p className="mt-3 max-w-[22rem] text-body-sm leading-relaxed text-neutral-500">
          {item.description}
        </p>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-body-sm font-semibold text-orange-500 transition-colors group-hover:text-orange-600">
          Explore Now
          <svg
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.25 4.25a.75.75 0 010 1.08l-4.25 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
