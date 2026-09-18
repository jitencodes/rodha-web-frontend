import Image from "next/image";
import { cn } from "@/lib/utils";
import { TEAM_HERO, TEAM_HERO_STATS } from "@/data/team";
import { AccentUnderline } from "@/components/ui/AccentUnderline";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { HeroVideoEmbed } from "@/components/sections/home/HeroVideoEmbed";
import type { WebsiteBannerViewModel } from "@/lib/api/modules/banners/types";

interface TeamHeroSectionProps {
  className?: string;
  banner?: WebsiteBannerViewModel | null;
}

export function TeamHeroSection({
  className,
  banner = null,
}: TeamHeroSectionProps) {
  const title = banner?.title || TEAM_HERO.titleBefore;
  const highlight = banner?.titleHighlights[0] || TEAM_HERO.titleHighlight;
  const description = banner?.description ?? TEAM_HERO.description;
  const stats =
    banner?.listItems.length
      ? banner.listItems
      : TEAM_HERO_STATS.map((stat) => ({
          id: stat.id,
          value: stat.value,
          label: stat.label,
          icon: stat.icon,
        }));
  const videoId = banner?.videoId;
  const imageUrl = banner?.imageUrl || TEAM_HERO.image;
  const showVideo = Boolean(videoId);

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-bg-primary min-h-[380px] lg:min-h-[460px]",
        className
      )}
    >
      {!showVideo ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden lg:block w-[50%] xl:w-[54%]">
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover object-center"
            sizes="54vw"
            fetchPriority="high"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--bg-primary) 0%, rgba(10,10,10,0.75) 10%, rgba(10,10,10,0.25) 32%, transparent 52%)",
            }}
          />
        </div>
      ) : null}

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
          <div className={showVideo ? "lg:col-span-6" : "lg:col-span-6 xl:col-span-5"}>
            <h1 className="text-[32px] sm:text-[40px] md:text-hero font-bold leading-[1.12] tracking-tight">
              {title}{" "}
              {highlight ? (
                <span className="relative inline-block text-orange-500">
                  {highlight}
                  <AccentUnderline className="absolute left-0 -bottom-1 w-full h-2.5" />
                </span>
              ) : null}
            </h1>

            {description ? (
              <p className="mt-4 text-body-lg text-text-secondary max-w-lg leading-relaxed">
                {description}
              </p>
            ) : null}

            {stats.length > 0 ? (
              <div className="mt-7 flex flex-wrap items-center gap-5 md:gap-6">
                {stats.map((stat) => (
                  <div key={stat.id} className="flex items-center gap-2.5">
                    {stat.icon ? (
                      <div className="relative w-8 h-8 shrink-0">
                        <Image
                          src={stat.icon}
                          alt=""
                          fill
                          className="object-contain text-orange-500"
                          sizes="32px"
                        />
                      </div>
                    ) : null}
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
            ) : null}
          </div>

          {showVideo && videoId ? (
            <div className="lg:col-span-6">
              <HeroVideoEmbed videoId={videoId} />
            </div>
          ) : (
            <div className="lg:hidden relative -mx-4 sm:-mx-6 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] h-[260px] sm:h-[320px] overflow-hidden">
              <Image
                src={imageUrl}
                alt={TEAM_HERO.imageAlt}
                fill
                className="object-cover object-center"
                sizes="100vw"
                fetchPriority="high"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
