import { cn } from "@/lib/utils";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { FacultyCourseCard } from "@/components/cards/FacultyCourseCard";
import type { Faculty } from "@/lib/types";

interface FacultyCoursesSectionProps {
  faculty: Faculty;
  className?: string;
}

export function FacultyCoursesSection({
  faculty,
  className,
}: FacultyCoursesSectionProps) {
  const courses = faculty.coursesTaught;
  if (!courses?.length) return null;

  const firstName = faculty.name.split(" ")[0];
  const femaleFirst = new Set([
    "Neha",
    "Megha",
    "Sana",
    "Riya",
    "Priya",
    "Aisha",
  ]);
  const honorific = femaleFirst.has(firstName)
    ? `${firstName} Ma'am`
    : `${firstName} Sir`;

  return (
    <section className={cn("home-section-spacing bg-section-beige home-on-light", className)}>
      <div className="container-rodha">
        <RevealGroup>
          <div className="reveal-child reveal-delay-1">
            <SectionHeader
              title={`Courses Taught by ${honorific}`}
              viewAllHref="https://youtube.com/@rodha"
              viewAllLabel="View All Courses →"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className={`reveal-child reveal-delay-${(index % 4) + 1} h-full`}
              >
                <FacultyCourseCard course={course} />
              </div>
            ))}
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
