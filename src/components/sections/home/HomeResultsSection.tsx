"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { TopperCardV2 } from "@/components/cards/TopperCardV2";
import { Carousel } from "@/components/ui/Carousel";
import { InfiniteMarquee } from "@/components/ui/infiniteMarquee";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { Button } from "@/components/ui/Button";

import { resultBanners } from "@/data/results";
import { SectionHeaderV2 } from "../SectionHeaderV2";

export function HomeResultsSection() {
  return (
    <section
      id="results"
      data-home-zone="results"
      className="home-section-spacing relative overflow-hidden bg-white"
    >
      <Container>
      <SectionHeaderV2
          title={"Results that speak for themselves."}
          // subtitle="Comprehensive preparation for every competitive exam"
          className="mx-auto lg:!mb-10"
          align="center"
          badge="Real students. Real success."
        />

        <RevealGroup>
          <Carousel
            itemsPerView={1}
            className="mt-12"
            itemClassName="w-full shrink-0 snap-center"
            // autoPlay
            autoPlayInterval={3000}

          >
            {resultBanners.map((banner) => (
              <div
                key={banner.id}
                className="w-full reveal-child"
              >
                <div
                  className={`
                    relative
                    overflow-hidden
                    rounded-2xl md:rounded-[32px]
                    border
                    border-[#FFEAD6]
                    px-4 md:px-8
                    py-4 md:py-8
                    lg:px-12
                    lg:py-10
                    bg-[#FFF3E8]
                  `}
                >
                  {/* decorative glow */}

                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]" />
                    <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-orange-600/5 blur-[100px]" />
                  </div>

                  <div className="relative z-10 grid gap-10 lg:flex items-center h-full">

                    {/* LEFT */}

                    <div className="max-w-[330px]">

                      <span
                        className={`
                          inline-flex
                          rounded-full
                          bg-[#F06B23]
                          border
                          px-4
                          py-2
                          text-[10px] md:text-xs
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          text-white/90
                          btn-outlined-premium premium-border-glow glow-accent-${"orange"}
                        `}
                      >
                        {banner.badge}
                      </span>

                      <h3 className="mt-4 sm:mt-8 text-black font-montserrat leading-[0.95] flex md:items-center md:gap-3 sm:flex-col sm:flex-row lg:items-start gap-1 lg:gap-1.5 lg:flex-col font-medium">
                        <span className="text-3xl md:text-5xl">
                          {banner.title}
                        </span>
                          
                        <span className="text-3xl md:text-5xl">
                          {banner.highlight}
                        </span>
                      </h3>

                      <p className="mt-1 sm:mt-4 text-xl font-semibold text-black">
                        {banner.subtitle}
                      </p>

                      <p className="mt-4 text-base leading-7 text-[#727272]">
                        {banner.description}
                      </p>

                      <Button
                        className="mt-8"
                      >
                        <Link href={banner.href} className="flex items-center shrink-0">
                          {banner.cta}

                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>

                    {/* RIGHT */}

                    <div
                      className="min-w-0 flex-1 overflow-hidden"
                      onPointerDown={(event) => event.stopPropagation()}
                    >
                      <InfiniteMarquee
                        speed={32}
                        direction="left"
                        gap={20}
                        pauseOnHover={false}
                      >
                        {banner.toppers.map((topper) => (
                          <TopperCardV2 key={topper.id} topper={topper} />
                        ))}
                      </InfiniteMarquee>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </RevealGroup>
      </Container>
    </section>
  );
}