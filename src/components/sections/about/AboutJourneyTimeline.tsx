import { Container } from "@/components/layout/Container";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { Icon } from "@/components/ui/Icon";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { AboutJourneyViewModel } from "@/lib/api/modules/about/types";

interface AboutJourneyTimelineProps {
  className?: string;
  steps?: AboutJourneyViewModel[];
}

function JourneyIcon({ src, size }: { src: string; size: number }) {
  if (!src) return null;
  if (src.startsWith("http") || /\.(png|jpe?g|webp|svg)$/i.test(src)) {
    return (
      <span className="relative block" style={{ width: size, height: size }}>
        <Image src={src} alt="" fill className="object-contain" sizes={`${size}px`} />
      </span>
    );
  }
  return <Icon src={src} size={size} />;
}

export function AboutJourneyTimeline({
  className,
  steps = [],
}: AboutJourneyTimelineProps) {
  if (steps.length === 0) return null;

  // Keep the timeline visually balanced for different API step counts.
  const columnCount = Math.min(Math.max(steps.length, 2), 6);

  return (
    <section
      className={cn(
        "home-section-spacing bg-section-white home-on-light overflow-x-hidden",
        className
      )}
    >
      <Container>
        <SectionHeaderV2
          badge="OUR JOURNEY"
          title="A Journey Built on Trust and Results"
          align="center"
          className="mx-auto lg:!mb-10"
        />

        {/* Mobile */}
        <ol className="md:hidden relative space-y-6 before:content-[''] before:absolute before:left-[17px] before:top-[18px] before:bottom-[18px] before:w-[2px] before:bg-orange-500/25 before:rounded-full">
          {steps.map((milestone) => (
            <li
              key={milestone.id}
              className="relative flex gap-4 pl-0"
            >
              <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange-500/30 bg-section-beige text-orange-500">
                <JourneyIcon src={milestone.icon} size={16} />
              </span>

              <div className="min-w-0 pt-0.5">
                <p className="text-body-sm font-bold text-orange-500">
                  {milestone.year}
                </p>

                <h3 className="mt-1 text-body font-semibold text-neutral-900">
                  {milestone.title}
                </h3>

                <p className="mt-1 text-body-sm text-neutral-600 leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Desktop / Tablet */}
        <div className="hidden md:block">
          <div className="relative pt-2">
            {/* Timeline ruler */}
            <div
              className="pointer-events-none absolute left-[5%] right-[5%] top-[23.5px] h-[2px] rounded-full bg-orange-500/25"
              aria-hidden
            />

            <ol
              className="relative grid gap-4 md:gap-6"
              style={{
                gridTemplateColumns: `repeat(${Math.min(steps.length, 6)}, minmax(0, 1fr))`,
              }}
            >
              {steps.map((milestone) => (
                <li
                  key={milestone.id}
                  className="relative flex min-w-0 flex-col items-center text-center"
                >
                  {/* Timeline node */}
                  <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-orange-500/35 bg-white text-orange-500 shadow-sm">
                    <JourneyIcon
                      src={milestone.icon}
                      size={18}
                    />
                  </span>

                  <p className="mt-4 text-body font-bold text-orange-500">
                    {milestone.year}
                  </p>

                  <h3 className="mt-1 max-w-[180px] text-body font-semibold text-neutral-900 break-words">
                    {milestone.title}
                  </h3>

                  <p className="mt-1.5 w-full max-w-[220px] text-center text-caption md:text-body-sm text-neutral-600 leading-relaxed break-words">
                    {milestone.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
