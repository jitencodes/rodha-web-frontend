import Image from "next/image";
import { cn } from "@/lib/utils";
import { Rating } from "@/components/ui/Rating";
import type { FacultyReview } from "@/lib/types";
import { getInitials } from "@/lib/initials";

interface FacultyReviewCardProps {
  reviews: FacultyReview[];
  className?: string;
}

const LIGHT_CARD =
  "rounded-xl border border-section-beige bg-white shadow-sm shadow-orange-500/5";

export function FacultyReviewCard({ reviews, className }: FacultyReviewCardProps) {
  return (
    <div
      className={cn(
        "card-premium-hover hover-shine flex flex-col p-5 md:p-6 h-full",
        LIGHT_CARD,
        className
      )}
    >
      <h3 className="text-h4 font-semibold text-neutral-900">Student Reviews</h3>

      <ul className="mt-5 space-y-4 max-h-[320px] overflow-y-auto pr-1">
        {reviews.map((review) => {
          const hasAvatar =
            Boolean(review.avatar) && !review.avatar!.includes("placeholders/");
          const initials = getInitials(review.name);

          return (
            <li key={review.id} className="flex gap-3">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-section-beige flex items-center justify-center">
                {hasAvatar ? (
                  <Image
                    src={review.avatar!}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                ) : (
                  <span className="text-caption font-semibold text-orange-600">
                    {initials}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-body-sm font-medium text-neutral-900 truncate">
                    {review.name}
                  </p>
                  <Rating value={review.rating} size="sm" className="shrink-0" />
                </div>
                <p className="mt-1 text-caption text-neutral-600 leading-relaxed line-clamp-3">
                  {review.quote}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
