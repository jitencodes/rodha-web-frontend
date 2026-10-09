import Link from "next/link";
import { AppImage } from "@/components/ui/AppImage";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { Faculty } from "@/lib/types";

interface FacultyExpertCardProps {
  faculty: Faculty;
  className?: string;
}

const BADGE_VARIANTS = [
  "bg-purple-500 text-white border-purple-500",
  "bg-emerald-500 text-white border-emerald-500",
  "bg-sky-500 text-white border-sky-500",
  "bg-orange-500 text-white border-orange-500",
  "bg-rose-500 text-white border-rose-500",
] as const;

export function FacultyExpertCard({ faculty, className }: FacultyExpertCardProps) {
  const badgeClass =
    BADGE_VARIANTS[
      Math.abs(faculty.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
        BADGE_VARIANTS.length
    ];

  const subjects = faculty.specialization
    .slice(0, 3)
    .map((s) => s.split(" ")[0])
    .join(" | ");

  return (
    <Link
      href={`/faculty/${faculty.slug}`}
      className={cn(
        // `block` is required — Link is inline by default; without it width/height
        // collapse in the carousel and absolute images stack/overlap.
        "card-base card-premium-hover hover-shine relative block shrink-0 overflow-hidden group",
        "w-[210px] sm:w-[220px] md:w-[230px] h-[320px] rounded-[6px] bg-bg-tertiary",
        className
      )}
    >
      <AppImage
        src={faculty.image || "/assets/images/placeholders/faculty-avatar.svg"}
        alt={faculty.name}
        fill
        className="object-contain object-bottom group-hover:scale-105 transition-transform duration-500"
        sizes="230px"
      />

      {/* <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage: "url(/assets/patterns/noise-texture.svg)",
          backgroundSize: "180px",
        }}
      /> */}

      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/55 to-transparent" />

      <Badge
        variant="default"
        className={cn("absolute top-3 right-3 z-10 shadow-md", badgeClass)}
      >
        {faculty.title}
      </Badge>

      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center text-center px-3 pb-4">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <h3 className="text-body font-semibold text-text-primary leading-snug">
            {faculty.name}
          </h3>
          {faculty.rating !== undefined && (
            <span className="inline-flex items-center gap-1 text-caption text-text-muted font-medium">
              <svg
                className="w-3.5 h-3.5 text-orange-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {faculty.rating}/5
            </span>
          )}
        </div>
        <p className="mt-1.5 text-caption text-text-dimmed">{subjects}</p>
      </div>
    </Link>
  );
}
