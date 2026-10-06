"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { CourseCardV2 } from "@/components/cards/CourseCardV2";
import { Carousel } from "@/components/ui/Carousel";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { Tag } from "@/components/ui/Tag";
import type { PackageFilterOption } from "@/lib/api/modules/packages/types";
import {
  packageBuyNowHref,
  packageDetailHref,
  packageViewCourseHref,
} from "@/lib/packages/buy-now";
import type { Course } from "@/lib/types";
import { cn } from "@/lib/utils";

export type CategoryCourseCard = Course & {
  packageId?: number | null;
  isSelfEnrolled?: boolean;
};

interface CategoryCoursesSliderProps {
  courses: CategoryCourseCard[];
  /** subCategory1 master options — filter key `type` → API `subCategory1` */
  courseTypeOptions?: PackageFilterOption[];
  /** Active subCategory1 value */
  activeType?: string;
}

export function CategoryCoursesSlider({
  courses,
  courseTypeOptions = [],
  activeType = "all",
}: CategoryCoursesSliderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const showFilterBar = courseTypeOptions.length > 0;
  const filters = [
    { value: "all", label: "All" },
    ...courseTypeOptions,
  ];

  function setType(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete("type");
    } else {
      params.set("type", value);
    }
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}#courses` : `${pathname}#courses`);
    });
  }

  if (courses.length === 0 && !showFilterBar) return null;

  return (
    <div>
      {showFilterBar && (
        <div
          className="mb-6 flex max-w-full justify-center gap-2 overflow-x-auto scrollbar-hide pb-1 md:mb-8"
          role="tablist"
          aria-label="Filter courses by type"
        >
          {filters.map((filter) => {
            const isActive = activeType === filter.value;
            return (
              <Tag
                key={filter.value}
                variant="light"
                active={isActive}
                onClick={() => setType(filter.value)}
                className={cn("shrink-0 px-4 py-2")}
              >
                {filter.label}
              </Tag>
            );
          })}
        </div>
      )}

      {courses.length === 0 ? (
        <p className="py-10 text-center text-body-sm text-neutral-500">
          No courses in this category yet. Try another filter.
        </p>
      ) : (
        <RevealGroup>
          <Carousel key={activeType} showArrows>
            {courses.map((course, index) => {
              const isSelfEnrolled = course.isSelfEnrolled === true;
              const href = isSelfEnrolled
                ? packageViewCourseHref(course.packageId ?? null)
                : course.packageId != null
                  ? packageBuyNowHref(course.packageId, course.slug)
                  : packageDetailHref(course.slug);
              return (
                <div
                  key={course.id}
                  className={`h-full min-w-0 shrink-0 snap-start basis-full sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-3.75rem)/4)] reveal-child reveal-delay-${(index % 4) + 1}`}
                >
                  <CourseCardV2
                    course={course}
                    className="h-full bg-white"
                    href={href}
                    ctaLabel={
                      isSelfEnrolled
                        ? "View Course"
                        : course.detailsLabel || "Buy Now"
                    }
                  />
                </div>
              );
            })}
          </Carousel>
        </RevealGroup>
      )}
    </div>
  );
}
