"use client";

import { cn } from "@/lib/utils";
import { Carousel } from "@/components/ui/Carousel";
import { AdvisorCard } from "@/components/cards/AdvisorCard";
import { advisors } from "@/data/team";

interface AdvisorsSectionProps {
  className?: string;
}

export function AdvisorsSection({ className }: AdvisorsSectionProps) {
  const useCarousel = advisors.length > 3;

  return (
    <section className={cn("home-section-spacing bg-section-beige home-on-light", className)}>
      <div className="container-rodha">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 lg:items-center">
          <div className="lg:col-span-3 xl:col-span-3">
            <p className="text-body-sm uppercase tracking-wider text-orange-400 font-semibold mb-2">
              Our Advisors
            </p>
            <h2 className="text-h2 md:text-h1 font-bold text-neutral-900 leading-tight">
              Guided by Industry
              <br className="hidden lg:block" />{" "}
              <span className="lg:inline">Leaders</span>
            </h2>
          </div>

          <div className="lg:col-span-9 xl:col-span-9 min-w-0">
            {useCarousel ? (
              <Carousel>
                {advisors.map((advisor) => (
                  <div
                    key={advisor.id}
                    className="snap-start shrink-0 w-[280px] sm:w-[300px] md:w-[320px]"
                  >
                    <AdvisorCard advisor={advisor} />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {advisors.map((advisor) => (
                  <AdvisorCard key={advisor.id} advisor={advisor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
