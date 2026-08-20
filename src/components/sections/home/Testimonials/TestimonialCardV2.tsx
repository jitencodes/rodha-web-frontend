import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { getInitials } from "@/lib/initials";

interface TestimonialCardV2Props {
  testimonial: Testimonial;
  className?: string;
}

const PLACEHOLDER_IMAGE = "/assets/images/placeholders/topper-photo.svg";

function hasRealPhoto(image?: string): boolean {
  return Boolean(image) && !image!.includes("placeholders/");
}

/** Dark testimonial card (MBA testimonials restored to old black theme). */
export function TestimonialCardV2({ testimonial, className }: TestimonialCardV2Props) {
  const role = [testimonial.college, testimonial.exam].filter(Boolean).join(" · ");
  const showPhoto = hasRealPhoto(testimonial.image);
  const initials = getInitials(testimonial.name);

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
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border-default bg-bg-tertiary flex items-center justify-center">
          {showPhoto ? (
            <>
              <div
                className="absolute -inset-2 bg-cover bg-center filter blur-md brightness-75 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${testimonial.image})` }}
                aria-hidden
              />
              <Image
                src={testimonial.image || PLACEHOLDER_IMAGE}
                alt={testimonial.name}
                fill
                className="object-contain object-bottom relative z-10"
                sizes="44px"
              />
            </>
          ) : (
            <span className="text-body-sm font-semibold text-orange-400">
              {initials}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="truncate text-body-sm font-semibold text-text-primary">
            {testimonial.name}
          </h4>
          <p className="mt-0.5 truncate text-caption text-text-dimmed">
            {role}
          </p>
        </div>
      </div>
    </article>
  );
}
