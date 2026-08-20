import Link from "next/link";
import Image from "next/image";
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
  aria-label={item.title}
  className={cn(
    "group relative flex h-full flex-col overflow-hidden rounded-[6px] border border-[#FFEAD6] bg-[#FFF3E8] hover-shine hover:shadow-sm hover:shadow-orange-500/70",
    className
  )}
>
  <>
    {item.image && (
      <Image
        src={item.image}
        alt={item.title}
        width={300}
        height={250}
        className="aspect-[3/1.8] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
    )}

    <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-orange-500/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

    <div className="relative z-10 flex h-full flex-col p-5 md:p-6">
      <span className="text-[2.5rem] font-black leading-none tracking-tight text-orange-500 transition-transform duration-300 group-hover:translate-x-1 md:text-[2rem]">
        {item.value}
      </span>

      {/* Minimum two-line title height */}
      <h3 className="mt-4 min-h-[3.5rem] text-h4 font-montserrat font-medium leading-snug text-neutral-900">
        {item.title}
      </h3>

      <p className="mt-1 max-w-[22rem] text-body-sm leading-relaxed text-neutral-500">
        {item.description}
      </p>
      <div className="flex items-center justify-between gap-2 mt-3">
        {/* Pricing */}
        <div className="flex items-center gap-2">
          {item.price && item.price !== item.offerPrice && (
            <span className="text-sm font-medium text-neutral-400 line-through">
              {item.price}
            </span>
          )}

          <span className="text-lg font-bold text-neutral-900">
            {item.offerPrice}
          </span>
        </div>

        {/* CTA */}
        <div className="inline-flex items-center gap-1.5 text-body-sm font-semibold text-orange-500 transition-colors group-hover:text-orange-600">
          Buy Now

          <svg
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 011.04-1.08l4.25 4.25a.75.75 0 010 1.08l-4.25 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  </>
</Link>
  );
}
