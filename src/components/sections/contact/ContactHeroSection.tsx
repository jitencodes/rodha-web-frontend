import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Icon } from "@/components/ui/Icon";
import { CounsellingCtaButton } from "@/components/ui/CounsellingCtaButton";
import { ContactForm } from "@/components/forms/ContactForm";
import { CONTACT_HERO } from "@/data/contact";
import { cn } from "@/lib/utils";
import { HomeHeroShell } from "../home/HomeHeroShell";

interface ContactHeroSectionProps {
  className?: string;
}

export function ContactHeroSection({ className }: ContactHeroSectionProps) {
  return (
    <HomeHeroShell className="!pt-0">
      <section
        id="contact-form"
        className={cn(
          "relative overflow-hidden py-6 md:py-8 lg:py-10",
          className
        )}
      >

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-6">
              <Breadcrumb
                className="pt-0 pb-4 md:pb-5"
                items={[
                  { label: "Home", href: "/" },
                  { label: "Contact Us" },
                ]}
              />
              <p className="text-body-sm uppercase tracking-wider text-orange-500 font-semibold mb-2">
                {CONTACT_HERO.eyebrow}
              </p>
              <h1 className="text-[32px] sm:text-[38px] md:text-[42px] font-montserrat font-bold leading-[1.15] tracking-tight text-text-primary">
                {CONTACT_HERO.titleBefore}{" "} <br />
                <span className="text-orange-500">{CONTACT_HERO.titleHighlight}</span>
              </h1>
              <p className="mt-4 max-w-md text-body-lg text-text-secondary leading-relaxed">
                {CONTACT_HERO.description}
              </p>

              <div className="mt-8 flex w-fit flex-row items-start gap-4 rounded-[6px] border border-orange-500/25 bg-bg-secondary/80 p-4">
                <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[6px] bg-orange-500/15 text-orange-400">
                    <Icon src="/assets/icons/phone.svg" size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-body font-semibold text-text-primary">Prefer to talk?</p>
                    <p className="mt-0.5 text-body-sm text-text-muted max-w-[180px] mb-4">
                      Request a callback and a counsellor will reach you.
                    </p>
                    <CounsellingCtaButton className="btn-primary btn-primary-premium premium-border-glow glow-accent-orange text-body-sm px-4 py-2.5 rounded-[6px] whitespace-nowrap w-full sm:w-auto shrink-0">
                      Request Callback
                    </CounsellingCtaButton>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-[8px] border border-white/15 bg-bg-secondary/90 p-4 md:p-5 backdrop-blur-sm">
                <h2 className="text-h4 font-montserrat font-semibold text-text-primary mb-4">
                  Send us a message
                </h2>
                <ContactForm variant="dark" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </HomeHeroShell>
  );
}
