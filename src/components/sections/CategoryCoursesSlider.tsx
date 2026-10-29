"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
import { Container } from "../layout/Container";

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
  /** Link to courses listing filtered by this CMS category */
  viewAllHref?: string;
}

export function CategoryCoursesSlider({
  courses,
  courseTypeOptions = [],
  activeType = "all",
  viewAllHref,
}: CategoryCoursesSliderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    scrollLeft: number;
  }>({ active: false, startX: 0, scrollLeft: 0 });

  const showFilterBar = courseTypeOptions.length > 0;
  const filters = [
    { value: "all", label: "All" },
    ...courseTypeOptions,
  ];
  const fewTabs = filters.length <= 2;

  const measureOverflow = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    setOverflowing(el.scrollWidth > el.clientWidth + 2);
  }, []);

  useEffect(() => {
    measureOverflow();
    const el = tabsRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measureOverflow());
    ro.observe(el);
    window.addEventListener("resize", measureOverflow);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureOverflow);
    };
  }, [measureOverflow, filters.length, courseTypeOptions]);

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

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = tabsRef.current;
    if (!el || !overflowing || e.pointerType === "touch") return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
    };
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = tabsRef.current;
    if (!el || !dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    el.scrollLeft = dragRef.current.scrollLeft - dx;
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const el = tabsRef.current;
    dragRef.current.active = false;
    if (el?.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
  }

  if (courses.length === 0 && !showFilterBar) return null;

  const centerTabs = fewTabs || !overflowing;

  return (
    <div>
      {showFilterBar && (
        <div
          ref={tabsRef}
          className={cn(
            "mb-6 flex max-w-full gap-2 overflow-x-auto scrollbar-hide pb-1 md:mb-8",
            centerTabs ? "justify-center" : "justify-start",
            overflowing && "cursor-grab active:cursor-grabbing"
          )}
          role="tablist"
          aria-label="Filter courses by type"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
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
              const detailHref = packageDetailHref(course.slug);
              const ctaHref = isSelfEnrolled
                ? packageViewCourseHref(course.packageId ?? null)
                : course.packageId != null
                  ? packageBuyNowHref(course.packageId, course.slug)
                  : detailHref;
              return (
                <div
                  key={course.id}
                  className={`h-full min-w-0 shrink-0 snap-start basis-full sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-3.75rem)/4)] reveal-child reveal-delay-${(index % 4) + 1}`}
                >
                  <CourseCardV2
                    course={course}
                    className="h-full bg-white"
                    href={detailHref}
                    ctaHref={ctaHref}
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

      {viewAllHref && <Container>
          <div className="mt-8 flex justify-center md:mt-10">
            <Link
              href={viewAllHref}
              className="btn-view-all btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline inline-flex"
            >
              View All courses
            </Link>
          </div>
        </Container>}

    </div>
  );
}
