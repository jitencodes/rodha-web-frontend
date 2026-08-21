import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { FacultyIcon } from "@/lib/faculty-icons";
import { cn } from "@/lib/utils";
import type { Course, Faculty } from "@/lib/types";

interface CourseHeroSectionProps {
  course: Course;
  categoryLabel: string;
  categoryHref: string;
  faculty: Faculty[];
  className?: string;
}

const HIGHLIGHT_ICONS = ["play", "book", "star", "students"] as const;

export function CourseHeroSection({
  course,
  categoryLabel,
  categoryHref,
  faculty,
  className,
}: CourseHeroSectionProps) {
  const highlights = course.highlights ?? [];

  return (
    <div className={cn("relative", className)}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: categoryLabel, href: categoryHref },
          { label: course.title },
        ]}
        className="py-0 pb-5 md:pb-6"
      />

      <Badge
        variant="default"
        className="rounded-full bg-white/10 text-white border-white/20 uppercase tracking-wide text-[10px] font-bold"
      >
        {categoryLabel}
      </Badge>

      <h1 className="mt-4 text-[32px] sm:text-[40px] md:text-hero font-bold leading-[1.1] tracking-tight text-text-primary">
        {course.title}
      </h1>

      {course.shortDescription && (
        <p className="mt-3 text-body-lg font-medium text-orange-400">
          {course.shortDescription.length > 120
            ? `${course.shortDescription.slice(0, 117).trimEnd()}…`
            : course.shortDescription}
        </p>
      )}

      <p className="mt-3 max-w-2xl text-body leading-relaxed text-text-muted">
        {course.description}
      </p>

      {highlights.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-3 md:gap-4">
          {highlights.slice(0, 4).map((item, index) => (
            <li
              key={item}
              className="inline-flex items-center gap-2 rounded-[6px] border border-white/10 bg-white/5 px-3 py-2 text-body-sm text-text-secondary"
            >
              <span className="text-orange-400">
                <FacultyIcon
                  name={HIGHLIGHT_ICONS[index % HIGHLIGHT_ICONS.length]}
                  size={14}
                />
              </span>
              {item}
            </li>
          ))}
        </ul>
      )}

      {faculty.length > 0 && (
        <div className="mt-7">
          <p className="text-caption uppercase tracking-wider text-text-dimmed font-semibold">
            Taught by
          </p>
          <ul className="mt-3 flex flex-wrap gap-4">
            {faculty.slice(0, 4).map((member) => (
              <li key={member.id}>
                <Link
                  href={`/faculty/${member.slug}`}
                  className="group flex items-center gap-2.5"
                >
                  <span className="relative h-10 w-10 overflow-hidden rounded-full border border-white/15 bg-bg-tertiary">
                    <Image
                      src={
                        member.image ||
                        "/assets/images/placeholders/faculty-avatar.svg"
                      }
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      sizes="40px"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-body-sm font-semibold text-text-primary group-hover:text-orange-400 transition-colors">
                      {member.name}
                    </span>
                    <span className="block truncate text-caption text-text-dimmed">
                      {member.specialization[0] ?? member.title}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {course.language && (
        <div className="mt-5">
          <Badge
            variant="outline"
            className="rounded-full bg-transparent! text-text-secondary! border-white/20! uppercase tracking-wide text-[10px]"
          >
            {course.language}
          </Badge>
        </div>
      )}
    </div>
  );
}
