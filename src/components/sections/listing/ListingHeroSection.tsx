import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { cn } from "@/lib/utils";

interface ListingHeroSectionProps {
  breadcrumb: BreadcrumbItem[];
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  imageClassName?: string;
  className?: string;
}

export function ListingHeroSection({
  breadcrumb,
  eyebrow,
  title,
  accent,
  subtitle,
  imageSrc,
  imageAlt,
  imageClassName,
  className,
}: ListingHeroSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-bg-primary min-h-[380px] md:min-h-[530px]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl"
        aria-hidden
      />

      <div className="pointer-events-none absolute bottom-30 right-0 hidden h-[62%] w-[28%] lg:block xlgl:h-[76%] lg:w-[70%]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className={cn(
            "object-contain object-right-bottom",
            imageClassName
          )}
          sizes="42vw"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, var(--bg-primary) 0%, rgba(10,10,10,0.7) 20%, transparent 50%)",
          }}
        />
      </div>

      <Container className="relative z-10 py-6 md:py-8 lg:py-10 lg:min-h-[460px] flex flex-col justify-center">
        <Breadcrumb className="py-0 pb-4 md:pb-5" items={breadcrumb} />

        <div className="max-w-xl lg:max-w-lg">
          <p className="text-body-sm uppercase tracking-wider text-orange-400 font-semibold mb-2">
            {eyebrow}
          </p>
          <h1 className="text-[26px] sm:text-[38px] md:text-[42px] font-montserrat font-bold leading-[1.15] tracking-tight text-text-primary">
            {title}{" "}
            <span className="text-orange-500">{accent}</span>
          </h1>
          <p className="mt-4 max-w-md text-body-lg text-text-secondary leading-relaxed">
            {subtitle}
          </p>
        </div>
      </Container>
    </section>
  );
}
