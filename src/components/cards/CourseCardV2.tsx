import Link from "next/link";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { getCategoryPath } from "@/lib/constants";
import type { Course } from "@/lib/types";

interface CourseCardV2Props {
  course: Course;
  className?: string;
  /** Override card link (e.g. internal `/courses/[slug]` on course detail). */
  href?: string;
}

/** Light-theme course card for MBA category page (homepage-aligned). */
export function CourseCardV2({ course, className, href }: CourseCardV2Props) {
  const hasDiscount = course.originalPrice && course.originalPrice > course.price;
  const discountPercent = hasDiscount
    ? Math.round(((course.originalPrice! - course.price) / course.originalPrice!) * 100)
    : 0;

  const detailsHref = `${getCategoryPath(course.category)}/courses/${course.slug}`;
  const courseHref = href || course.externalLink || detailsHref;
  const isExternal = Boolean(!href && course.externalLink);
  const posterSrc =
    course.thumbnail ||
    course.facultyImage ||
    "/assets/images/placeholders/course-thumb.svg";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[6px] border border-[#FFEAD6] bg-[#FFF3E8] hover-shine hover:shadow-sm hover:shadow-orange-500/20",
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FFF3E8]">
        <Image
          src={posterSrc}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {course.badge && (
          <div className="absolute left-3 top-3 z-10">
            <Badge
              variant="primary"
              size="sm"
              className="uppercase tracking-wide text-[10px] font-bold"
            >
              {course.badge}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6 justify-between">
        <h3 className="text-h4 font-montserrat font-medium leading-tight text-neutral-900 line-clamp-2">
          {course.title}
        </h3>

        {(course.shortDescription || course.description) && (
          <p className="mt-2 line-clamp-2 text-body-sm text-neutral-600">
            {course.shortDescription || course.description}
          </p>
        )}
        <div className="mt-2 text-caption leading-relaxed text-neutral-500 flex items-center gap-1 justify-between capitalize">
          {course.caourseCount != null ? (
            <span>{course.caourseCount} Courses</span>
          ) : (
            <span />
          )}
          {course.language ? <span>{course.language}</span> : null}
        </div>
        <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
          <span className="text-[1.4rem] font-bold leading-none text-neutral-900">
            {course.price === 0 ? "FREE" : formatPrice(course.price)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-body-sm text-neutral-400 line-through">
                {formatPrice(course.originalPrice!)}
              </span>
              <span className="text-caption font-bold text-orange-500">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>

        <div className="mt-auto pt-2">
          <Link
            href={courseHref}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 hover:gap-3 transition-all duration-300 text-body-sm font-semibold text-orange-500 hover:text-orange-500/80"
          >
            {course.detailsLabel || "View Details"}
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.25 4.25a.75.75 0 010 1.08l-4.25 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
