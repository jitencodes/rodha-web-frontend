import { cn } from "@/lib/utils";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { FacultyAchievementCard } from "@/components/cards/FacultyAchievementCard";
import type { Faculty } from "@/lib/types";
import { getCoursesForFaculty } from "@/data/faculty";

interface FacultyAchievementsPublicationsSectionProps {
  faculty: Faculty;
  className?: string;
}

export function FacultyAchievementsPublicationsSection({
  faculty,
  className,
}: FacultyAchievementsPublicationsSectionProps) {
  const achievements = faculty.achievements;
  const hasAchievements = Boolean(achievements?.length);
  const courses = getCoursesForFaculty(faculty);
  if (!hasAchievements) return null;
  const hasCourses = courses.length > 0;
  return (
    <section
      className={cn("home-section-spacing bg-section-white home-on-light", !hasCourses && "!pt-0", className)}
    >
      <div className="container-rodha">
        <RevealGroup>
          <div className="reveal-child reveal-delay-1">
            <FacultyAchievementCard items={achievements!} />
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
