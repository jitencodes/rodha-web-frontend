import { cn } from "@/lib/utils";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { FacultyReviewCard } from "@/components/cards/FacultyReviewCard";
import { FacultyVideosPanel } from "@/components/cards/FacultyVideoCard";
import type { Faculty } from "@/lib/types";

interface FacultyReviewsVideosSectionProps {
  faculty: Faculty;
  className?: string;
}

export function FacultyReviewsVideosSection({
  faculty,
  className,
}: FacultyReviewsVideosSectionProps) {
  const reviews = faculty.reviews;
  const videos = faculty.videos;
  const hasReviews = Boolean(reviews?.length && faculty.rating != null);
  const hasVideos = Boolean(videos?.length);

  if (!hasReviews && !hasVideos) return null;

  return (
    <section className={cn("home-section-spacing bg-section-white home-on-light", className)}>
      <div className="container-rodha">
        <RevealGroup>
          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-4 md:gap-5 items-stretch">
            {hasReviews && (
              <div className="reveal-child reveal-delay-1 h-full">
                <FacultyReviewCard
                  rating={faculty.rating!}
                  reviewCountLabel={faculty.reviewCountLabel}
                  reviews={reviews!}
                />
              </div>
            )}
            {hasVideos && (
              <div className="reveal-child reveal-delay-2 h-full">
                <FacultyVideosPanel videos={videos!} />
              </div>
            )}
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
