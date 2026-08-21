import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { getInitials } from "@/lib/initials";

interface TestimonialCardV2Props {
  testimonial: Testimonial;
  className?: string;
  /** `light` for course detail / light sections; default `dark` for category marquee */
  variant?: "dark" | "light";
}

const PLACEHOLDER_IMAGE = "/assets/images/placeholders/topper-photo.svg";

function hasRealPhoto(image?: string): boolean {
  return Boolean(image) && !image!.includes("placeholders/");
}

/** Dark testimonial card (MBA testimonials restored to old black theme). */
export function TestimonialCardV2({
  testimonial,
  className,
  variant = "dark",
}: TestimonialCardV2Props) {
  const role = [testimonial.college, testimonial.exam].filter(Boolean).join(" · ");
  const showPhoto = hasRealPhoto(testimonial.image);
  const initials = getInitials(testimonial.name);
  const isLight = variant === "light";

  return (
    <article
      className={cn(
        "group flex h-full min-h-[220px] flex-col p-5 md:p-6",
        isLight
          ? "w-[300px] min-w-[300px] max-w-[300px] shrink-0 rounded-[6px] border border-section-beige bg-white shadow-sm shadow-orange-500/5 hover-shine"
          : "card-base card-premium-hover shine-sweep-hover w-[300px] sm:w-full",
        className
      )}
    >
      <div
        className={cn(
          "quote-glow flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border transition-[filter,border-color] duration-300",
          isLight
            ? "border-orange-500/20 bg-orange-500/10 text-orange-500"
            : "border-orange-500/20 bg-orange-500/15 text-orange-400 group-hover:border-orange-500/40 group-hover:brightness-125"
        )}
      >
        <Icon src="/assets/icons/quote.svg" size={18} />
      </div>

      <p
        className={cn(
          "mt-4 line-clamp-5 flex-1 text-body-sm leading-relaxed",
          isLight ? "text-neutral-600" : "text-text-secondary"
        )}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      <div
        className={cn(
          "mt-5 flex items-center gap-3 border-t pt-4",
          isLight ? "border-section-beige" : "border-border-default"
        )}
      >
        <div
          className={cn(
            "relative h-11 w-11 shrink-0 overflow-hidden rounded-full flex items-center justify-center",
            isLight
              ? "border border-section-beige bg-[#FFF8F1]"
              : "border border-border-default bg-bg-tertiary"
          )}
        >
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
            <span
              className={cn(
                "text-body-sm font-semibold",
                isLight ? "text-orange-500" : "text-orange-400"
              )}
            >
              {initials}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h4
            className={cn(
              "truncate text-body-sm font-semibold",
              isLight ? "text-neutral-900" : "text-text-primary"
            )}
          >
            {testimonial.name}
          </h4>
          <p
            className={cn(
              "mt-0.5 truncate text-caption",
              isLight ? "text-neutral-500" : "text-text-dimmed"
            )}
          >
            {role}
          </p>
        </div>
      </div>
    </article>
  );
}
