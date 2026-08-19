import Image from "next/image";
import { cn } from "@/lib/utils";
import type { TopperResult } from "@/lib/types";

interface TopperCardV2Props {
  topper: TopperResult;
  className?: string;
}

export function TopperCardV2({ topper, className }: TopperCardV2Props) {
  const metricLabel = topper.batch.length > 0 ? topper.batch.join(", ") :
    topper.percentile !== undefined ? "%ile" : topper.score ? "Result" : "AIR";
  const metricValue = topper.percentile ?? topper.score ?? topper.rank;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[6px] border border-border-default bg-[#0C0500] min-w-[204px] h-[316px] group card-premium-hover hover-shine",
        className
      )}
    >
      <div className="h-[166px] w-[204px] relative overflow-hidden group">
        {/* 1. Blurred Background Image Layer */}
        <div 
          className="absolute -inset-5 bg-cover bg-center filter blur-xl brightness-75 scale-110 pointer-events-none transition-transform duration-500 group-hover:scale-[1.13]"
          style={{ backgroundImage: `url(${topper.image || "/assets/images/placeholders/topper-photo.svg"})` }}
        />

        {/* 2. Sharp Foreground Image Layer */}
        <Image
          src={topper.image || "/assets/images/placeholders/topper-photo.svg"}
          alt={topper.name}
          fill
          className="object-contain relative z-10 transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="180px"
        />
      </div>

      {/* <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" /> */}

      <div className="absolute top-3 left-3 z-10 text-left">
        <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wide bg-white/70 border border-orange-900/70 text-orange-500 transition-[filter,box-shadow] duration-300 group-hover:brightness-110 group-hover:shadow-orange-lg">
          {metricLabel}
        </span>
      </div>

      <div className="p-3 z-10 text-left border-image-gradient-t">
        <div className="mt-1.5 text-3xl font-montserrat font-bold text-orange-500 leading-none tabular-nums">
          {metricValue} {topper.percentile !== undefined && <span className="text-sm text-orange-500">%</span>}
        </div>
        <p className="text-sm text-[#C0C0C0] mt-1 font-medium">{topper.exam}</p>
        <h4 className="text-base leading-6 font-bold mt-2 text-text-primary truncate">
          {topper.name}
        </h4>
        <p className="text-sm text-[#cda68e] truncate mt-0.5">{topper.college}</p>
      </div>
    </div>
  );
}
