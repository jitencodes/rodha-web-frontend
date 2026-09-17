import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Icon } from "@/components/ui/Icon";
import { ABOUT_HERO, ABOUT_HERO_HIGHLIGHTS } from "@/data/about";
import { cn } from "@/lib/utils";
import { HeroVideoEmbed } from "@/components/sections/home/HeroVideoEmbed";
import type { WebsiteBannerViewModel } from "@/lib/api/modules/banners/types";

interface AboutHeroSectionProps {
  className?: string;
  banner?: WebsiteBannerViewModel | null;
}

export function AboutHeroSection({
  className,
  banner = null,
}: AboutHeroSectionProps) {
  const title = banner?.title || ABOUT_HERO.titleBefore;
  const highlight = banner?.titleHighlights[0] || ABOUT_HERO.titleHighlight;
  const description = banner?.description ?? ABOUT_HERO.description;
  const eyebrow = banner?.overline || ABOUT_HERO.eyebrow;
  const videoId = banner?.videoId;
  const imageUrl = banner?.imageUrl || ABOUT_HERO.image;
  const showVideo = Boolean(videoId);
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-bg-primary home-section-spacing pt-4 md:pt-5",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl"
        aria-hidden
      />

      {!showVideo ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden lg:block w-[46%] xl:w-[50%]">
          <Image
            src={imageUrl}
            alt="Rodha mentors collaborating with students"
            fill
            className="object-cover object-center"
            sizes="50vw"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--bg-primary) 0%, rgba(10,10,10,0.72) 12%, rgba(10,10,10,0.2) 38%, transparent 58%)",
            }}
          />
          <div className="pointer-events-auto absolute right-4 bottom-4 xl:right-6 xl:bottom-6 max-w-[300px] rounded-[6px] border border-orange-500/25 bg-bg-secondary/90 p-4 md:p-5 backdrop-blur-sm z-10">
            <Icon src="/assets/icons/quote.svg" size={22} className="text-orange-400" />
            <p className="mt-3 text-body-sm leading-relaxed text-text-secondary">
              &ldquo;{ABOUT_HERO.quote}&rdquo;
            </p>
            <p className="mt-3 text-body-sm font-semibold text-orange-400">
              — {ABOUT_HERO.quoteAttribution}
            </p>
          </div>
        </div>
      ) : null}

      <Container className="relative z-10">
        <Breadcrumb
          className="pt-0 pb-4 md:pb-5"
          items={[
            { label: "Home", href: "/" },
            { label: "About Us" },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          <div className={showVideo ? "lg:col-span-6" : "lg:col-span-6 xl:col-span-6"}>
            <p className="text-body-sm uppercase tracking-wider text-orange-500 font-semibold mb-2">
              {eyebrow}
            </p>
            <h1 className="text-[32px] sm:text-[38px] md:text-[42px] font-montserrat font-bold leading-[1.15] tracking-tight text-text-primary">
              {title}{" "}
              {highlight ? <span className="text-orange-500">{highlight}</span> : null}
            </h1>
            {description ? (
              <p className="mt-4 max-w-xl text-body-lg text-text-secondary leading-relaxed">
                {description}
              </p>
            ) : null}

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {ABOUT_HERO_HIGHLIGHTS.map((item) => (
                <div key={item.id} className="min-w-0">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-orange-500/30 bg-orange-500/10 text-orange-400">
                    <Icon src={item.icon} size={18} />
                  </span>
                  <h3 className="mt-2.5 text-body-sm font-semibold text-text-primary leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-caption text-text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            {showVideo && videoId ? (
              <HeroVideoEmbed videoId={videoId} />
            ) : (
              <>
                <div className="lg:hidden relative h-[240px] sm:h-[320px] overflow-hidden rounded-[8px]">
                  <Image
                    src={imageUrl}
                    alt="Rodha mentors collaborating with students"
                    fill
                    className="object-cover object-center"
                    sizes="100vw"
                    fetchPriority="high"
                  />
                </div>

                <div className="mt-4 lg:hidden w-full card-base rounded-[6px] border-orange-500/25 bg-bg-secondary/90 p-4 md:p-5 backdrop-blur-sm">
                  <Icon src="/assets/icons/quote.svg" size={22} className="text-orange-400" />
                  <p className="mt-3 text-body-sm leading-relaxed text-text-secondary">
                    &ldquo;{ABOUT_HERO.quote}&rdquo;
                  </p>
                  <p className="mt-3 text-body-sm font-semibold text-orange-400">
                    — {ABOUT_HERO.quoteAttribution}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
