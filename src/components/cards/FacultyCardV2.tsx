import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { parseExperienceYears } from "@/data/faculty";
import type { Faculty } from "@/lib/types";

interface FacultyCardV2Props {
  faculty: Faculty;
  className?: string;
  /** `detail` — wider light card with bio + View Profile for course detail */
  variant?: "default" | "detail";
}

/** Light vertical faculty card for MBA (white on peach; no ratings). */
export function FacultyCardV2({
  faculty,
  className,
  variant = "default",
}: FacultyCardV2Props) {
  const expYears = parseExperienceYears(faculty.experience);
  const subject = faculty.specialization[0] ?? faculty.title;
  const experienceLabel =
    expYears > 0 ? `${expYears}+ years experience` : faculty.experience;
  const isDetail = variant === "detail";

  if (isDetail) {
    return (
      <article
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-[6px] border border-section-beige bg-white shadow-sm shadow-orange-500/5 hover-shine",
          className
        )}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FFF8F1]">
          <Image
            src={
              faculty.image || "/assets/images/placeholders/faculty-avatar.svg"
            }
            alt={faculty.name}
            fill
            className="object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-h4 font-semibold leading-snug text-neutral-900">
            {faculty.name}
          </h3>
          <p className="mt-1 text-body-sm font-medium text-orange-500">
            {subject}
          </p>
          <p className="mt-1 text-caption text-neutral-500">{experienceLabel}</p>
          <p className="mt-3 line-clamp-3 text-body-sm leading-relaxed text-neutral-600">
            {faculty.bio}
          </p>
          <Link
            href={`/faculty/${faculty.slug}`}
            className="mt-auto inline-flex items-center gap-2 pt-4 text-body-sm font-semibold text-orange-500 hover:text-orange-600 hover:gap-3 transition-all"
          >
            View Profile
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
      </article>
    );
  }

  return (
    <Link
      href={`/faculty/${faculty.slug}`}
      className={cn(
        "group flex w-[210px] sm:w-[200px] md:w-[204px] shrink-0 flex-col overflow-hidden rounded-[6px] border border-white/80 bg-white shadow-sm my-1 hover-shine",
        className
      )}
    >
      <div className="relative h-[180px] sm:h-[190px] overflow-hidden bg-[#FFF8F1]">
        <Image
          src={faculty.image || "/assets/images/placeholders/faculty-avatar.svg"}
          alt={faculty.name}
          fill
          className="object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="230px"
        />
      </div>

      <div className="flex flex-1 flex-col bg-white px-3.5 py-3 md:px-4 md:py-3.5">
        <h3 className="truncate text-body font-semibold leading-snug text-neutral-900">
          {faculty.name}
        </h3>
        <p className="mt-1 truncate text-caption font-medium text-orange-500">
          {subject}
        </p>
        <p className="mt-1 truncate text-caption text-neutral-500">
          {experienceLabel}
        </p>
      </div>
    </Link>
  );
}
