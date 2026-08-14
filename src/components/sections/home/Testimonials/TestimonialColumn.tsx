import type { CSSProperties } from "react";
import { VerticalMarquee } from "@/components/ui/VerticalMarquee";
import { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TestimonialCardV2 } from "./TestimonialCardV2";

function TestimonialColumn({
  testimonials,
  direction,
  className,
  fadeFrom = "var(--background, #0A0A0A)",
}: {
  testimonials: Testimonial[];
  direction: "up" | "down";
  className?: string;
  /** CSS color used for top/bottom fades. Default keeps dark category pages. */
  fadeFrom?: string;
}) {
  const fadeStyle = { "--testimonial-fade": fadeFrom } as CSSProperties;

  return (
    <div
      className={cn("relative h-full overflow-hidden", className)}
      style={fadeStyle}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-gradient-to-b from-[var(--testimonial-fade)] via-[color-mix(in_srgb,var(--testimonial-fade)_80%,transparent)] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-[var(--testimonial-fade)] via-[color-mix(in_srgb,var(--testimonial-fade)_80%,transparent)] to-transparent" />

      <VerticalMarquee
        speed={36}
        direction={direction}
        gap={24}
        className="h-full pr-1"
      >
        {testimonials.map((testimonial) => (
          <TestimonialCardV2
            key={testimonial.id}
            testimonial={testimonial}
          />
        ))}
      </VerticalMarquee>
    </div>
  );
}

export default TestimonialColumn;
