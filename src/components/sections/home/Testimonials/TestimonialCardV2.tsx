import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";

interface TestimonialCardV2Props {
  testimonial: Testimonial;
  className?: string;
}

/** Dark testimonial card (MBA testimonials restored to old black theme). */
export function TestimonialCardV2({ testimonial, className }: TestimonialCardV2Props) {
  const role = [testimonial.exam, testimonial.college].filter(Boolean).join(" · ");

  return (
    <article
      className={cn(
        "card-base card-premium-hover shine-sweep-hover group flex h-full w-[300px] min-h-[220px] flex-col p-5 md:p-6 sm:w-full",
        className
      )}
    >
      <div className="quote-glow flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-orange-500/20 bg-orange-500/15 text-orange-400 transition-[filter,border-color] duration-300 group-hover:border-orange-500/40 group-hover:brightness-125">
        <Icon src="/assets/icons/quote.svg" size={18} />
      </div>

      <p className="mt-4 line-clamp-5 flex-1 text-body-sm leading-relaxed text-text-secondary">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      <div className="mt-5 flex items-center gap-3 border-t border-border-default pt-4">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border-default bg-bg-tertiary">
          <Image
            src={testimonial.image || "/assets/images/placeholders/topper-photo.svg"}
            alt={testimonial.name}
            fill
            className="object-contain object-bottom"
            sizes="44px"
          />
        </div>
        <div className="min-w-0">
          <h4 className="truncate text-body-sm font-semibold text-text-primary">
            {testimonial.name}
          </h4>
          <p className="mt-0.5 truncate text-caption text-text-dimmed">
            {testimonial.score ? `${testimonial.score} · ` : ""}
            {role}
          </p>
        </div>
      </div>
    </article>
  );
}
