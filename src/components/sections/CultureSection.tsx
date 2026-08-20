import Image from "next/image";
import { cn } from "@/lib/utils";
import { cultureValues } from "@/data/team";
import { AccentUnderline } from "@/components/ui/AccentUnderline";

interface CultureSectionProps {
  className?: string;
}

export function CultureSection({ className }: CultureSectionProps) {
  return (
    <section className={cn("home-section-spacing bg-section-primary home-on-dark", className)}>
      <div className="container-rodha">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 lg:items-center">
          <div className="lg:col-span-4 xl:col-span-3">
            <p className="text-body-sm uppercase tracking-wider text-orange-400 font-semibold mb-2">
              Our Culture
            </p>
            <h2 className="home-light-heading text-h2 md:text-h1 font-bold leading-tight">
              We Believe in More Than Just{" "}
              <span className="relative inline-block text-orange-500">
                Teaching
                <AccentUnderline className="absolute left-0 -bottom-1 w-full h-2.5" />
              </span>
            </h2>
          </div>

          <div className="lg:col-span-8 xl:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-0">
              {cultureValues.map((value, index) => (
                <div
                  key={value.id}
                  className={cn(
                    "flex flex-col gap-3 sm:px-4 lg:px-5",
                    index % 2 === 1 && "sm:border-l sm:border-section-beige",
                    index > 0 && "lg:border-l lg:border-section-beige"
                  )}
                >
                  <div className="relative w-10 h-10 md:w-11 md:h-11 shrink-0">
                    <Image
                      src={value.icon}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="44px"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="home-light-heading text-body font-semibold">
                      {value.title}
                    </h3>
                    <p className="home-light-body mt-1.5 text-body-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
