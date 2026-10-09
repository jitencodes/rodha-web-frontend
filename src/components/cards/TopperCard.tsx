import { AppImage } from "@/components/ui/AppImage";
import { cn } from "@/lib/utils";
import type { TopperResult } from "@/lib/types";

interface TopperCardProps {
  topper: TopperResult;
  className?: string;
}

export function TopperCard({ topper, className }: TopperCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[6px] border border-border-default bg-bg-secondary min-w-[170px] w-[180px] h-[250px] group card-premium-hover hover-shine",
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
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

      <div className="absolute top-3 left-3 z-10 text-left">
        <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wide bg-orange-500 text-white shadow-orange transition-[filter,box-shadow] duration-300 group-hover:brightness-110 group-hover:shadow-orange-lg">
          AIR
        </span>
        <div className="mt-1.5 text-[34px] font-bold text-orange-500 leading-none tabular-nums">
          {topper.rank}
        </div>
        <p className="text-caption text-text-secondary mt-1 font-medium">{topper.exam}</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 z-10 text-left">
        <h4 className="text-body-sm font-semibold text-text-primary truncate">
          {topper.name}
        </h4>
        <p className="text-caption text-orange-400 truncate mt-0.5">{topper.college}</p>
      </div>
    </div>
  );
}
