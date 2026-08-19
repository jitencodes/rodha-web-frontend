import { Container } from "@/components/layout/Container";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { AccordionV2 } from "@/components/ui/AccordionV2";
import { CONTACT_FAQS } from "@/data/contact";
import { cn } from "@/lib/utils";

interface ContactFaqSectionProps {
  className?: string;
}

export function ContactFaqSection({ className }: ContactFaqSectionProps) {
  return (
    <section
      className={cn(
        "home-section-spacing bg-section-white home-on-light",
        className
      )}
    >
      <Container>
        <SectionHeaderV2
          badge="GOOD TO KNOW"
          title="Frequently Asked Questions"
          align="center"
          className="mx-auto lg:!mb-10"
        />
        <AccordionV2
          items={CONTACT_FAQS.map(({ id, question, answer }) => ({
            id,
            question,
            answer,
          }))}
          iconVariant="plus"
          className="mx-auto max-w-3xl"
        />
      </Container>
    </section>
  );
}
