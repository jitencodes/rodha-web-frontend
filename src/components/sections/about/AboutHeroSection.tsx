import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Icon } from "@/components/ui/Icon";
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
  if (!banner) return null;

  const title = banner.title;
  const highlight = banner.titleHighlights[0] || null;
  const description = banner.description;
  const eyebrow = banner.overline;
  const videoId = banner.videoId;
  const imageUrl = banner.imageUrl;
  const stats = banner.listItems;
  const showVideo = Boolean(videoId);
  const showImage = Boolean(imageUrl) && !showVideo;

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

      {showImage && imageUrl ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden lg:block w-[46%] xl:w-[50%]">
          <Image
            src={imageUrl}
            alt=""
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
          <div
            className={
              showVideo || showImage ? "lg:col-span-6" : "lg:col-span-6 xl:col-span-6"
            }
          >
            {eyebrow ? (
              <p className="text-body-sm uppercase tracking-wider text-orange-500 font-semibold mb-2">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-[32px] sm:text-[38px] md:text-[42px] font-montserrat font-bold leading-[1.15] tracking-tight text-text-primary">
              {title}{" "}
              {highlight ? (
                <span className="text-orange-500">{highlight}</span>
              ) : null}
            </h1>
            {description ? (
              <p className="mt-4 max-w-xl text-body-lg text-text-secondary leading-relaxed">
                {description}
              </p>
            ) : null}

            {showVideo && videoId ? (
              <div className="mt-5">
                <HeroVideoEmbed videoId={videoId} />
              </div>
            ) : showImage && imageUrl ? (
              <div className="mt-5 lg:hidden relative w-full overflow-hidden rounded-[8px]">
                <Image
                  src={imageUrl}
                  alt=""
                  width={300}
                  height={300}
                  className="object-cover object-center w-full h-auto"
                  sizes="100vw"
                  fetchPriority="high"
                />
              </div>
            ) : null}

            {stats.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                {stats.map((item) => (
                  <div key={item.id} className="min-w-0">
                    {item.icon ? (
                      <span className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-orange-500/30 bg-orange-500/10 text-orange-400">
                        <Icon src={item.icon} size={18} />
                      </span>
                    ) : null}
                    <h3 className="mt-2.5 text-body-sm font-semibold text-text-primary leading-snug">
                      {item.value}
                    </h3>
                    <p className="mt-1 text-caption text-text-muted leading-relaxed">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
