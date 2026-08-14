import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { parseExperienceYears } from "@/data/faculty";
import type { Faculty } from "@/lib/types";

interface FacultyCardV2Props {
  faculty: Faculty;
  className?: string;
}

/** Premium white faculty card — TopperCardV2 layout (image + gradient detail border). */
export function FacultyCardV2({ faculty, className }: FacultyCardV2Props) {
  const expYears = parseExperienceYears(faculty.experience);
  const subject = faculty.specialization[0] ?? faculty.title;
  const experienceLabel =
    expYears > 0 ? `${expYears}+ years experience` : faculty.experience;

  return (
    <Link
      href={`/faculty/${faculty.slug}`}
      className={cn(
        "relative my-1 flex h-[316px] w-[204px] min-w-[204px] shrink-0 flex-col overflow-hidden rounded-[6px] border border-border-default bg-white group hover-shine",
        className
      )}
    >
      <div className="relative h-[166px] w-full overflow-hidden bg-[#FFF8F1]">
        <Image
          src={faculty.image || "/assets/images/placeholders/faculty-avatar.svg"}
          alt={faculty.name}
          fill
          className="object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="204px"
        />
      </div>

      <div className="z-10 flex flex-1 flex-col p-3 text-left border-image-gradient-t-light">
        <p className="truncate text-sm font-medium text-[#8B5E3C]">
          {subject}
        </p>
        <h3 className="mt-2 truncate text-base font-bold leading-6 text-neutral-900">
          {faculty.name}
        </h3>
        <p className="mt-0.5 truncate text-sm text-neutral-500">
          {experienceLabel}
        </p>
        {faculty.qualification ? (
          <p className="mt-auto pt-2 truncate text-caption text-neutral-400">
            {faculty.qualification}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
