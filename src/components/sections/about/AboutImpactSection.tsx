import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { ABOUT_IMPACT_STATS } from "@/data/about";
import { cn } from "@/lib/utils";

interface AboutImpactSectionProps {
  className?: string;
}

export function AboutImpactSection({ className }: AboutImpactSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-bg-primary py-10 md:py-14",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.28)_0%,transparent_70%)]"
        aria-hidden
      />
      <Container className="relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {ABOUT_IMPACT_STATS.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center text-center">
              {stat.icon.endsWith(".png") ? (
                <span className="relative h-12 w-12">
                  <Image src={stat.icon} alt="" fill className="object-contain" sizes="48px" />
                </span>
              ) : (
                <span className="text-orange-400">
                  <Icon src={stat.icon} size={22} />
                </span>
              )}
              <p className="mt-2 text-h3 md:text-h2 font-montserrat font-bold text-text-primary leading-none">
                {stat.value}
              </p>
              <p className="mt-1.5 text-caption md:text-body-sm text-text-secondary">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
