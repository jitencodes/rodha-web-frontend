import { AppImage } from "@/components/ui/AppImage";
import { cn } from "@/lib/utils";
import type { TopperResult } from "@/lib/types";

interface TopperCardAlternateProps {
  topper: TopperResult;
  variant?: "orange" | "dark";
  className?: string;
}

export function TopperCardAlternate({
  topper,
  variant = "dark",
  className,
}: TopperCardAlternateProps) {
  const isOrange = variant === "orange";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[6px] border min-w-[170px] w-[180px] h-[250px] group card-premium-hover hover-shine",
        isOrange
          ? "border-orange-500/40 bg-gradient-to-b from-orange-500/90 to-orange-700/80"
          : "border-border-default bg-bg-secondary",
        className
      )}
    >
      <AppImage
        src={topper.image || "/assets/images/placeholders/topper-photo.svg"}
        alt={topper.name}
        fill
        className="object-contain object-bottom group-hover:scale-[1.03] transition-transform duration-500"
        sizes="180px"
      />
      <div
        className={cn(
          "absolute inset-0",
          isOrange
            ? "bg-gradient-to-t from-orange-900/80 via-orange-800/40 to-transparent"
            : "bg-gradient-to-t from-black via-black/55 to-transparent"
        )}
      />

      <div className="absolute top-3 left-3 z-10 text-left">
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wide shadow-orange transition-[filter,box-shadow] duration-300 group-hover:brightness-110 group-hover:shadow-orange-lg",
            isOrange ? "bg-white/20 text-white" : "bg-orange-500 text-white"
          )}
        >
          AIR
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 z-10 text-left">
        
        <div
          className={cn(
            "mt-1.5 text-[34px] font-bold leading-none tabular-nums",
            isOrange ? "text-white" : "text-orange-500"
          )}
        >
          {topper.rank}
        </div>
        <p
          className={cn(
            "text-caption mt-1  mb-6 font-medium",
            isOrange ? "text-white/80" : "text-text-secondary"
          )}
        >
          {topper.exam}
        </p>
        <h4
          className={cn(
            "text-body-sm font-semibold truncate",
            isOrange ? "text-white" : "text-text-primary"
          )}
        >
          {topper.name}
        </h4>
        <p
          className={cn(
            "text-caption truncate mt-0.5",
            isOrange ? "text-white/80" : "text-orange-400"
          )}
        >
          {topper.college}
        </p>
      </div>
    </div>
  );
}
