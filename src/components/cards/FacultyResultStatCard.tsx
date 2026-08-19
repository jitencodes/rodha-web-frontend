import { cn } from "@/lib/utils";
import type { FacultyResultStat } from "@/lib/types";

interface FacultyResultStatCardProps {
  stat: FacultyResultStat;
  className?: string;
}

export function FacultyResultStatCard({ stat, className }: FacultyResultStatCardProps) {
  return (
    <div className={cn("min-w-0 text-left", className)}>
      <div className="text-h3 md:text-h2 font-bold text-orange-500 leading-none">
        {stat.value}
      </div>
      <div className="mt-1.5 text-body-sm font-semibold text-neutral-900 leading-snug">
        {stat.label}
      </div>
      {stat.description && (
        <div className="mt-0.5 text-caption text-neutral-500 leading-snug">
          {stat.description}
        </div>
      )}
    </div>
  );
}
