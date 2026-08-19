import Image from "next/image";
import { cn } from "@/lib/utils";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { FacultyStatCard } from "@/components/cards/FacultyStatCard";
import { FacultyIcon } from "@/lib/faculty-icons";
import type { Faculty } from "@/lib/types";

interface FacultyDetailHeroSectionProps {
  faculty: Faculty;
  className?: string;
}

export function FacultyDetailHeroSection({
  faculty,
  className,
}: FacultyDetailHeroSectionProps) {
  const badgeLabel = faculty.badgeLabel ?? faculty.title;
  const designation = faculty.designation ?? faculty.qualification;
  const tags = faculty.specialization;
  const heroStats = faculty.heroStats ?? [];

  return (
    <section
      className={cn("relative overflow-hidden", className)}
    >
      {/* <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 55% at 75% 45%, rgba(249,115,22,0.14) 0%, transparent 65%), radial-gradient(ellipse 35% 45% at 20% 70%, rgba(249,115,22,0.06) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div className="hero-atmosphere" aria-hidden /> */}

      <div className="container-rodha relative z-10 py-5 md:py-7 lg:py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Faculty", href: "/faculty" },
            { label: faculty.name },
          ]}
          className="py-0 pb-5 md:pb-6"
        />

        <RevealGroup>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] gap-8 lg:gap-10 items-end lg:items-center">
            <div className="reveal-child reveal-delay-1 relative mx-auto lg:mx-0 w-full max-w-[300px] lg:max-w-none h-[280px] sm:h-[320px] lg:h-[400px]">
              <Image
                src={faculty.image || "/assets/images/placeholders/faculty-avatar.svg"}
                alt={faculty.name}
                fill
                className="object-contain object-bottom"
                sizes="(max-width: 1024px) 300px, 38vw"
                fetchPriority="high"
              />
            </div>

            <div className="reveal-child reveal-delay-2 min-w-0 text-center lg:text-left self-center">
              <Badge
                variant="default"
                className="bg-transparent! text-orange-400! border-orange-500/60! px-3 py-1 rounded-full text-caption font-medium"
              >
                {badgeLabel}
              </Badge>

              <h1 className="mt-3 text-[32px] sm:text-[40px] md:text-hero font-bold leading-[1.1] tracking-tight text-text-primary">
                {faculty.name}
              </h1>

              <p className="mt-2 text-body-lg text-text-muted">{designation}</p>

              {faculty.rating != null && (
                <div className="mt-3 flex items-center justify-center lg:justify-start gap-2 text-body text-text-primary">
                  <FacultyIcon name="star" size={16} className="text-accent-yellow" />
                  <span className="font-semibold">{faculty.rating.toFixed(1)}</span>
                  {faculty.reviewCountLabel && (
                    <span className="text-text-dimmed">
                      ({faculty.reviewCountLabel})
                    </span>
                  )}
                </div>
              )}

              {tags.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-2">
                  {tags.map((tag) => (
                    <Tag key={tag} className="rounded-md! text-caption">
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}

              {heroStats.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {heroStats.map((stat) => (
                    <FacultyStatCard
                      key={stat.id}
                      stat={stat}
                      className={
                        heroStats.length === 3
                          ? "last:col-span-2 sm:last:col-span-1"
                          : undefined
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
