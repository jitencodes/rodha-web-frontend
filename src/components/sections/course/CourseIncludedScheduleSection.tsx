import { Container } from "@/components/layout/Container";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { FacultyIcon } from "@/lib/faculty-icons";
import { cn } from "@/lib/utils";
import type { Course } from "@/lib/types";

interface CourseIncludedScheduleSectionProps {
  course: Course;
  className?: string;
}

const INCLUDED_ICONS = [
  "play",
  "book",
  "check",
  "star",
  "trophy",
  "students",
] as const;

export function CourseIncludedScheduleSection({
  course,
  className,
}: CourseIncludedScheduleSectionProps) {
  const included = course.included ?? [];
  const schedule = course.schedule;
  const scheduleRows = schedule
    ? [
        { label: "Next Batch Starts", value: schedule.nextBatch },
        { label: "Days", value: schedule.days },
        { label: "Class Timing", value: schedule.timing },
        { label: "Batch Duration", value: schedule.duration },
        { label: "Mode", value: schedule.mode },
      ].filter((row) => Boolean(row.value))
    : [];

  if (included.length === 0 && scheduleRows.length === 0) return null;

  return (
    <section
      className={cn(
        "home-section-spacing bg-section-white home-on-light",
        className
      )}
    >
      <Container>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10">
          {included.length > 0 && (
            <div className="flex h-full flex-col">
              <SectionHeaderV2
                badge="BENEFITS"
                title="What's Included"
                className="!mb-6 min-h-[5.5rem]"
              />
              <ul className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                {included.map((item, index) => (
                  <li
                    key={item}
                    className="flex h-full items-start gap-3 rounded-[6px] border border-section-beige bg-white p-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                      <FacultyIcon
                        name={INCLUDED_ICONS[index % INCLUDED_ICONS.length]}
                        size={16}
                      />
                    </span>
                    <span className="pt-1.5 text-body font-medium text-neutral-800">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {scheduleRows.length > 0 && (
            <div className="flex h-full flex-col">
              <SectionHeaderV2
                badge="TIMELINE"
                title="Batch / Schedule"
                className="!mb-6 min-h-[5.5rem]"
              />
              <div className="flex flex-1 flex-col overflow-hidden rounded-[6px] border border-section-beige bg-white">
                <dl className="flex flex-1 flex-col justify-between">
                  {scheduleRows.map((row, index) => (
                    <div
                      key={row.label}
                      className={cn(
                        "flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                        index > 0 && "border-t border-section-beige"
                      )}
                    >
                      <dt className="text-body-sm font-medium text-neutral-500">
                        {row.label}
                      </dt>
                      <dd className="text-body font-semibold text-neutral-900 sm:text-right">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
