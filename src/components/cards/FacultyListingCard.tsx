import Link from "next/link";
import { AppImage } from "@/components/ui/AppImage";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { parseExperienceYears } from "@/data/faculty";
import type { Faculty } from "@/lib/types";

interface FacultyListingCardProps {
  faculty: Faculty;
  className?: string;
  variant?: "default" | "carousel";
}

const BADGE_VARIANTS = [
  "bg-purple-500 text-white border-purple-500",
  "bg-emerald-500 text-white border-emerald-500",
  "bg-sky-500 text-white border-sky-500",
  "bg-orange-500 text-white border-orange-500",
  "bg-rose-500 text-white border-rose-500",
] as const;

function getBadgeClass(id: string) {
  return BADGE_VARIANTS[
    Math.abs(id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % BADGE_VARIANTS.length
  ];
}

export function FacultyListingCard({
  faculty,
  className,
  variant = "default",
}: FacultyListingCardProps) {
  const expYears = parseExperienceYears(faculty.experience);
  const primarySubject = faculty.specialization[0] ?? faculty.title;

  return (
    <Link
      href={`/faculty/${faculty.slug}`}
      className={cn(
        "card-base card-premium-hover premium-border-glow hover-shine group flex flex-col overflow-hidden rounded-[6px] bg-bg-secondary",
        variant === "carousel"
          ? "w-[210px] sm:w-[220px] md:w-[230px] shrink-0"
          : "w-full min-w-0",
        className
      )}
    >
      <div className="relative h-[200px] sm:h-[210px] bg-bg-tertiary overflow-hidden">
        <AppImage
          src={faculty.image || "/assets/images/placeholders/faculty-avatar.svg"}
          alt={faculty.name}
          fill
          className="object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.03]"
          sizes={variant === "carousel" ? "230px" : "280px"}
        />

        <span
          className="absolute top-3 right-3 z-10 text-orange-500 opacity-80"
          aria-hidden
        >
          <Icon src="/assets/icons/heart.svg" size={18} />
        </span>

        <Badge
          variant="default"
          className={cn(
            "absolute bottom-3 left-3 z-10 shadow-md",
            getBadgeClass(faculty.id)
          )}
        >
          {faculty.title}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col px-3.5 py-3 md:px-4 md:py-3.5">
        <h3 className="text-body font-semibold text-text-primary leading-snug truncate">
          {faculty.name}
        </h3>
        <p className="mt-1 text-caption text-text-dimmed truncate">
          {faculty.qualification}
        </p>
        <p className="mt-1 text-caption text-text-muted truncate">{primarySubject}</p>

        <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-border-default/60">
          <span className="inline-flex items-center gap-1.5 text-caption text-text-dimmed">
            <Icon src="/assets/icons/clock.svg" size={14} className="text-orange-400" />
            <span>
              {expYears > 0 ? `${expYears}+` : faculty.experience} Exp. (Years)
            </span>
          </span>
          {faculty.rating !== undefined && (
            <span className="inline-flex items-center gap-1 text-caption text-text-muted font-medium">
              <svg
                className="w-3.5 h-3.5 text-orange-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292z" />
              </svg>
              {faculty.rating}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
