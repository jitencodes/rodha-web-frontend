import { Container } from "@/components/layout/Container";
import { SectionHeaderV2 } from "../SectionHeaderV2";
import { FAQ_DATA_HOME } from "@/data/faq";
import { AccordionV2 } from "@/components/ui/AccordionV2";

export function HomeFAQSection() {
  return (
    <section
      id="results"
      data-home-zone="results"
      className="home-section-spacing relative overflow-hidden bg-white"
    >
      <Container>
      <SectionHeaderV2
          title={"Frequently Asked Questions"}
          // subtitle="Comprehensive preparation for every competitive exam"
          className="mx-auto lg:!mb-10"
          align="center"
          badge="GOOD TO KNOW"
        />
        <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">

                <AccordionV2
                // key={`${activeCategory}-${safePage}-${query}`}
                items={FAQ_DATA_HOME.map(({ id, question, answer }) => ({
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