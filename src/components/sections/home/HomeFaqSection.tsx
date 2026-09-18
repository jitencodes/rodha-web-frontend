import { Container } from "@/components/layout/Container";
import { SectionHeaderV2 } from "../SectionHeaderV2";
import { AccordionV2 } from "@/components/ui/AccordionV2";
import type { HomeFaqViewModel } from "@/lib/api/modules/home/types";

interface HomeFAQSectionProps {
  faqs?: HomeFaqViewModel[];
}

export function HomeFAQSection({ faqs = [] }: HomeFAQSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section
      id="faq"
      data-home-zone="faq"
      className="home-section-spacing relative overflow-hidden bg-white"
    >
      <Container>
        <SectionHeaderV2
          title={"Frequently Asked Questions"}
          className="mx-auto lg:!mb-10"
          align="center"
          badge="GOOD TO KNOW"
        />
        <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
          <AccordionV2
            items={faqs.map(({ id, question, answer }) => ({
              id,
              question,
              answer,
            }))}
            iconVariant="plus"
            className="mx-auto"
          />
        </div>
      </Container>
    </section>
  );
}
