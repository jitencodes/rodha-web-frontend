import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { CounsellingCtaButton } from "@/components/ui/CounsellingCtaButton";
import { HERO_FEATURES, TRUST_METRICS } from "@/lib/constants";

interface HeroSectionProps {
  title?: React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

const STUDENT_AVATARS = [
  "/assets/images/results/arjun-patel.jpg",
  "/assets/images/results/sneha-rao.jpg",
  "/assets/images/results/priya-gupta.jpg",
  "/assets/images/results/meera-krishnan.jpg",
];

export function HeroSection({ title, subtitle, children, className }: HeroSectionProps) {
  if (title) {
    return (
      <section id="site-hero" className={cn("bg-hero-gradient section-spacing", className)}>
        <div className="container-rodha text-center">
          <h1 className="text-h1 md:text-hero font-bold leading-tight max-w-4xl mx-auto">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 text-body-lg md:text-h4 text-text-muted max-w-2xl mx-auto font-normal">
              {subtitle}
            </p>
          )}
          {children && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              {children}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      id="site-hero"
      className={cn(
        "relative overflow-hidden pt-6 pb-8 md:pt-8 md:pb-10 lg:pt-10 lg:pb-12 section-gradient-hero",
        className
      )}
    >
      <div className="absolute inset-0">
        <Image
          src="/assets/images/hero/hero-home.png"
          alt=""
          fill
          className="object-cover object-[center_40%]"
          sizes="100vw"
          preload
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-bg-primary/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-bg-primary/50" />
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 45% 55% at 72% 48%, rgba(249,115,22,0.14) 0%, transparent 70%)",
          }}
        />
        <div className="hero-atmosphere" aria-hidden />
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
          <span className="ambient-drift absolute left-[64%] top-[22%] h-1 w-1 rounded-full bg-orange-300/50 shadow-[0_0_10px_rgba(249,115,22,0.45)]" />
          <span className="ambient-drift absolute left-[78%] top-[34%] h-1.5 w-1.5 rounded-full bg-orange-400/40 shadow-[0_0_12px_rgba(249,115,22,0.4)] [animation-delay:-8s]" />
          <span className="ambient-drift absolute left-[70%] top-[68%] h-1 w-1 rounded-full bg-orange-300/40 shadow-[0_0_9px_rgba(249,115,22,0.35)] [animation-delay:-16s]" />
          <span className="ambient-drift absolute left-[87%] top-[58%] h-1 w-1 rounded-full bg-orange-400/35 shadow-[0_0_10px_rgba(249,115,22,0.35)] [animation-delay:-22s]" />
        </div>
        <AmbientBackground variant="mesh" />
      </div>

      <div className="container-rodha relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-5 items-center min-h-[380px] lg:min-h-[460px]">
          <div className="lg:col-span-6 xl:col-span-5">
            <h1 className="text-[32px] sm:text-[40px] md:text-hero font-bold leading-[1.12] tracking-tight">
              Expert Mentorship.
              <br />
              Proven Strategies.
              <br />
              <span className="text-orange-500 glow-text-orange">Real Results.</span>
            </h1>

            <p className="mt-4 text-body-lg text-text-secondary max-w-lg leading-relaxed">
              Join India&apos;s most trusted platform for MBA, Integrated Programs,
              Law, Banking &amp; Government, and Skill House
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-start gap-3">
              <Link
                href="/category/cat"
                className="btn-primary btn-primary-premium premium-border-glow glow-accent-orange text-body px-6 py-2.5 rounded-[6px]"
              >
                Explore Courses
              </Link>
              <CounsellingCtaButton className="btn-secondary btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline text-body px-6 py-2.5 rounded-[6px]">
                Book Free Counselling
              </CounsellingCtaButton>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-5 md:gap-6">
              {TRUST_METRICS.map((metric) => (
                <div key={metric.id} className="group/metric flex items-center gap-2.5">
                  {metric.id === "students" ? (
                    <div className="flex -space-x-2.5 shrink-0 transition-[transform,filter] duration-300 group-hover/metric:scale-105 group-hover/metric:drop-shadow-[0_0_8px_rgba(249,115,22,0.24)]">
                      {STUDENT_AVATARS.map((src, i) => (
                        <div
                          key={i}
                          className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-bg-primary"
                        >
                          <Image
                            src={src}
                            alt=""
                            fill
                            className="object-cover object-top"
                            sizes="32px"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="relative w-8 h-8 shrink-0 transition-[transform,filter] duration-300 group-hover/metric:scale-105 group-hover/metric:drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]">
                      <Image
                        src={metric.icon}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="32px"
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-body-sm font-bold text-text-primary leading-none">
                      {metric.value}
                    </div>
                    <div className="text-caption text-text-dimmed mt-0.5">
                      {metric.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-7 relative flex justify-end">
            <div className="hidden lg:flex flex-col gap-2.5 w-[220px] xl:w-[240px] mr-1 xl:mr-3">
              {HERO_FEATURES.map((feature) => (
                <div
                  key={feature.id}
                  className="group/feature premium-border-glow card-premium-hover flex items-center gap-3 px-3 py-2.5 rounded-[6px] bg-bg-tertiary/75 backdrop-blur-md border border-white/10 shadow-md"
                >
                  <div className="relative w-9 h-9 shrink-0 transition-[transform,filter] duration-300 group-hover/feature:scale-105 group-hover/feature:drop-shadow-[0_0_8px_rgba(249,115,22,0.28)]">
                    <Image
                      src={feature.icon}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="36px"
                    />
                  </div>
                  <div>
                    <div className="text-body-sm font-semibold text-text-primary leading-tight">
                      {feature.title}
                    </div>
                    <div className="text-caption text-text-dimmed mt-0.5">
                      {feature.subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:hidden w-full grid grid-cols-2 gap-2">
              {HERO_FEATURES.map((feature) => (
                <div
                  key={feature.id}
                  className="group/feature premium-border-glow flex items-center gap-2 px-2.5 py-2.5 rounded-[6px] bg-bg-tertiary/80 backdrop-blur-md border border-white/10"
                >
                  <div className="relative w-7 h-7 shrink-0 transition-[filter] duration-300 group-hover/feature:brightness-110">
                    <Image
                      src={feature.icon}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="28px"
                    />
                  </div>
                  <div>
                    <div className="text-caption font-semibold text-text-primary leading-tight">
                      {feature.title}
                    </div>
                    <div className="text-[10px] text-text-dimmed">{feature.subtitle}</div>
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
