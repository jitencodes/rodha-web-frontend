import Image from "next/image";

import { Container } from "@/components/layout/Container";

import { Icon } from "@/components/ui/Icon";

import { cn } from "@/lib/utils";

interface AboutFounderSectionProps {
  className?: string;
}

export function AboutFounderSection({
  className,
}: AboutFounderSectionProps) {
  return (
    <section
      className={cn(
        "py-10 md:py-14 relative overflow-hidden bg-bg-primary",
        className
      )}
    >
      <Container>
        <p className="text-body-sm uppercase tracking-wider text-orange-500 font-semibold">
          The Founder
        </p>

        <h2 className="mt-3 text-h2 md:text-h1 font-montserrat font-semibold text-white leading-tight">
          Meet the Founder
        </h2>

        <div
          className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl"
          aria-hidden
        />

        <article className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Founder Image */}
          <div className="lg:col-span-5">
            <div className="relative h-auto rounded-[8px]">
              <Image
                src="/assets/images/faculty/rodha faculty profile/Ravi Sir.png"
                alt="Ravi Prakash - Founder & CEO of Rodha"
                width={500}
                height={500}
                className="object-cover object-center w-full h-auto"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Founder Details */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <div className="h-px w-10 bg-orange-400" />

              <p className="text-body-sm uppercase tracking-wider font-semibold text-orange-500">
                Founder & CEO
              </p>
            </div>

            <h3 className="mt-4 text-h3 md:text-h2 font-montserrat font-semibold text-text-primary">
              Ravi Prakash
            </h3>

            <p className="mt-1 text-body font-medium text-orange-500">
              Founder & CEO, Rodha
            </p>

            <p className="mt-5 text-body-lg leading-relaxed text-text-primary">
              Ravi Prakash started Rodha on 25 January 2018 with a camera and
              a laptop, teaching Quant and LRDI to whoever would watch. In the
              first two years he recorded, edited and uploaded 530+ videos
              entirely on his own.
            </p>

            <p className="mt-4 text-body-lg leading-relaxed text-text-primary">
              Today he leads a company of teachers, content creators and
              mentors across six verticals, and still teaches. Students name
              him more often than any other faculty member when they describe
              what changed their preparation — usually for the same two
              reasons: he refuses to sugarcoat where you stand, and he
              doesn't stop pushing once you know.
            </p>

            {/* Pull Quote */}
            <div className="mt-7 flex gap-4">
              <div className="shrink-0">
                <Icon
                  src="/assets/icons/quote.svg"
                  size={32}
                  className="text-orange-400"
                />
              </div>

              <blockquote className="text-body-lg md:text-h4 font-medium leading-relaxed text-text-primary">
                “Reach beyond the four walls of a coaching centre.”
              </blockquote>
            </div>
          </div>
        </article>
      </Container>
    </section>
  );
}