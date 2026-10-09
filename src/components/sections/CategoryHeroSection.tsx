import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { CategoryHeroFeature, CategoryQuickStat } from "@/lib/types";

interface CategoryHeroCta {
  label: string;
  href: string;
  external?: boolean;
}

interface CategoryHeroSectionProps {
  categoryName: string;
  headline: ReactNode;
  subtitle: string;
  heroImageSrc: string;
  heroImageAlt: string;
  features: CategoryHeroFeature[];
  quickStats: CategoryQuickStat[];
  primaryCta: CategoryHeroCta;
  secondaryCta: CategoryHeroCta;
  className?: string;
}

function HeroCtaLink({
  cta,
  variant,
}: {
  cta: CategoryHeroCta;
  variant: "primary" | "secondary";
}) {
  const className =
    variant === "primary"
      ? "btn-primary btn-primary-premium premium-border-glow glow-accent-orange text-body px-7 py-3.5"
      : "btn-secondary btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline text-body px-7 py-3.5";

  if (cta.external) {
    return (
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {cta.label}
      </a>
    );
  }

  return (
    <Link href={cta.href} className={className}>
      {cta.label}
    </Link>
  );
}

export function CategoryHeroSection({
  categoryName,
  headline,
  subtitle,
  heroImageSrc,
  heroImageAlt,
  features,
  quickStats,
  primaryCta,
  secondaryCta,
  className,
}: CategoryHeroSectionProps) {
  return (
    <section id="site-hero" className={cn("relative overflow-hidden", className)}>
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 78% 40%, rgba(249,115,22,0.16) 0%, transparent 70%)",
        }}
      />

      <div className="container-rodha relative z-10 pt-2 md:pt-4 lg:pt-6 pb-10 md:pb-12 lg:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-6 xl:col-span-6">
            <h1 className="text-[26px] sm:text-[40px] md:text-hero font-bold leading-[1.12] tracking-tight">
              {headline}
            </h1>

            <p className="mt-5 text-body-lg text-text-secondary max-w-xl leading-relaxed">
              {subtitle}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
              <HeroCtaLink cta={primaryCta} variant="primary" />
              <HeroCtaLink cta={secondaryCta} variant="secondary" />
            </div>

            <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-start gap-2.5">
                  <div className="relative w-9 h-9 shrink-0">
                    <Image
                      src={feature.icon}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="36px"
                    />
                  </div>
                  <p className="text-caption sm:text-body-sm text-text-secondary leading-snug font-medium pt-0.5">
                    {feature.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-6 relative">
            <div className="relative aspect-4/3 sm:aspect-16/11 lg:aspect-5/4 xl:aspect-16/12 rounded-2xl overflow-hidden border border-border-default shadow-lg">
              <Image
                src={heroImageSrc}
                alt={heroImageAlt}
                fill
                preload
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg-primary via-transparent to-bg-primary/30" />
              <div className="absolute inset-0 bg-linear-to-r from-bg-primary/40 via-transparent to-transparent" />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 55% at 55% 45%, rgba(249,115,22,0.22) 0%, transparent 70%)",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[72px] sm:text-[96px] md:text-[112px] font-black tracking-tight text-orange-500/90 glow-text-orange select-none drop-shadow-[0_0_40px_rgba(249,115,22,0.45)]">
                  {categoryName}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-12 lg:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {quickStats.map((stat) => (
            <div
              key={stat.id}
              className="card-base card-hover px-3.5 py-4 md:px-4 md:py-5 flex items-center gap-3"
            >
              <div className="relative w-11 h-11 shrink-0">
                <Image
                  src={stat.icon}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="44px"
                />
              </div>
              <div className="min-w-0">
                <div className="text-body md:text-h4 font-bold text-text-primary leading-none truncate">
                  {stat.value}
                </div>
                <p className="mt-1.5 text-caption text-text-dimmed leading-snug">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
