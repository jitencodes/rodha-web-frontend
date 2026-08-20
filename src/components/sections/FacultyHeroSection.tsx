import Image from "next/image";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { AccentUnderline } from "@/components/ui/AccentUnderline";
import { FACULTY_HERO, FACULTY_HERO_STATS } from "@/data/faculty";
import { Icon } from "@/components/ui/Icon";

interface FacultyHeroSectionProps {
  className?: string;
}

export function FacultyHeroSection({ className }: FacultyHeroSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-bg-primary min-h-[380px] lg:min-h-[460px]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden lg:block w-[50%] xl:w-[54%]">
        <Image
          src={FACULTY_HERO.image}
          alt=""
          fill
          className="object-contain object-[right_bottom]"
          sizes="54vw"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, var(--bg-primary) 0%, rgba(10,10,10,0.85) 12%, rgba(10,10,10,0.35) 38%, transparent 58%)",
          }}
        />
      </div>

      <div className="container-rodha relative z-10 py-6 md:py-8 lg:py-10 lg:min-h-[460px] flex flex-col justify-center">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Faculty" },
          ]}
          className="py-0 pb-4 md:pb-5"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          <div className="lg:col-span-6 xl:col-span-5">
            <p className="text-body-sm uppercase tracking-wider text-orange-400 font-semibold mb-2">
              Our Faculty
            </p>

            <h1 className="text-[32px] sm:text-[40px] md:text-hero font-bold leading-[1.12] tracking-tight">
              {FACULTY_HERO.titleBefore}{" "}
              <span className="relative inline-block text-orange-500">
                {FACULTY_HERO.titleHighlight}
                <AccentUnderline className="absolute left-0 -bottom-1 w-full h-2.5" />
              </span>
            </h1>

            <p className="mt-4 text-body-lg text-text-secondary max-w-lg leading-relaxed">
              {FACULTY_HERO.description}
            </p>

            <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
              {FACULTY_HERO_STATS.map((stat) => (
                <div key={stat.id} className="flex items-center gap-2.5">
                  <div className="text-orange-500 shrink-0">
                    <Icon src={stat.icon} size={32} />
                  </div>
                  <div>
                    <div className="text-body-sm font-bold text-text-primary leading-none">
                      {stat.value}
                    </div>
                    <div className="text-caption text-text-dimmed mt-0.5 leading-snug">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:hidden relative -mx-4 sm:-mx-6 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] h-[260px] sm:h-[320px] overflow-hidden bg-bg-primary">
            <Image
              src={FACULTY_HERO.image}
              alt={FACULTY_HERO.imageAlt}
              fill
              className="object-contain object-[center_bottom]"
              sizes="100vw"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
