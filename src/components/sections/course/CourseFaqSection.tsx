import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { AccordionV2 } from "@/components/ui/AccordionV2";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/types";

interface CourseFaqSectionProps {
  faqs: FaqItem[];
  className?: string;
}

export function CourseFaqSection({ faqs, className }: CourseFaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <section
      className={cn(
        "home-section-spacing bg-section-white home-on-light relative overflow-hidden",
        className
      )}
    >
      <Container>
        <SectionHeaderV2
          title="Frequently Asked Questions"
          badge="GOOD TO KNOW"
          align="center"
          className="mx-auto lg:!mb-10"
        />
        <AccordionV2
          items={faqs.map(({ id, question, answer }) => ({
            id,
            question,
            answer,
          }))}
          iconVariant="plus"
          className="mx-auto max-w-4xl"
        />
        <div className="mt-8 flex justify-center">
          <Link
            href="/faq"
            className="btn-view-all btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline inline-flex"
          >
            View All FAQs
          </Link>
        </div>
      </Container>
    </section>
  );
}
