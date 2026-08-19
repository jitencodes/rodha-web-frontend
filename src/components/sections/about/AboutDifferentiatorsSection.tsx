import { Container } from "@/components/layout/Container";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { Icon } from "@/components/ui/Icon";
import { ABOUT_DIFFERENTIATORS } from "@/data/about";
import { cn } from "@/lib/utils";

interface AboutDifferentiatorsSectionProps {
  className?: string;
}

export function AboutDifferentiatorsSection({ className }: AboutDifferentiatorsSectionProps) {
  return (
    <section
      className={cn(
        "home-section-spacing bg-section-beige home-on-light",
        className
      )}
    >
      <Container>
        <SectionHeaderV2
          badge="WHY CHOOSE US"
          title="What Makes Rodha Different"
          align="center"
          className="mx-auto lg:!mb-10"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-[1000px] mx-auto">
          {ABOUT_DIFFERENTIATORS.map((item) => (
            <article
              key={item.id}
              className="rounded-[6px] border border-section-beige bg-white p-5 md:p-6 shadow-sm"
            >
              <span className="flex h-15 w-15 mx-auto items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                <Icon src={item.icon} size={30} />
              </span>
              <h3 className="mt-4 text-h4 text-center font-montserrat font-semibold text-neutral-900">
                {item.title}
              </h3>
              <p className="mt-2 text-body-sm text-center text-neutral-600 leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
