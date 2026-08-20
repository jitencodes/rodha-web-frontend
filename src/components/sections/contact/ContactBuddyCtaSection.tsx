import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { CONTACT_BUDDY, CONTACT_CHANNELS } from "@/data/contact";
import { cn } from "@/lib/utils";
import { CounsellingCtaAction } from "../CounsellingCtaAction";

interface ContactBuddyCtaSectionProps {
  className?: string;
}

export function ContactBuddyCtaSection({ className }: ContactBuddyCtaSectionProps) {
  return (
    <section className={cn("home-section-spacing bg-bg-primary pt-6 md:pt-8", className)}>
      <Container>
        <div className="relative overflow-hidden rounded-[8px] border border-orange-500/25 bg-bg-secondary px-5 py-8 md:px-8 md:py-10">
          <div
            className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-orange-500/15 blur-3xl"
            aria-hidden
          />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
              <Icon src="/assets/icons/ai-buddy.svg" size={32} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body-sm uppercase tracking-wider text-orange-500 font-semibold">
                {CONTACT_BUDDY.eyebrow}
              </p>
              <h2 className="mt-1 text-h3 md:text-h2 font-montserrat font-semibold text-text-primary">
                {CONTACT_BUDDY.title}
              </h2>
              <p className="mt-2 text-body text-text-muted max-w-xl">
                {CONTACT_BUDDY.description}
              </p>
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
