import Image from "next/image";
import { cn } from "@/lib/utils";
import type { LeadershipMember } from "@/lib/types";

interface LeadershipCardProps {
  member: LeadershipMember;
  className?: string;
}

/** Filled LinkedIn mark (not the stroke outline icon) */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function LeadershipCard({ member, className }: LeadershipCardProps) {
  return (
    <article
      className={cn(
        "relative overflow-hidden flex flex-col w-[240px] md:w-[260px] shrink-0 rounded-[6px] border border-section-beige bg-white shadow-sm hover-shine",
        className
      )}
    >
      <div className="relative h-[200px] shrink-0 bg-[#FFF8F1]">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-contain object-bottom"
          sizes="260px"
        />
      </div>

      <div className="flex-1 p-4 flex flex-col min-w-0">
        <h3 className="text-body font-semibold text-neutral-900 leading-snug">
          {member.name}
        </h3>
        <p className="mt-1 text-body-sm text-orange-500 font-medium">{member.role}</p>

        <p className="mt-2 text-body-sm text-neutral-600 leading-relaxed line-clamp-3">
          {member.bio}
        </p>

        {member.linkedIn && (
          <a
            href={member.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 self-end inline-flex items-center justify-center w-8 h-8 rounded-full border border-neutral-300 text-neutral-500 hover:border-orange-400 hover:text-orange-500 transition-colors"
            aria-label={`${member.name} on LinkedIn`}
          >
            <LinkedInIcon className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
