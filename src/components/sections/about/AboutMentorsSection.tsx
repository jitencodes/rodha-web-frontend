import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { FacultyCardV2 } from "@/components/cards/FacultyCardV2";
import { Carousel } from "@/components/ui/Carousel";
import {
  getCategoryFaculty,
  getCategoryLandingBySlug,
} from "@/data/category-landings";
import { faculty } from "@/data/faculty";
import { cn } from "@/lib/utils";

interface AboutMentorsSectionProps {
  className?: string;
}

export function AboutMentorsSection({ className }: AboutMentorsSectionProps) {
  const catLanding = getCategoryLandingBySlug("cat");
  const mentors = catLanding
    ? getCategoryFaculty(catLanding)
    : faculty.filter((member) => member.featured).slice(0, 9);

  if (mentors.length === 0) return null;

  return (
    <section
      className={cn(
        "home-section-spacing bg-section-beige home-on-light overflow-x-hidden",
        className
      )}
    >
      <Container>
        <SectionHeaderV2
          badge="OUR TEAM"
          title="Meet the Mentors Behind Your Success"
          align="center"
          className="mx-auto lg:!mb-10"
        />
        <Carousel showArrows>
          {mentors.map((member) => (
            <div key={member.id} className="snap-start shrink-0">
              <FacultyCardV2 faculty={member} />
            </div>
          ))}
        </Carousel>
        <div className="mt-8 flex justify-center md:mt-10">
          <Link
            href="/team"
            className="btn-view-all btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline inline-flex"
          >
            Meet the Full Team
          </Link>
        </div>
      </Container>
    </section>
  );
}
