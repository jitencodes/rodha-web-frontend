import Link from "next/link";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { CATEGORIES, getCategoryPath } from "@/lib/constants";
import type { Course } from "@/lib/types";

interface CourseCardProps {
  course: Course;
  className?: string;
}

const CATEGORY_BG: Record<string, string> = {
  mba: "linear-gradient(145deg, rgba(249,115,22,0.55) 0%, rgba(194,65,12,0.35) 55%, rgba(17,17,17,0.95) 100%)",
  ipmat:
    "linear-gradient(145deg, rgba(168,85,247,0.55) 0%, rgba(126,34,206,0.35) 55%, rgba(17,17,17,0.95) 100%)",
  clat: "linear-gradient(145deg, rgba(217,119,6,0.55) 0%, rgba(146,64,14,0.35) 55%, rgba(17,17,17,0.95) 100%)",
  banking:
    "linear-gradient(145deg, rgba(101,131,29,0.55) 0%, rgba(74,97,21,0.35) 55%, rgba(17,17,17,0.95) 100%)",
  skillhouse:
    "linear-gradient(145deg, rgba(249,115,22,0.55) 0%, rgba(194,65,12,0.35) 55%, rgba(17,17,17,0.95) 100%)",
};

export function CourseCard({ course, className }: CourseCardProps) {
  const hasDiscount = course.originalPrice && course.originalPrice > course.price;
  const discountPercent = hasDiscount
    ? Math.round(((course.originalPrice! - course.price) / course.originalPrice!) * 100)
    : 0;

  const accent =
    CATEGORIES.find((c) => c.id === course.category)?.color || "#F97316";

  const badgeVariant =
    course.badge === "Bestseller"
      ? "primary"
      : course.badge === "New" || course.badge === "Popular"
        ? "danger"
        : course.badge === "Trending"
          ? "info"
          : course.badge === "Starter"
            ? "success"
            : "purple";

  return (
    <div
      className={cn(
        "relative overflow-hidden group rounded-[6px] min-h-[260px] border-0 card-premium-hover premium-border-glow hover-shine",
        className
      )}
      style={{
        background: CATEGORY_BG[course.category] || CATEGORY_BG.mba,
        boxShadow: `inset 0 0 0 1px ${accent}40`,
        ["--glow-base" as string]: `${accent}24`,
        ["--glow-peak" as string]: `${accent}B3`,
      }}
    >
      <div className="relative z-10 p-4 md:p-5 flex flex-col h-full pr-[38%]">
        {course.badge && (
          <div className="mb-3">
            <Badge variant={badgeVariant} size="sm">
              {course.badge}
            </Badge>
          </div>
        )}

        <h3 className="text-h4 font-semibold text-white leading-snug line-clamp-2">
          {course.title}
        </h3>

        <div className="mt-3 flex flex-col gap-1.5 text-caption text-white/75">
          <span className="flex items-center gap-1.5">
            <Icon src="/assets/icons/clock.svg" size={12} className="text-white/75" />
            {course.duration}
            {course.mode && <> · {course.mode}</>}
          </span>
          {course.classCount && (
            <span className="flex items-center gap-1.5">
              <Icon src="/assets/icons/book.svg" size={12} className="text-white/75" />
              {course.classCount} Hrs Classes
            </span>
          )}
          {course.studentsEnrolled && (
            <span className="flex items-center gap-1.5 text-white font-medium">
              <Icon src="/assets/icons/users.svg" size={12} className="text-white" />
              {course.studentsEnrolled}
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 flex flex-col gap-2">
          <div className="flex items-baseline gap-2 flex-wrap transition-[filter,transform] duration-300 group-hover:translate-x-0.5 group-hover:brightness-110">
            <span className="text-h4 font-bold text-white">
              {formatPrice(course.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-body-sm text-white/50 line-through">
                  {formatPrice(course.originalPrice!)}
                </span>
                <span className="text-caption font-semibold text-white">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>
          <Link
            href={`${getCategoryPath(course.category)}/courses/${course.slug}`}
            className="text-body-sm font-semibold text-white hover:text-white/80 transition-colors"
          >
            Enroll →
          </Link>
        </div>
      </div>

      {course.facultyImage && (
        <div className="absolute right-0 bottom-0 top-8 w-[42%] pointer-events-none transition-transform duration-300 ease-out group-hover:-translate-y-1">
          <Image
            src={course.facultyImage}
            alt=""
            fill
            className="object-contain object-bottom"
            sizes="160px"
          />
        </div>
      )}
    </div>
  );
}
