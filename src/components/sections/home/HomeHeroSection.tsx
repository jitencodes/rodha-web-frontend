import { Container } from "@/components/layout/Container";
import { HomeHeroShell } from "@/components/sections/home/HomeHeroShell";
import { HeroVideoEmbed } from "@/components/sections/home/HeroVideoEmbed";
import Typewritter from "@/components/Typewriter";
import Image from "next/image";
import type {
  HeroStackViewModel,
  HomeBannerViewModel,
} from "@/lib/api/modules/home/types";

/** Shared max width for title, form, and supporting copy */
const HERO_CONTENT_MAX = "max-w-[26rem] sm:max-w-[34rem]";

interface HomeHeroSectionProps {
  banner?: HomeBannerViewModel | null;
}

function HeroStacksStrip({ stacks }: { stacks: HeroStackViewModel[] }) {
  if (stacks.length === 0) return null;

  return (
    <div className="bg-[#F06B23]/80 backdrop-blur-[12px] shadow-[0px_10px_20px_0px_rgba(0,0,0,0.25)] flex gap-5 p-2 lg:p-6 rounded-2xl lg:rounded-[22px] sm:absolute -bottom-10 lg:-bottom-17 translate-y-1/2 left-1/2 sm:left-auto w-fit mx-auto">
      {stacks.map((stack) => (
        <div key={stack.id} className="flex gap-4.5 items-center">
          <div>
            <p className="text-lg md:text-2xl font-semibold font-montserrat">
              {stack.value}
            </p>
            <p className="text-sm">{stack.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomeHeroSection({ banner = null }: HomeHeroSectionProps) {
  if (!banner) return null;

  const hasHighlights = banner.titleHighlights.length > 0;
  const hasDescription = Boolean(banner.description);
  const hasVideo = Boolean(banner.videoId);
  const hasStacks = banner.stacks.length > 0;

  return (
    <HomeHeroShell>
      <Container data-home-zone="hero">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 xl:gap-8 items-center min-h-[426px]">
          <div
            className={`lg:col-span-6 min-h-0 overflow-visible ${HERO_CONTENT_MAX} lg:max-w-none`}
          >
            <div className={HERO_CONTENT_MAX}>
              <h1 className="text-[32px] sm:text-[38px] md:text-[40px] lg:text-[3rem] font-bold leading-[1.4] tracking-tight">
                {banner.title}
                {hasHighlights ? (
                  <>
                    {" "}
                    <br />{" "}
                    <span className="text-orange-500 glow-text-orange h-4">
                      <Typewritter words={banner.titleHighlights} />
                    </span>
                  </>
                ) : null}
              </h1>

              {hasDescription ? (
                <p className="mt-3 lg:mt-5 mb-8 lg:mb-14 text-body-lg text-white leading-relaxed">
                  {banner.description}
                </p>
              ) : (
                <div className="mb-8 lg:mb-14" />
              )}
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center min-h-0">
            <div className="flex w-full flex-col gap-2.5 sm:gap-3">
              {hasVideo && banner.videoId ? (
                <HeroVideoEmbed videoId={banner.videoId} />
              ) : banner.imageUrl ? (
                <div className="relative w-full aspect-video rounded-[6px] overflow-hidden border border-white/10 shadow-lg bg-bg-tertiary">
                  <Image
                    src={banner.imageUrl}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    fetchPriority="high"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {hasStacks ? <HeroStacksStrip stacks={banner.stacks} /> : null}
        <div className="h-8 sm:h-0"></div>
      </Container>
    </HomeHeroShell>
  );
}
