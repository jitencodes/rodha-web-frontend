import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ResultStat } from "@/lib/types";

interface ResultsStatsPanelProps {
  stats: ResultStat[];
  className?: string;
  /** Light cream surface for homepage-aligned category pages. Default keeps dark category look. */
  variant?: "dark" | "light";
}

function iconForStat(label: string): string {
  const lower = label.toLowerCase();
  if (
    lower.includes("rank") ||
    lower.includes("percentil") ||
    lower.includes("conversion")
  ) {
    return "/assets/images/icons/rank.png";
  }
  return "/assets/images/icons/selection.png";
}

/** Homepage-matching stats sidebar used next to topper carousels */
export function ResultsStatsPanel({
  stats,
  className,
  variant = "dark",
}: ResultsStatsPanelProps) {
  const isLight = variant === "light";

  return (
    <div
      className={cn(
        "premium-border-glow shine-sweep shine-sweep-hover ambient-results shrink-0 lg:w-[210px] xl:w-[230px] p-5 md:p-6 flex flex-row lg:flex-col gap-5 lg:gap-7 justify-center rounded-[6px]",
        isLight
          ? "border border-[#FFEAD6] bg-[#FFF3E8]"
          : "card-base bg-linear-to-br from-orange-500/25 via-bg-secondary to-bg-tertiary border-orange-500/35",
        className
      )}
    >
      {stats.slice(0, 2).map((stat) => (
        <div key={stat.label} className="flex items-start gap-3">
          <Image
            src={iconForStat(stat.label)}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 object-contain shrink-0 mt-0.5"
          />
          <div>
            <div
              className={cn(
                "text-[30px] md:text-[34px] font-bold text-orange-500 leading-none",
                !isLight && "glow-text-orange"
              )}
            >
              {stat.value}
              {stat.suffix}
            </div>
            <p
              className={cn(
                "mt-1.5 text-body",
                isLight ? "text-neutral-600" : "text-text-muted"
              )}
            >
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
