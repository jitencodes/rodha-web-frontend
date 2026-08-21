import { Container } from "@/components/layout/Container";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { TestimonialCardV2 } from "@/components/sections/home/Testimonials/TestimonialCardV2";
import { InfiniteMarquee } from "@/components/ui/infiniteMarquee";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { FacultyIcon } from "@/lib/faculty-icons";
import { HERO_TRUST_STATS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";

interface CourseTestimonialsSectionProps {
  testimonials: Testimonial[];
  className?: string;
}

/** Infinite marquee testimonials — fixed-width light cards, section spacing preserved. */
export function CourseTestimonialsSection({
  testimonials,
  className,
}: CourseTestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  const rating =
    HERO_TRUST_STATS.find((stat) =>
      stat.label.toLowerCase().includes("rating")
    ) ?? HERO_TRUST_STATS[1];

  return (
    <section
      className={cn(
        "home-section-spacing bg-section-white home-on-light",
        className
      )}
    >
      <Container>
        <SectionHeaderV2
          badge="REVIEWS"
          title="What Our Students Say"
          align="center"
          className="mx-auto lg:!mb-6"
        />
        {rating && (
          <p className="mb-8 flex items-center justify-center gap-2 text-body font-semibold text-neutral-800">
            <FacultyIcon name="star" size={16} className="text-orange-500" />
            <span>
              {rating.value}
              {rating.suffix ?? ""} Google Rating
            </span>
          </p>
        )}
        <RevealGroup>
          <div className="overflow-hidden">
            <InfiniteMarquee speed={35} direction="left" gap={20}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`w-[300px] shrink-0 reveal-child reveal-delay-${(index % 4) + 1}`}
                >
                  <TestimonialCardV2
                    testimonial={testimonial}
                    variant="light"
                  />
                </div>
              ))}
            </InfiniteMarquee>
          </div>
        </RevealGroup>
      </Container>
    </section>
  );
}
