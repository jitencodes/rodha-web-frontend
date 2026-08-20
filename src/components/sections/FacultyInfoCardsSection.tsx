import { cn } from "@/lib/utils";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { Tag } from "@/components/ui/Tag";
import { FacultyInfoCard } from "@/components/cards/FacultyInfoCard";
import { getFacultyHonorific } from "@/data/faculty";
import type { Faculty } from "@/lib/types";

const LIGHT_TAG =
  "rounded-md! text-caption bg-white hover:text-black text-neutral-600 border-section-beige hover:border-orange-500/35";

interface FacultyInfoCardsSectionProps {
  faculty: Faculty;
  className?: string;
}

export function FacultyInfoCardsSection({
  faculty,
  className,
}: FacultyInfoCardsSectionProps) {
  const about = faculty.about;
  const philosophy = faculty.philosophy;
  const expertise = faculty.expertiseTags;
  const honorific = getFacultyHonorific(faculty);

  const hasAbout = Boolean(about);
  const hasPhilosophy = Boolean(philosophy);
  const hasExpertise = Boolean(expertise?.length);

  if (!hasAbout && !hasPhilosophy && !hasExpertise) return null;

  return (
    <section
      className={cn(
        "home-section-spacing bg-section-white home-on-light relative z-10",
        className
      )}
    >
      <div className="container-rodha">
        <RevealGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-stretch">
            {hasAbout && (
              <div className="reveal-child reveal-delay-1 h-full">
                <FacultyInfoCard title={`About ${honorific}`}>
                  {about!.split("\n\n").map((para) => (
                    <p
                      key={para.slice(0, 24)}
                      className="text-body-sm text-neutral-600 leading-relaxed [&:not(:first-child)]:mt-3"
                    >
                      {para}
                    </p>
                  ))}
                </FacultyInfoCard>
              </div>
            )}

            {hasPhilosophy && (
              <div className="reveal-child reveal-delay-2 h-full">
                <FacultyInfoCard title="Teaching Philosophy" variant="quote">
                  {philosophy}
                </FacultyInfoCard>
              </div>
            )}

            {hasExpertise && (
              <div
                className={cn(
                  "reveal-child reveal-delay-3 h-full",
                  !hasAbout && !hasPhilosophy && "md:col-span-2 lg:col-span-3"
                )}
              >
                <FacultyInfoCard title="Subject Expertise">
                  <div className="flex flex-wrap gap-2">
                    {expertise!.map((tag) => (
                      <Tag key={tag} className={LIGHT_TAG}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </FacultyInfoCard>
              </div>
            )}
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
