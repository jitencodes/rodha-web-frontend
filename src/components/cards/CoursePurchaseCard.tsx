import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { cn, formatPrice } from "@/lib/utils";
import type { Course } from "@/lib/types";

interface CoursePurchaseCardProps {
  course: Course;
  categoryLabel: string;
  className?: string;
}

/** Compact sticky purchase card — image, essentials, price, Buy Now. */
export function CoursePurchaseCard({
  course,
  categoryLabel,
  className,
}: CoursePurchaseCardProps) {
  const posterSrc =
    course.thumbnail ||
    course.image ||
    "/assets/images/placeholders/course-thumb.svg";
  const enrollHref = course.externalLink || course.enrollmentUrl || "#";

  return (
    <aside
      className={cn(
        "flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-[6px] border border-section-beige bg-white shadow-sm shadow-orange-500/10",
        className
      )}
    >
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[#FFF8F1]">
        <Image
          src={posterSrc}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 340px"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 md:p-5">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="default"
            className="rounded-full border-neutral-800 bg-neutral-800 text-[10px] uppercase tracking-wide text-white"
          >
            {categoryLabel}
          </Badge>
          {course.language && (
            <Badge
              variant="outline"
              className="rounded-full border-section-beige! bg-transparent! text-[10px] uppercase tracking-wide text-neutral-600!"
            >
              {course.language}
            </Badge>
          )}
        </div>

        <h2 className="mt-2.5 line-clamp-2 text-h4 font-semibold leading-snug text-neutral-900">
          {course.title}
        </h2>

        {(course.shortDescription || course.description) && (
          <p className="mt-1.5 line-clamp-2 text-body-sm text-neutral-600">
            {course.shortDescription || course.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-neutral-500">
          {course.duration && <span>{course.duration}</span>}
          {course.mode && (
            <>
              {course.duration && <span aria-hidden>·</span>}
              <span>{course.mode}</span>
            </>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-end gap-2">
          <span className="text-[1.5rem] font-bold leading-none text-orange-500">
            {course.price === 0 ? "FREE" : formatPrice(course.price)}
          </span>
          {course.originalPrice != null &&
            course.originalPrice > course.price && (
              <span className="text-body-sm text-neutral-400 line-through">
                {formatPrice(course.originalPrice)}
              </span>
            )}
        </div>

        <a
          href={enrollHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary-premium premium-border-glow glow-accent-orange mt-4 inline-flex h-11 w-full shrink-0 items-center justify-center rounded-md bg-orange-500 px-6 text-body font-semibold text-white hover:bg-orange-600"
        >
          {course.price === 0 ? "Start Free" : "Buy Now"}
        </a>
      </div>
    </aside>
  );
}
