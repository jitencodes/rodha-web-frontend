import Image from "next/image";
import { cn } from "@/lib/utils";
import { FacultyIcon } from "@/lib/faculty-icons";
import { FACULTY_ACHIEVEMENT_IMAGE } from "@/data/faculty";

interface FacultyAchievementCardProps {
  title?: string;
  items: string[];
  illustration?: string;
  className?: string;
}

const LIGHT_CARD =
  "rounded-xl border border-section-beige bg-white shadow-sm shadow-orange-500/5";

export function FacultyAchievementCard({
  title = "Achievements & Credentials",
  items,
  illustration = FACULTY_ACHIEVEMENT_IMAGE,
  className,
}: FacultyAchievementCardProps) {
  return (
    <div
      className={cn(
        "card-premium-hover hover-shine relative overflow-hidden flex flex-col p-5 md:p-6 h-full md:min-h-[170px]",
        LIGHT_CARD,
        className
      )}
    >
      <h3 className="text-h4 font-semibold text-neutral-900 relative z-10">{title}</h3>

      <ul className="mt-4 space-y-3 relative z-10 pr-[28%] md:pr-[32%]">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-body-sm text-neutral-600">
            <FacultyIcon name="check" size={14} className="text-orange-500 mt-0.5" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>

      <div
        className="pointer-events-none absolute -bottom-2 right-6 w-[42%] max-w-[180px] aspect-square ambient-drift"
        aria-hidden
      >
        <Image
          src={illustration}
          alt=""
          fill
          className="object-contain object-bottom object-right"
          sizes="180px"
        />
      </div>
    </div>
  );
}
