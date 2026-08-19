import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import {
  CONTACT_BENEFITS,
  CONTACT_CHANNELS,
  CONTACT_SUPPORT_HOURS,
} from "@/data/contact";
import { cn } from "@/lib/utils";

interface ContactOfficeSupportSectionProps {
  className?: string;
}

export function ContactOfficeSupportSection({ className }: ContactOfficeSupportSectionProps) {
  return (
    <section
      className={cn(
        "home-section-spacing bg-section-white home-on-light",
        className
      )}
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          <div className="rounded-[8px] border flex flex-col justify-between shadow-sm shadow-orange-500/60 border-[#fbdfd1] bg-[#fdf8f5a0] overflow-hidden">
            <div className="p-5 md:p-6">
              <h2 className="text-h3 font-montserrat font-semibold text-neutral-900">Our Office</h2>
              <p className="mt-3 flex items-start gap-2.5 text-body text-neutral-600 leading-relaxed">
                <Icon src="/assets/icons/location.svg" size={18} className="mt-0.5 text-orange-500" />
                <span>{CONTACT_CHANNELS.address}</span>
              </p>
            </div>
            <iframe
              title="Rodha office location"
              src={CONTACT_CHANNELS.mapEmbedSrc}
              className="h-[240px] md:h-[300px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col gap-5">
            <article className="rounded-[6px] border shadow-sm shadow-[#fbdfd1]/50 border-[#fbdfd1] bg-[#fdf8f5a0] p-5 md:p-6">
              <div className="flex items-center gap-2">
                <Icon src="/assets/icons/clock.svg" size={20} className="text-orange-500" />
                <h3 className="text-h4 font-montserrat font-semibold text-neutral-900">
                  Support Hours
                </h3>
              </div>
              <ul className="mt-4 space-y-3">
                {CONTACT_SUPPORT_HOURS.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center justify-between gap-3 border-b border-[#fbeee7] pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-body-sm text-neutral-600">{row.label}</span>
                    <span className="text-body-sm font-semibold text-neutral-900">{row.value}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-body-sm text-neutral-500 italic">
                We are available on all major holidays too!
              </p>
            </article>

            <article className="rounded-[6px] border shadow-sm shadow-[#fbdfd1]/50 border-[#fbdfd1] bg-[#fdf8f5a0] p-5 md:p-6">
              <div className="flex items-center gap-2">
                <Icon src="/assets/icons/star.svg" size={20} className="text-orange-500" />
                <h3 className="text-h4 font-montserrat font-semibold text-neutral-900">
                  Why Contact Rodha?
                </h3>
              </div>
              <ul className="mt-4 space-y-3">
                {CONTACT_BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5">
                    <Icon
                      src="/assets/icons/check.svg"
                      size={16}
                      className="mt-0.5 text-orange-500"
                    />
                    <span className="text-body-sm text-neutral-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </Container>
    </section>
  );
}
