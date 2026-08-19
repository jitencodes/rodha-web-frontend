import { cn } from "@/lib/utils";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { FacultyAchievementCard } from "@/components/cards/FacultyAchievementCard";
import { FacultyPublicationCard } from "@/components/cards/FacultyPublicationCard";
import type { Faculty } from "@/lib/types";

interface FacultyAchievementsPublicationsSectionProps {
  faculty: Faculty;
  className?: string;
}

export function FacultyAchievementsPublicationsSection({
  faculty,
  className,
}: FacultyAchievementsPublicationsSectionProps) {
  const achievements = faculty.achievements;
  const publications = faculty.publications;
  const hasAchievements = Boolean(achievements?.length);
  const hasPublications = Boolean(publications?.length);

  if (!hasAchievements && !hasPublications) return null;

  return (
    <section
      className={cn("home-section-spacing bg-section-white home-on-light", className)}
    >
      <div className="container-rodha">
        <RevealGroup>
          <div className="grid grid-cols-1 lg:grid-cols-[48%_52%] gap-4 md:gap-5 items-stretch">
            {hasAchievements && (
              <div className="reveal-child reveal-delay-1 h-full">
                <FacultyAchievementCard items={achievements!} />
              </div>
            )}
            {hasPublications && (
              <div className="reveal-child reveal-delay-2 h-full">
                <FacultyPublicationCard items={publications!} />
              </div>
            )}
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
