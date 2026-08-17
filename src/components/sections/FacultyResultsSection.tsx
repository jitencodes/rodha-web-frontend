import Image from "next/image";
import { cn } from "@/lib/utils";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { FacultyResultStatCard } from "@/components/cards/FacultyResultStatCard";
import { FACULTY_RESULTS_PODIUM } from "@/data/faculty";
import type { Faculty } from "@/lib/types";

interface FacultyResultsSectionProps {
  faculty: Faculty;
  className?: string;
}

export function FacultyResultsSection({
  faculty,
  className,
}: FacultyResultsSectionProps) {
  const stats = faculty.resultStats;
  if (!stats?.length) return null;

  return (
    <section className={cn("home-section-spacing bg-section-beige home-on-light", className)}>
      <div className="container-rodha">
        <RevealGroup>
          <div
            className={cn(
              "reveal-child reveal-delay-1 relative overflow-hidden rounded-xl border border-orange-500/25 bg-bg-secondary",
              "premium-border-glow glow-accent-orange group",
              "transition-[box-shadow,border-color] duration-300",
              "hover:border-orange-500/45 hover:shadow-[0_0_40px_rgba(249,115,22,0.18)]"
            )}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 50% 80% at 85% 50%, rgba(249,115,22,0.22) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 15% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-8 px-5 py-7 md:px-8 md:py-8">
              <div className="flex-1 w-full grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                {stats.map((stat) => (
                  <FacultyResultStatCard key={stat.id} stat={stat} />
                ))}
              </div>

              <div className="relative w-full max-w-[260px] lg:max-w-[280px] h-[180px] lg:h-[200px] shrink-0">
                <Image
                  src={FACULTY_RESULTS_PODIUM}
                  alt=""
                  fill
                  className="object-contain object-center"
                  sizes="280px"
                />
              </div>
            </div>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
