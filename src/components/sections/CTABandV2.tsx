import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { CounsellingCtaAction } from "@/components/sections/CounsellingCtaAction";
import { RevealGroup } from "../ui/RevealGroup";

interface CTABandV2Props {
  title: string;
  /** Orange accent phrase rendered inline with the title (home CTA variant) */
  titleAccent?: string;
  subtitle?: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  /** Optional third CTA (e.g. Ask Rodha Buddy on faculty detail) */
  tertiaryAction?: { label: string; href: string };
  /** Decorative image on the left (e.g. Meet the Team CTA) */
  decorativeImage?: string;
  /** Full-bleed background image (home CTA variant) */
  backgroundImage?: string;
  /** Secondary button border style */
  secondaryOutline?: "white" | "orange";
  className?: string;
}

function SecondaryCta({
  action,
  variant,
  outline,
}: {
  action: { label: string; href: string };
  /** decorated = white border + orange arrow (team page); default = white border only */
  variant: "default" | "decorated";
  outline?: "white" | "orange";
}) {
  const isOrangeOutline = outline === "orange";

  const className = cn(
    "btn-outlined-premium premium-border-glow shine-sweep shine-sweep-outline inline-flex items-center justify-center text-body-sm px-5 py-2.5 rounded-[6px] whitespace-nowrap bg-transparent transition-colors font-semibold w-full sm:w-auto",
    variant === "decorated" ? "gap-2" : "gap-1.5",
    isOrangeOutline
      ? "glow-accent-orange border border-orange-500 text-white hover:bg-orange-500/10"
      : "glow-accent-silver border border-white text-white hover:bg-white/10"
  );

  return (
    <CounsellingCtaAction action={action} className={className}>
      {action.label}
      {variant === "decorated" && (
        <Icon src="/assets/icons/arrow-right.svg" size={14} className="text-orange-500" />
      )}
    </CounsellingCtaAction>
  );
}

export function CTABandV2({
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
}: CTABandV2Props) {
  const isDecorated = Boolean(decorativeImage);
  const isImageBg = Boolean(backgroundImage);
  const hasBuddy = Boolean(tertiaryAction && /buddy/i.test(tertiaryAction.label));

  return (
    <section id="site-footer-cta" data-home-zone="cta" className={cn("home-section-spacing pt-6 md:pt-8 bg-[#FFF3E8]", className)}>
      <div className="container-rodha">
  <div
    className={cn(
      "relative isolate overflow-hidden",
      "min-h-[360px] sm:min-h-[380px] md:min-h-[400px] lg:min-h-[430px]",
      "rounded-[8px] md:rounded-xl",
      "border border-orange-500/30",
      "px-5 py-10 sm:px-7 sm:py-12 md:px-10 md:py-14 lg:px-12",
      "flex items-center",
      "after:absolute after:inset-0 after:z-10 after:pointer-events-none",
      "after:bg-gradient-to-r after:from-black/75 after:via-black/55 after:to-black/25"
    )}
  >
    {isImageBg && backgroundImage && (
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

    <RevealGroup>
      <div className="relative z-20 flex w-full items-center">
        <div className="w-full max-w-3xl">
          <div
            className={cn(
              "flex flex-col gap-5 md:gap-6",
              isImageBg && "cta-content-reveal"
            )}
          >
            <div className="min-w-0">
              <h2 className="text-h3 md:text-[30px] lg:text-4xl font-medium font-montserrat leading-tight text-white">
                <span className="block">
                  {title}
                </span>

                {titleAccent && (
                  <span className="block">
                    {titleAccent}
                  </span>
                )}
              </h2>

              {subtitle && (
                <p
                  className={cn(
                    "mt-2.5 max-w-xl text-body",
                    "text-white/80"
                  )}
                >
                  {subtitle}
                </p>
              )}
            </div>

            <div
              className={cn(
                "flex w-full shrink-0 flex-col gap-3",
                "sm:w-auto sm:flex-row sm:items-center",
                "mt-2 md:mt-1",
                isImageBg && "cta-actions-reveal"
              )}
            >
              <CounsellingCtaAction
                action={primaryAction}
                className="btn-primary btn-primary-premium premium-border-glow glow-accent-orange w-full px-5 py-2.5 rounded-[6px] whitespace-nowrap text-center sm:w-auto"
              />

              {secondaryAction && (
                <>
                  {!isDecorated && !tertiaryAction && !isImageBg && (
                    <div
                      className="hidden sm:block w-px h-8 bg-white/20 shrink-0"
                      aria-hidden
                    />
                  )}

                  <SecondaryCta
                    action={secondaryAction}
                    variant="default"
                    outline={isImageBg ? secondaryOutline : "white"}
                  />
                </>
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
