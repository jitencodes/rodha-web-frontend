import { Container } from "@/components/layout/Container";
import { CounsellingCtaAction } from "@/components/sections/CounsellingCtaAction";
import { Icon } from "@/components/ui/Icon";
import { ABOUT_FINAL_CTA } from "@/data/about";
import { cn } from "@/lib/utils";

interface AboutFinalCtaSectionProps {
  className?: string;
}

export function AboutFinalCtaSection({ className }: AboutFinalCtaSectionProps) {
  return (
    <section
      className={cn(
        "home-section-spacing bg-section-beige home-on-light",
        className
      )}
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-body-sm uppercase tracking-wider text-orange-500 font-semibold">
            {ABOUT_FINAL_CTA.eyebrow}
          </p>
          <h2 className="mt-3 text-h2 md:text-h1 font-montserrat font-semibold text-neutral-900 leading-tight">
            {ABOUT_FINAL_CTA.title}
          </h2>
          <p className="mt-3 text-body-lg text-neutral-600">
            {ABOUT_FINAL_CTA.description}
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <CounsellingCtaAction
              action={{ label: "Book Free Counselling", href: "/contact" }}
              className="btn-primary btn-primary-premium premium-border-glow glow-accent-orange text-body px-7 py-3.5 rounded-[6px]"
            />
            <CounsellingCtaAction
              action={{ label: "Explore Courses", href: "/category/cat" }}
              className="btn-view-all btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline inline-flex items-center justify-center gap-1.5 text-body px-7 py-3.5 min-h-[48px]"
            >
              Explore Courses
              <Icon src="/assets/icons/arrow-right.svg" size={14} className="text-orange-500" />
            </CounsellingCtaAction>
          </div>
        </div>
      </Container>
    </section>
  );
}
