import { FacultyIcon } from "@/lib/faculty-icons";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { CourseCurriculumAccordion } from "@/components/sections/course/CourseCurriculumAccordion";
import { cn } from "@/lib/utils";
import type { Course } from "@/lib/types";

interface CourseDetailsCurriculumSectionProps {
  course: Course;
  className?: string;
}

export function CourseDetailsCurriculumSection({
  course,
  className,
}: CourseDetailsCurriculumSectionProps) {
  const detailRows = [
    { label: "For", value: course.exam, icon: "book" },
    { label: "Duration", value: course.duration, icon: "play" },
    { label: "Mode", value: course.mode, icon: "students" },
    { label: "Level", value: course.level, icon: "star" },
  ].filter((row) => Boolean(row.value));

  return (
    <section className={cn("space-y-10 md:space-y-12", className)}>
      <div>
        <SectionHeaderV2
          badge="OVERVIEW"
          title="Course Details"
          className="!mb-6"
        />
        <p className="max-w-3xl text-body leading-relaxed text-neutral-600">
          {course.description}
        </p>
        {detailRows.length > 0 && (
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {detailRows.map((row) => (
              <li
                key={row.label}
                className="flex items-start gap-3 rounded-[6px] border border-section-beige bg-white p-4"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                  <FacultyIcon name={row.icon} size={16} />
                </span>
                <span>
                  <span className="block text-caption uppercase tracking-wider text-neutral-500 font-semibold">
                    {row.label}
                  </span>
                  <span className="mt-0.5 block text-body font-medium text-neutral-900">
                    {row.value}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
        {course.details && course.details.length > 0 && (
          <ul className="mt-4 space-y-2">
            {course.details.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-body-sm text-neutral-600"
              >
                <span className="mt-0.5 text-orange-500">
                  <FacultyIcon name="check" size={12} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {course.modules && course.modules.length > 0 && (
        <div>
          <SectionHeaderV2
            badge="SYLLABUS"
            title="Curriculum / Modules"
            className="!mb-6"
          />
          <CourseCurriculumAccordion modules={course.modules} />
        </div>
      )}
    </section>
  );
}
