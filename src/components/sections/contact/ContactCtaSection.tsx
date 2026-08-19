import { Container } from "@/components/layout/Container";
import { CounsellingCtaAction } from "@/components/sections/CounsellingCtaAction";
import { CONTACT_CTA } from "@/data/contact";
import { cn } from "@/lib/utils";

interface ContactCtaSectionProps {
  className?: string;
}

export function ContactCtaSection({ className }: ContactCtaSectionProps) {
  return (
    <section className={cn("home-section-spacing bg-section-beige pt-6 md:pt-8", className)}>
      <Container>
        <div className="relative overflow-hidden rounded-[8px] border border-orange-500/30 bg-bg-secondary px-5 py-8 md:px-8 md:py-10">
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.28)_0%,transparent_70%)]"
            aria-hidden
          />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
            <div className="min-w-0 flex-1">
              <h2 className="text-h3 md:text-h2 font-montserrat font-semibold text-text-primary leading-tight">
                {CONTACT_CTA.title}
              </h2>
              <p className="mt-2 text-body text-text-muted max-w-xl">{CONTACT_CTA.subtitle}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <CounsellingCtaAction
                action={{ label: "Book Free Counselling", href: "/contact" }}
                className="btn-primary btn-primary-premium premium-border-glow glow-accent-orange text-body-sm px-5 py-2.5 rounded-[6px] whitespace-nowrap text-center"
              />
              <CounsellingCtaAction
                action={{ label: "Explore Courses", href: "/category/cat" }}
                className="btn-outlined-premium premium-border-glow glow-accent-silver shine-sweep shine-sweep-outline inline-flex items-center justify-center text-body-sm px-5 py-2.5 rounded-[6px] whitespace-nowrap bg-transparent border border-white text-white hover:bg-white/10"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
