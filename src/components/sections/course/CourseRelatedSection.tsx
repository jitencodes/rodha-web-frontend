import { Container } from "@/components/layout/Container";
import { CourseCardV2 } from "@/components/cards/CourseCardV2";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { Carousel } from "@/components/ui/Carousel";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { getCoursePath } from "@/data/course-details";
import { cn } from "@/lib/utils";
import type { Course } from "@/lib/types";

interface CourseRelatedSectionProps {
  relatedCourses: Course[];
  className?: string;
}

/** Related courses — same card + carousel layout as category course slider. */
export function CourseRelatedSection({
  relatedCourses,
  className,
}: CourseRelatedSectionProps) {
  if (relatedCourses.length === 0) return null;

  return (
    <section
      id="related-courses"
      className={cn(
        "home-section-spacing bg-section-beige home-on-light",
        className
      )}
    >
      <Container>
        <SectionHeaderV2
          badge="EXPLORE MORE"
          title="You May Also Like"
          align="center"
          className="mx-auto lg:!mb-10"
        />
        <RevealGroup>
          <Carousel showArrows autoPlay autoPlayInterval={3000}>
            {relatedCourses.map((course, index) => (
              <div
                key={course.id}
                className={`h-full min-w-0 shrink-0 snap-start basis-full sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-3.75rem)/4)] reveal-child reveal-delay-${(index % 4) + 1}`}
              >
                <CourseCardV2
                  course={course}
                  href={getCoursePath(course.slug)}
                  className="h-full bg-white"
                />
              </div>
            ))}
          </Carousel>
        </RevealGroup>
      </Container>
    </section>
  );
}
