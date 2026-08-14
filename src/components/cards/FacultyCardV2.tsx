import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { parseExperienceYears } from "@/data/faculty";
import type { Faculty } from "@/lib/types";

interface FacultyCardV2Props {
  faculty: Faculty;
  className?: string;
}

/** Light vertical faculty card for MBA (white on peach; no ratings). */
export function FacultyCardV2({ faculty, className }: FacultyCardV2Props) {
  const expYears = parseExperienceYears(faculty.experience);
  const subject = faculty.specialization[0] ?? faculty.title;
  const experienceLabel =
    expYears > 0 ? `${expYears}+ years experience` : faculty.experience;

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
