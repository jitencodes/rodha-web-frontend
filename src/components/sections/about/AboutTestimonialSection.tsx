import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Carousel } from "@/components/ui/Carousel";
import { Icon } from "@/components/ui/Icon";
import { ABOUT_TESTIMONIAL_IDS } from "@/data/about";
import { getCategoryLandingBySlug } from "@/data/category-landings";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AboutTestimonialSectionProps {
  className?: string;
}

function FeaturedTestimonial({ testimonial }: { testimonial: Testimonial }) {
  const meta = [testimonial.exam, testimonial.year, testimonial.college]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
      <div className="lg:col-span-5">
        <div className="relative h-[200px] sm:h-[240px] lg:h-[260px] overflow-hidden rounded-[8px] bg-bg-tertiary">
          <Image
            src={testimonial.image || "/assets/images/about us/award-to-boy.png"}
            alt={testimonial.name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </div>
      <div className="lg:col-span-7">
        <Icon src="/assets/icons/quote.svg" size={36} className="text-orange-400" />
        <p className="mt-4 text-body-lg md:text-h4 font-medium leading-relaxed text-text-primary">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <p className="mt-5 text-body font-semibold text-orange-400">
          — {testimonial.name}
          {testimonial.score ? `, ${testimonial.score}` : ""}
        </p>
        {meta && (
          <p className="mt-1 text-body-sm text-text-muted">{meta}</p>
        )}
      </div>
    </article>
  );
}

export function AboutTestimonialSection({ className }: AboutTestimonialSectionProps) {
  const catLanding = getCategoryLandingBySlug("cat");
  const testimonialIds = new Set<string>(ABOUT_TESTIMONIAL_IDS);
  const testimonials =
    catLanding?.testimonials.filter((item) => testimonialIds.has(item.id)) ?? [];

  if (testimonials.length === 0) return null;

  return (
    <section
      className={cn(
        "py-10 md:py-14 relative overflow-hidden bg-bg-primary",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl"
        aria-hidden
      />
      <Container className="relative z-10">
        <Carousel showArrows>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="min-w-full w-full shrink-0 snap-start px-0 md:px-8"
            >
              <FeaturedTestimonial testimonial={testimonial} />
            </div>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
