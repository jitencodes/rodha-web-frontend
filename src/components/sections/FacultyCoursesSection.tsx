import { cn } from "@/lib/utils";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { CategoryCoursesSlider } from "@/components/sections/CategoryCoursesSlider";
import { getFacultyHonorific, getCoursesForFaculty } from "@/data/faculty";
import { getCategoryPath } from "@/lib/constants";
import type { Faculty } from "@/lib/types";

interface FacultyCoursesSectionProps {
  faculty: Faculty;
  className?: string;
}

export function FacultyCoursesSection({
  faculty,
  className,
}: FacultyCoursesSectionProps) {
  const courses = getCoursesForFaculty(faculty);
  if (!courses.length) return null;

  const honorific = getFacultyHonorific(faculty);
  const viewAllHref = getCategoryPath(faculty.categories[0] ?? "cat");

  return (
    <section
      className={cn("home-section-spacing bg-section-beige home-on-light", className)}
    >
      <div className="container-rodha">
        <RevealGroup>
          <div className="reveal-child reveal-delay-1">
            <SectionHeaderV2
              badge={"Courses"}
              title={`Courses Taught by ${honorific}`}
              // viewAllHref={viewAllHref}
              align="center"
              // viewAllLabel="View All Courses"
            />
          </div>
          <div className="reveal-child reveal-delay-2 mt-5">
            <CategoryCoursesSlider courses={courses} />
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
