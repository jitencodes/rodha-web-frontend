import { cn } from "@/lib/utils";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { Tag } from "@/components/ui/Tag";
import { Icon } from "@/components/ui/Icon";
import { FacultyInfoCard } from "@/components/cards/FacultyInfoCard";
import type { Faculty } from "@/lib/types";

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
  const firstName = faculty.name.split(" ")[0];
  const femaleFirst = new Set([
    "Neha",
    "Megha",
    "Sana",
    "Riya",
    "Priya",
    "Aisha",
  ]);
  const honorific = femaleFirst.has(firstName)
    ? `${firstName} Ma'am`
    : `${firstName} Sir`;

  const hasAbout = Boolean(about);
  const hasPhilosophy = Boolean(philosophy);
  const hasAboutOrPhilosophy = hasAbout || hasPhilosophy;
  const hasExpertise = Boolean(expertise?.length);

  if (!hasAboutOrPhilosophy && !hasExpertise) return null;

  return (
    <section className={cn("home-section-spacing bg-section-white home-on-light relative z-10", className)}>
      <div className="container-rodha">
        <RevealGroup>
          <div
            className={cn(
              "grid gap-4 md:gap-5 items-stretch",
              hasAboutOrPhilosophy && hasExpertise
                ? "grid-cols-1 lg:grid-cols-[1fr_0.42fr]"
                : "grid-cols-1"
            )}
          >
            {hasAboutOrPhilosophy && (
              <div className="reveal-child reveal-delay-1 h-full">
                <div
                  className={cn(
                    "card-base card-premium-hover premium-border-glow hover-shine",
                    "flex flex-col lg:flex-row rounded-xl bg-bg-secondary p-5 md:p-6 h-full min-h-0"
                  )}
                >
                  {hasAbout && (
                    <div className="flex-1 min-w-0 lg:pr-6">
                      <h3 className="text-h4 font-semibold text-text-primary">
                        About {honorific}
                      </h3>
                      <div className="mt-3">
                        {about!.split("\n\n").map((para) => (
                          <p
                            key={para.slice(0, 24)}
                            className="text-body-sm text-text-muted leading-relaxed [&:not(:first-child)]:mt-3"
                          >
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {hasAbout && hasPhilosophy && (
                    <div
                      className="my-5 lg:my-0 lg:mx-0 h-px w-full lg:h-auto lg:w-px lg:self-stretch bg-border-default shrink-0"
                      aria-hidden
                    />
                  )}

                  {hasPhilosophy && (
                    <div
                      className={cn(
                        "flex-1 min-w-0",
                        hasAbout && "lg:pl-6"
                      )}
                    >
                      <h3 className="text-h4 font-semibold text-text-primary">
                        Teaching Philosophy
                      </h3>
                      <div className="mt-3 relative">
                        <Icon
                          src="/assets/icons/quote.svg"
                          size={28}
                          className="text-orange-500 mb-2"
                        />
                        <p className="text-body text-text-secondary italic leading-relaxed">
                          {philosophy}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {hasExpertise && (
              <div className="reveal-child reveal-delay-2 h-full">
                <FacultyInfoCard title="Subject Expertise">
                  <div className="flex flex-wrap gap-2">
                    {expertise!.map((tag) => (
                      <Tag key={tag} className="rounded-md! text-caption">
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
