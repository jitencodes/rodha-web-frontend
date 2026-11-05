import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { YoutubeStoryCard } from "@/components/cards/YoutubeStoryCard";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { InfiniteMarquee } from "@/components/ui/infiniteMarquee";
import type { StudentStory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SuccessStoriesSectionProps {
  stories: StudentStory[];
  subtitle?: string;
  className?: string;
  /** Optional listing deep-link (e.g. `/success-stories?category=cat`). */
  viewAllHref?: string;
}

export function SuccessStoriesSection({
  stories,
  subtitle,
  className,
  viewAllHref,
}: SuccessStoriesSectionProps) {
  if (stories.length === 0) return null;

  return (
    <section
      data-home-zone="stories"
      className={cn("home-section-spacing relative", className)}
    >
      <Container>
        <SectionHeaderV2
          badge="Rodha Success Stories"
          title={
            <>
              Watch how they{" "}
              <span className="text-orange-500">Did it.</span>
            </>
          }
          subtitle={subtitle}
          align="center"
          className="mx-auto lg:!mb-10"
        />
      </Container>
      <RevealGroup>
        <InfiniteMarquee speed={35} align="center">
          {stories.map((story) => (
            <YoutubeStoryCard
              key={story.id}
              youtubeId={story.youtubeId}
              student={story.student}
              subtitle={story.subtitle}
            />
          ))}
        </InfiniteMarquee>
      </RevealGroup>
      {viewAllHref ? (
        <Container>
          <div className="mt-8 flex justify-center md:mt-10">
            <Link
              href={viewAllHref}
              className="btn-view-all btn-outlined-premium premium-border-glow glow-accent-orange shine-sweep shine-sweep-outline inline-flex"
            >
              View All Success Stories
            </Link>
          </div>
        </Container>
      ) : null}
    </section>
  );
}
