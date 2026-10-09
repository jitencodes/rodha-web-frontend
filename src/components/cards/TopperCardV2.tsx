import { AppImage } from "@/components/ui/AppImage";
import { cn } from "@/lib/utils";
import type { TopperResult } from "@/lib/types";

interface TopperCardV2Props {
  topper: TopperResult;
  className?: string;
}

function getTopperMetric(topper: TopperResult) {
  const batchLabel =
    topper.batch && topper.batch.length > 0 ? topper.batch.join(", ") : undefined;

  if (topper.percentile !== undefined) {
    return {
      label: batchLabel ?? "%ile",
      value: topper.percentile,
      suffix: "%",
      numeric: true,
    };
  }

  if (topper.rank !== undefined) {
    return {
      label: "AIR",
      value: topper.rank,
      numeric: true,
    };
  }

  if (topper.score) {
    return {
      label: batchLabel ?? "Result",
      value: topper.score,
      numeric: false,
    };
  }

  return {
    label: "Achiever",
    value: "Topper",
    numeric: false,
  };
}

export function TopperCardV2({ topper, className }: TopperCardV2Props) {
  const metric = getTopperMetric(topper);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[6px] border border-border-default bg-[#0C0500] min-w-[156px] h-[248px] sm:min-w-[204px] sm:h-[316px] group card-premium-hover hover-shine",
        className
      )}
    >
      <div className="relative h-[124px] w-[156px] overflow-hidden group sm:h-[166px] sm:w-[204px]">
        {/* 1. Blurred Background Image Layer */}
        <div 
          className="absolute -inset-5 bg-cover bg-center filter blur-xl brightness-75 scale-110 pointer-events-none transition-transform duration-500 group-hover:scale-[1.13]"
          style={{ backgroundImage: `url(${topper.image || "/assets/images/placeholders/topper-photo.svg"})` }}
        />

        {/* 2. Sharp Foreground Image Layer */}
        <AppImage
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
          {metric.label}
        </span>
      </div>

      <div className="z-10 border-image-gradient-t p-2 text-left sm:p-3">
        <div
          className={cn(
            "mt-1.5 font-montserrat font-bold text-orange-500 leading-none",
            metric.numeric ? "text-2xl tabular-nums sm:text-3xl" : "text-[22px] sm:text-[28px]"
          )}
        >
          {metric.value}
          {metric.suffix ? (
            <span className="text-sm text-orange-500">{metric.suffix}</span>
          ) : null}
        </div>
        <p className="mt-1 text-xs font-medium text-[#C0C0C0] sm:text-sm">{topper.exam}</p>
        <h4 className="mt-1.5 truncate text-sm font-bold leading-5 text-text-primary sm:mt-2 sm:text-base sm:leading-6">
          {topper.name}
        </h4>
        <p title={topper.college} className="mt-0.5 max-w-[132px] truncate text-xs text-[#cda68e] sm:max-w-[180px] sm:text-sm">{topper.college}</p>
      </div>
    </div>
  );
}
