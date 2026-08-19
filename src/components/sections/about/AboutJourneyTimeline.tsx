import { Container } from "@/components/layout/Container";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { Icon } from "@/components/ui/Icon";
import { ABOUT_JOURNEY } from "@/data/about";
import { cn } from "@/lib/utils";

interface AboutJourneyTimelineProps {
  className?: string;
}

export function AboutJourneyTimeline({ className }: AboutJourneyTimelineProps) {
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

        <ol className="md:hidden relative space-y-6 before:content-[''] before:absolute before:left-[17px] before:top-[18px] before:bottom-[18px] before:w-[2px] before:bg-orange-500/25 before:rounded-full">
          {ABOUT_JOURNEY.map((milestone) => (
            <li key={milestone.id} className="relative flex gap-4 pl-0">
              <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange-500/30 bg-section-beige text-orange-500">
                <Icon src={milestone.icon} size={16} />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-body-sm font-bold text-orange-500">{milestone.year}</p>
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

        <div className="hidden md:block">
          <div className="relative pt-2">
            <div
              className="absolute left-[10%] right-[10%] top-[23.5px] h-[2px] bg-orange-500/25 rounded-full"
              aria-hidden
            />
            <ol className="grid grid-cols-5 gap-4">
              {ABOUT_JOURNEY.map((milestone) => (
                <li key={milestone.id} className="relative flex flex-col items-center text-center">
                  <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-orange-500/35 bg-white text-orange-500 shadow-sm">
                    <Icon src={milestone.icon} size={18} />
                  </span>
                  <p className="mt-4 text-body font-bold text-orange-500">{milestone.year}</p>
                  <h3 className="mt-1 text-body font-semibold text-neutral-900">
                    {milestone.title}
                  </h3>
                  <p className="mt-1.5 text-caption md:text-body-sm text-neutral-600 leading-relaxed">
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
