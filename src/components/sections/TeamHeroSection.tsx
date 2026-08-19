import Image from "next/image";
import { cn } from "@/lib/utils";
import { TEAM_HERO, TEAM_HERO_STATS } from "@/data/team";
import { AccentUnderline } from "@/components/ui/AccentUnderline";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface TeamHeroSectionProps {
  className?: string;
}

export function TeamHeroSection({ className }: TeamHeroSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-bg-primary min-h-[380px] lg:min-h-[460px]",
        className
      )}
    >
      {/* Edge-bleed hero image — full section height, no top/bottom gaps */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden lg:block w-[50%] xl:w-[54%]">
        <Image
          src={TEAM_HERO.image}
          alt=""
          fill
          className="object-cover object-center"
          sizes="54vw"
          fetchPriority="high"
        />
        {/* Left blend only — no top/bottom fade so image covers the full height */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, var(--bg-primary) 0%, rgba(10,10,10,0.75) 10%, rgba(10,10,10,0.25) 32%, transparent 52%)",
          }}
        />
      </div>

      <div className="container-rodha relative z-10 py-6 md:py-8 lg:py-10 lg:min-h-[460px] flex flex-col justify-center">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about" },
            { label: "Meet the Team" },
          ]}
          className="py-0 pb-4 md:pb-5"
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          <div className="lg:col-span-6 xl:col-span-5">
            <h1 className="text-[32px] sm:text-[40px] md:text-hero font-bold leading-[1.12] tracking-tight">
              {TEAM_HERO.titleBefore}{" "}
              <span className="relative inline-block text-orange-500">
                {TEAM_HERO.titleHighlight}
                <AccentUnderline className="absolute left-0 -bottom-1 w-full h-2.5" />
              </span>
            </h1>

            <p className="mt-4 text-body-lg text-text-secondary max-w-lg leading-relaxed">
              {TEAM_HERO.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-5 md:gap-6">
              {TEAM_HERO_STATS.map((stat) => (
                <div key={stat.id} className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 shrink-0">
                    <Image
                      src={stat.icon}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="32px"
                    />
                  </div>
                  <div>
                    <div className="text-body-sm font-bold text-text-primary leading-none">
                      {stat.value}
                    </div>
                    <div className="text-caption text-text-dimmed mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile / tablet: full-bleed image, edge-to-edge, no card chrome */}
          <div className="lg:hidden relative -mx-4 sm:-mx-6 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] h-[260px] sm:h-[320px] overflow-hidden">
            <Image
              src={TEAM_HERO.image}
              alt={TEAM_HERO.imageAlt}
              fill
              className="object-cover object-center"
              sizes="100vw"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
