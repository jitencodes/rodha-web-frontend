import { AppImage } from "@/components/ui/AppImage";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import type { Testimonial } from "@/lib/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  const role = [testimonial.exam, testimonial.college].filter(Boolean).join(" · ");

  return (
    <article
      className={cn(
        "card-base card-premium-hover shine-sweep-hover group flex flex-col p-5 md:p-6 h-full w-[300px] sm:w-[320px] min-h-[220px]",
        className
      )}
    >
      <div className="quote-glow w-9 h-9 rounded-[6px] bg-orange-500/15 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 transition-[filter,border-color] duration-300 group-hover:brightness-125 group-hover:border-orange-500/40">
        <Icon src="/assets/icons/quote.svg" size={18} />
      </div>

      <p className="mt-4 flex-1 text-body-sm text-text-secondary leading-relaxed line-clamp-5">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      <div className="mt-5 flex items-center gap-3 pt-4 border-t border-border-default">
        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-border-default shrink-0 bg-bg-tertiary">
          <AppImage
            src={testimonial.image || "/assets/images/placeholders/topper-photo.svg"}
            alt={testimonial.name}
            fill
            className="object-contain object-bottom"
            sizes="44px"
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-body-sm font-semibold text-text-primary truncate">
            {testimonial.name}
          </h4>
          <p className="mt-0.5 text-caption text-text-dimmed truncate">
            {testimonial.score ? `${testimonial.score} · ` : ""}
            {role}
          </p>
        </div>
      </div>
    </article>
  );
}
