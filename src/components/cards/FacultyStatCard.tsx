import { cn } from "@/lib/utils";
import { FacultyIcon } from "@/lib/faculty-icons";
import type { FacultyHeroStat } from "@/lib/types";

interface FacultyStatCardProps {
  stat: FacultyHeroStat;
  className?: string;
}

export function FacultyStatCard({ stat, className }: FacultyStatCardProps) {
  return (
    <div
      className={cn(
        "card-base card-premium-hover premium-border-glow hover-shine group flex flex-col items-start gap-2 rounded-xl bg-bg-secondary p-3.5 md:p-4 h-full min-w-0",
        className
      )}
    >
      <div className="text-orange-500 transition-[transform,filter] duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]">
        <FacultyIcon name={stat.icon} size={22} />
      </div>
      <div className="text-h4 md:text-h3 font-bold text-text-primary leading-none">
        {stat.value}
      </div>
      <div className="text-caption text-text-dimmed leading-snug">{stat.label}</div>
    </div>
  );
}
