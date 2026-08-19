import Image from "next/image";
import { cn } from "@/lib/utils";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { FacultyResultStatCard } from "@/components/cards/FacultyResultStatCard";
import { getFacultyHonorific } from "@/data/faculty";
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

  const honorific = getFacultyHonorific(faculty);

  return (
    <section
      className={cn("home-section-spacing bg-section-white home-on-light", className)}
    >
      <div className="container-rodha">
        <RevealGroup>
          <div className="reveal-child reveal-delay-1">
            <SectionHeaderV2 title={`Results Attributed to ${honorific}`} />
          </div>

          <div
            className={cn(
              "reveal-child reveal-delay-2 relative overflow-hidden rounded-xl",
              "border border-section-beige bg-[#FFF3E8] shadow-sm shadow-orange-500/5"
            )}
          >
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-8 px-5 py-7 md:px-8 md:py-8">
              <div className="flex-1 w-full flex divide-x divide-orange-600">
                {stats.map((stat) => (
                  <div key={stat.id} className="flex-1 flex justify-center px-5 md:px-6">
                    <FacultyResultStatCard stat={stat} />
                  </div>
                ))}
              </div>

              <div className="relative w-full max-w-[260px] lg:max-w-[280px] h-[180px] lg:h-[140px] shrink-0">
                <Image
                  src={FACULTY_RESULTS_PODIUM}
                  alt=""
                  fill
                  className="object-contain object-center h-auto"
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
