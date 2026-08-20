"use client";

import { useMemo, useState } from "react";
import { CourseCardV2 } from "@/components/cards/CourseCardV2";
import { Carousel } from "@/components/ui/Carousel";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { Tag } from "@/components/ui/Tag";
import {
  filterCoursesByType,
  getVisibleCourseFilters,
  type CourseFilterId,
} from "@/lib/course-filters";
import type { Course } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryCoursesSliderProps {
  courses: Course[];
}

export function CategoryCoursesSlider({ courses }: CategoryCoursesSliderProps) {
  const visibleFilters = useMemo(
    () => getVisibleCourseFilters(courses),
    [courses]
  );
  const showFilterBar = visibleFilters.length > 0;

  const [activeFilter, setActiveFilter] = useState<CourseFilterId>("all");

  const filteredCourses = useMemo(() => {
    if (!showFilterBar) return courses;
    return filterCoursesByType(courses, activeFilter);
  }, [courses, activeFilter, showFilterBar]);

  if (courses.length === 0) return null;

  return (
    <div>
      {showFilterBar && (
        <div
          className="mb-6 flex max-w-full justify-center gap-2 overflow-x-auto scrollbar-hide pb-1 md:mb-8"
          role="tablist"
          aria-label="Filter courses by type"
        >
          {visibleFilters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <Tag
                key={filter.id}
                variant="light"
                active={isActive}
                onClick={() => setActiveFilter(filter.id)}
                className={cn("shrink-0 px-4 py-2")}
              >
                {filter.label}
              </Tag>
            );
          })}
        </div>
      )}

      {filteredCourses.length === 0 ? (
        <p className="py-10 text-center text-body-sm text-neutral-500">
          No courses in this category yet. Try another filter.
        </p>
      ) : (
        <RevealGroup>
          <Carousel key={activeFilter} showArrows>
            {filteredCourses.map((course, index) => (
              <div
                key={course.id}
                className={`h-full min-w-0 shrink-0 snap-start basis-full sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-3.75rem)/4)] reveal-child reveal-delay-${(index % 4) + 1}`}
              >
                <CourseCardV2 course={course} className="h-full bg-white" />
              </div>
            ))}
          </Carousel>
        </RevealGroup>
      )}
    </div>
  );
}
