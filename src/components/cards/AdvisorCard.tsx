import { AppImage } from "@/components/ui/AppImage";
import { cn } from "@/lib/utils";
import type { Advisor } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";

interface AdvisorCardProps {
  advisor: Advisor;
  className?: string;
}

export function AdvisorCard({ advisor, className }: AdvisorCardProps) {
  return (
    <article
      className={cn(
        "card-base advisor-card-base card-premium-hover hover-shine relative overflow-hidden flex flex-row items-stretch rounded-[6px] h-full min-h-[148px] min-w-[260px] w-full",
        className
      )}
    >
      <div className="relative w-[100px] sm:w-[112px] shrink-0 self-stretch">
        <AppImage
          src={advisor.image}
          alt={advisor.name}
          fill
          className="object-cover object-top"
          sizes="112px"
        />
      </div>

      <div className="relative flex-1 min-w-0 flex flex-col justify-center p-3.5 md:p-4 pr-10">
        <Icon
          src="/assets/icons/quote.svg"
          size={22}
          className="absolute top-3.5 right-3.5 text-orange-500"
        />
        <h3 className="text-body font-semibold text-text-primary leading-snug">
          {advisor.name}
        </h3>
        <p className="mt-1 text-body-sm text-orange-400 font-medium">{advisor.role}</p>
        <p className="mt-1.5 text-body-sm text-text-muted leading-snug">
          {advisor.formerRole}
        </p>
        <p className="mt-0.5 text-body-sm text-text-muted leading-snug">
          {advisor.formerOrganization}
        </p>
      </div>
    </article>
  );
}
