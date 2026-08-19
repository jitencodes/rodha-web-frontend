import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { CounsellingCtaAction } from "@/components/sections/CounsellingCtaAction";
import { RevealGroup } from "@/components/ui/RevealGroup";

interface CTABandV2DecorativeProps {
  title: string;
  titleAccent?: string;
  subtitle?: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  /** Optional third CTA (e.g. Ask Rodha Buddy on faculty detail) */
  tertiaryAction?: { label: string; href: string };
  decorativeImage: string;
  backgroundImage?: string;
  secondaryOutline?: "white" | "orange";
  className?: string;
}

function SecondaryCta({
  action,
  outline = "white",
}: {
  action: { label: string; href: string };
  outline?: "white" | "orange";
}) {
  const isOrangeOutline = outline === "orange";

  return (
    <CounsellingCtaAction
      action={action}
      className={cn(
        "btn-outlined-premium premium-border-glow shine-sweep shine-sweep-outline inline-flex items-center justify-center gap-1.5 text-body-sm px-5 py-2.5 rounded-[6px] whitespace-nowrap bg-transparent transition-colors font-semibold w-full sm:w-auto",
        isOrangeOutline
          ? "glow-accent-orange border border-orange-500 text-white hover:bg-orange-500/10"
          : "glow-accent-silver border border-white text-white hover:bg-white/10"
      )}
    >
      {action.label}
      <Icon src="/assets/icons/arrow-right.svg" size={14} className="text-orange-500" />
    </CounsellingCtaAction>
  );
}

/**
 * MBA CTA — duplicated from CTABandV2 with decorative image layout:
 * Desktop: image left / content right
 * Mobile: content then image
 * Image bottom-aligned flush to the card.
 */
export function CTABandV2Decorative({
  title,
  titleAccent,
  subtitle,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  decorativeImage,
  backgroundImage,
  secondaryOutline = "white",
  className,
}: CTABandV2DecorativeProps) {
  const hasBuddy = Boolean(tertiaryAction && /buddy/i.test(tertiaryAction.label));

  return (
    <section
      id="site-footer-cta"
      data-home-zone="cta"
      className={cn("home-section-spacing pt-6 md:pt-8 bg-section-beige", className)}
    >
      <div className="container-rodha">
        <div
          className={cn(
            "relative isolate overflow-hidden",
            "min-h-[360px] sm:min-h-[380px]",
            "rounded-[8px] md:rounded-xl",
            "border border-orange-500/30",
            "flex items-stretch",
            "after:absolute after:inset-0 after:z-10 after:pointer-events-none",
            "after:bg-gradient-to-r after:from-black/75 after:via-black/55 after:to-black/25"
          )}
        >
          {backgroundImage && (
            <Image
              src={backgroundImage}
              alt=""
              fill
              className={cn(
                "z-0 object-cover object-[center_bottom] pointer-events-none",
                "cta-image-pan-in"
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1280px"
              priority={false}
            />
          )}

          <RevealGroup className="relative z-20 flex w-full">
            <div
              className={cn(
                "flex w-full flex-col md:flex-row md:items-stretch",
                "cta-content-reveal"
              )}
            >
              {/* Decorative image — desktop left, mobile after content */}
              <div
                className={cn(
                  "relative order-2 md:order-1",
                  "w-full md:w-[42%] lg:w-[38%]",
                  "min-h-[220px] md:min-h-0",
                  "flex items-end justify-center",
                  "px-4 md:px-0 md:pl-4 lg:pl-6"
                )}
              >
                <div className="relative h-full w-full max-w-[320px] md:max-w-none">
                  <Image
                    src={decorativeImage}
                    alt=""
                    fill
                    className="object-contain object-bottom pointer-events-none"
                    sizes="(max-width: 768px) 80vw, 40vw"
                    priority={false}
                  />
                </div>
              </div>

              {/* Content — mobile first, desktop right */}
              <div
                className={cn(
                  "order-1 md:order-2",
                  "flex flex-1 flex-col justify-center",
                  "px-5 py-10 sm:px-7 sm:py-12 md:px-8 md:py-14 lg:px-10",
                  "md:pr-10 lg:pr-12"
                )}
              >
                <div className="flex max-w-xl flex-col gap-5 md:gap-6">
                  <div className="min-w-0">
                    <h2 className="text-h3 md:text-[30px] lg:text-4xl font-medium font-montserrat leading-tight text-white">
                      <span className="block">{title}</span>
                      {titleAccent && <span className="block">{titleAccent}</span>}
                    </h2>

                    {subtitle && (
                      <p className="mt-2.5 max-w-xl text-body text-white/80">
                        {subtitle}
                      </p>
                    )}
                  </div>

                  <div
                    className={cn(
                      "flex w-full shrink-0 flex-col gap-3",
                      "sm:w-auto sm:flex-row sm:flex-wrap sm:items-center",
                      "mt-2 md:mt-1",
                      "cta-actions-reveal"
                    )}
                  >
                    <CounsellingCtaAction
                      action={primaryAction}
                      className="btn-primary btn-primary-premium premium-border-glow glow-accent-orange w-full px-5 py-2.5 rounded-[6px] whitespace-nowrap text-center sm:w-auto"
                    />

                    {secondaryAction && (
                      <SecondaryCta
                        action={secondaryAction}
                        outline={secondaryOutline}
                      />
                    )}

                    {tertiaryAction && (
                      <a
                        href={tertiaryAction.href}
                        target={
                          tertiaryAction.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          tertiaryAction.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="btn-outlined-premium premium-border-glow glow-accent-silver shine-sweep shine-sweep-outline inline-flex items-center justify-center gap-2 text-body-sm px-5 py-2.5 rounded-[6px] whitespace-nowrap border border-white text-white bg-transparent hover:bg-white/10 transition-colors font-semibold w-full sm:w-auto"
                      >
                        {hasBuddy && (
                          <Icon
                            src="/assets/icons/ai-buddy.svg"
                            size={16}
                            className="text-orange-400"
                          />
                        )}
                        {tertiaryAction.label}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
