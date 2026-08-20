import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { CONTACT_CHANNELS } from "@/data/contact";
import { cn } from "@/lib/utils";

interface ContactInfoStripProps {
  className?: string;
}

const CHANNEL_CARDS = [
  {
    id: "call",
    title: "Call Us",
    value: CONTACT_CHANNELS.phone,
    href: CONTACT_CHANNELS.phoneHref,
    note: CONTACT_CHANNELS.phoneHours,
    icon: "/assets/icons/phone.svg",
    external: false,
  },
  {
    id: "whatsapp",
    title: "WhatsApp",
    value: CONTACT_CHANNELS.whatsapp,
    href: CONTACT_CHANNELS.whatsappHref,
    note: CONTACT_CHANNELS.whatsappNote,
    icon: "/assets/icons/whatsapp.svg",
    external: true,
  },
  {
    id: "email",
    title: "Email Us",
    value: CONTACT_CHANNELS.email,
    href: CONTACT_CHANNELS.emailHref,
    note: CONTACT_CHANNELS.emailNote,
    icon: "/assets/icons/email.svg",
    external: false,
  },
] as const;

export function ContactInfoStrip({ className }: ContactInfoStripProps) {
  return (
    <section
    id="contact-form"
    className={cn(
      "relative bg-white lg:h-5 pt-10 lg:pt-0",
      className
    )}
    >
      <Container>
        <div className="rounded-xl border shadow-sm shadow-[#fbdfd1]/50 border-[#fbdfd1] lg:-translate-y-1/2 bg-white p-5 md:p-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
            {CHANNEL_CARDS.map((card) => (
              <a
                key={card.id}
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                className="flex items-start gap-3 group"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                  <Icon src={card.icon} size={20} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-body font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors">{card.title}</h3>
                  <p className="mt-0.5 text-body-sm font-medium text-orange-500 break-all">
                    {card.value}
                  </p>
                  <p className="mt-0.5 text-caption text-neutral-500">{card.note}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
