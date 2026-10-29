import Link from "next/link";
import { AppImage } from "@/components/ui/AppImage";
import { cn } from "@/lib/utils";
import { Rating } from "@/components/ui/Rating";
import type { Faculty } from "@/lib/types";

interface FacultyCardProps {
  faculty: Faculty;
  className?: string;
}

export function FacultyCard({ faculty, className }: FacultyCardProps) {
  return (
    <Link
      href={`/faculty/${faculty.slug}`}
      className={cn(
        "card-base premium-border-glow hover-shine relative overflow-hidden flex flex-row items-stretch group min-w-[260px] w-[280px] md:w-[300px] min-h-[150px] rounded-[6px]",
        className
      )}
    >
      <div className="relative w-[42%] min-h-[150px] shrink-0 bg-transparent">
        <AppImage
          src={faculty.image || "/assets/images/placeholders/faculty-avatar.svg"}
          alt={faculty.name}
          fill
          className="object-contain object-bottom transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          sizes="130px"
        />
      </div>

      <div className="relative z-10 flex-1 p-3.5 md:p-4 flex flex-col justify-center text-left min-w-0">
        <h3 className="text-body font-semibold text-text-primary leading-snug truncate">
          {faculty.name}
        </h3>
        <p className="mt-1 text-body-sm text-orange-400 font-medium">{faculty.title}</p>
        <p className="mt-0.5 text-caption text-text-dimmed">{faculty.experience}</p>

        {faculty.rating !== undefined && (
          <div className="mt-2 flex items-center gap-1.5">
            <Rating
              value={Math.round(faculty.rating)}
              size="sm"
              className="transition-[filter] duration-300 group-hover:brightness-125"
            />
            <span className="text-caption text-text-muted font-medium">
              {faculty.rating}/5
            </span>
          </div>
        )}

        {faculty.studentsMentored && (
          <p className="mt-1.5 text-caption text-text-dimmed">
            Mentored{" "}
            <span className="text-orange-400 font-semibold">{faculty.studentsMentored}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
