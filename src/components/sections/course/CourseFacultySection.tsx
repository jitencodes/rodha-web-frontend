import { Container } from "@/components/layout/Container";
import { FacultyCardV2 } from "@/components/cards/FacultyCardV2";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { Carousel } from "@/components/ui/Carousel";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { cn } from "@/lib/utils";
import type { Faculty } from "@/lib/types";

interface CourseFacultySectionProps {
  faculty: Faculty[];
  className?: string;
}

/** Horizontal faculty carousel — same card style as category landings. */
export function CourseFacultySection({
  faculty,
  className,
}: CourseFacultySectionProps) {
  if (faculty.length === 0) return null;

  return (
    <section
      className={cn(
        "home-section-spacing bg-section-beige home-on-light",
        className
      )}
    >
      <Container>
        <SectionHeaderV2
          badge="MENTORS"
          title="Faculty for this Course"
          align="center"
          className="mx-auto lg:!mb-10"
        />
        <RevealGroup>
          <Carousel showArrows itemClassName="gap-3">
            {faculty.map((member, index) => (
              <div
                key={member.id}
                className={`h-full min-w-0 shrink-0 snap-start basis-[210px] sm:basis-[204px] reveal-child reveal-delay-${(index % 4) + 1}`}
              >
                <FacultyCardV2 faculty={member} className="!my-0" />
              </div>
            ))}
          </Carousel>
        </RevealGroup>
      </Container>
    </section>
  );
}
