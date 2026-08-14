import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: string;
  label?: string;
  badge?: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  align?: "left" | "center";
  subtitleClassName?: string;
  className?: string;
}

export function SectionHeaderV2({
  title,
  subtitle,
  label,
  description,
  viewAllHref,
  viewAllLabel = "View All",
  align = "left",
  subtitleClassName,
  badge,
  className,
}: SectionHeaderProps) {
  const isExternal = Boolean(viewAllHref?.startsWith("http"));
  const hasSplitIntro = Boolean(description);

  return (
    <div
      className={cn(
        "section-header",
        align === "center" && "text-center",
        viewAllHref && align === "left" && !hasSplitIntro && "flex flex-col sm:flex-row items-start justify-between gap-4",
        hasSplitIntro && "grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-end",
        className
      )}
    >
      <div className={cn(hasSplitIntro && "lg:col-span-7")}>
        {label && (
          <p className="text-body-sm uppercase tracking-wider !text-orange-400 font-semibold mb-2">
            {label}
          </p>
        )}
        {badge && (
          <p
            className={cn(
              "section-header-badge text-body-sm uppercase tracking-wider text-white bg-[#F06B23] rounded-full px-4 py-1.5 w-fit font-semibold mb-5 md:mb-6.5",
              align === "center" && "mx-auto"
            )}
          >
            {badge}
          </p>
        )}
        <h2 className="text-h2-v2 text-black font-montserrat font-normal">{title}</h2>
        {subtitle && (
          <p
            className={cn(
              "mt-1 text-body text-text-muted",
              align === "center" && "max-w-2xl mx-auto",
              subtitleClassName
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {description && (
        <p className="lg:col-span-5 text-body text-text-muted leading-relaxed lg:text-right">
          {description}
        </p>
      )}

      {viewAllHref &&
        !hasSplitIntro &&
        (isExternal ? (
          <a
            href={viewAllHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-view-all btn-outlined-premium premium-border-glow glow-accent-orange shrink-0 shine-sweep shine-sweep-outline hidden md:inline-flex"
          >
            {viewAllLabel}
          </a>
        ) : (
          <Link href={viewAllHref} className="btn-view-all btn-outlined-premium premium-border-glow glow-accent-orange shrink-0 shine-sweep shine-sweep-outline hidden md:inline-flex">
            {viewAllLabel}
          </Link>
        ))}
    </div>
  );
}
