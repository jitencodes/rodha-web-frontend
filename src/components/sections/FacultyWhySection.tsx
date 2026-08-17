import { Container } from "@/components/layout/Container";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { ValuePropCard } from "@/components/cards/ValuePropCard";
import { FACULTY_WHY_PROPS } from "@/data/faculty";

export function FacultyWhySection() {
  return (
    <section className="home-section-spacing bg-bg-primary">
      <Container>
        <SectionHeader
          title={
            <>
              Why Learn From{" "}
              <span className="text-orange-500">Rodha Faculty</span>
            </>
          }
          subtitle="Expert mentors who combine deep subject knowledge with proven teaching methods."
          align="center"
        />
        <RevealGroup>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {FACULTY_WHY_PROPS.map((prop, index) => (
              <div
                key={prop.id}
                className={`reveal-child reveal-delay-${(index % 4) + 1}`}
              >
                <ValuePropCard
                  icon={prop.icon}
                  title={prop.title}
                  description={prop.description}
                />
              </div>
            ))}
          </div>
        </RevealGroup>
      </Container>
    </section>
  );
}
