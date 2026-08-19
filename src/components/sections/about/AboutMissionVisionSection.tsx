import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { ABOUT_MISSION_VISION } from "@/data/about";
import { cn } from "@/lib/utils";

interface AboutMissionVisionSectionProps {
  className?: string;
}

export function AboutMissionVisionSection({ className }: AboutMissionVisionSectionProps) {
  return (
    <section
      className={cn(
        "home-section-spacing bg-section-beige home-on-light",
        className
      )}
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {ABOUT_MISSION_VISION.map((item) => (
            <article
              key={item.id}
              className="flex gap-4 md:gap-5 rounded-[6px] border border-section-beige bg-white p-5 md:p-6 shadow-sm"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                <Icon src={item.icon} size={30} />
              </div>
              <div className="min-w-0">
                <h2 className="text-h4 font-montserrat font-semibold text-orange-500">
                  {item.title}
                </h2>
                <p className="mt-2 text-body text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
