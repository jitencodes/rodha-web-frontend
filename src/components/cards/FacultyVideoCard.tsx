import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FacultyIcon } from "@/lib/faculty-icons";
import type { FacultyVideo } from "@/lib/types";

interface FacultyVideoCardProps {
  video: FacultyVideo;
  className?: string;
}

export function FacultyVideoCard({ video, className }: FacultyVideoCardProps) {
  const isExternal = Boolean(video.href?.startsWith("http"));

  const inner = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-section-beige">
        <Image
          src={video.thumbnail}
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 200px"
        />
        <div className="absolute inset-0 bg-black/25" />
        <span className="absolute top-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
          {video.duration}
        </span>
        <span
          className={cn(
            "absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-orange-500",
            "transition-transform duration-300 group-hover:scale-110",
            "animate-[pulse_2.4s_ease-in-out_infinite]"
          )}
        >
          <FacultyIcon name="play" size={18} />
        </span>
      </div>
      <p className="mt-2.5 text-body-sm font-medium text-neutral-900 leading-snug line-clamp-2">
        {video.title}
      </p>
    </>
  );

  const classes = cn("group block min-w-0", className);

  if (video.href) {
    if (isExternal) {
      return (
        <a
          href={video.href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={video.href} className={classes}>
        {inner}
      </Link>
    );
  }

  return <div className={classes}>{inner}</div>;
}

interface FacultyVideosPanelProps {
  title?: string;
  videos: FacultyVideo[];
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

const LIGHT_CARD =
  "rounded-xl border border-section-beige bg-white shadow-sm shadow-orange-500/5";

export function FacultyVideosPanel({
  title = "Video Lecture Snippets",
  videos,
  viewAllHref,
  viewAllLabel = "View All Videos →",
  className,
}: FacultyVideosPanelProps) {
  const viewAllIsExternal = Boolean(viewAllHref?.startsWith("http"));

  return (
    <div
      className={cn(
        "card-premium-hover hover-shine flex flex-col p-5 md:p-6 h-full",
        LIGHT_CARD,
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-h4 font-semibold text-neutral-900">{title}</h3>
        {viewAllHref &&
          (viewAllIsExternal ? (
            <a
              href={viewAllHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-view-all text-caption text-orange-500 hover:text-orange-600 whitespace-nowrap"
            >
              {viewAllLabel}
            </a>
          ) : (
            <Link
              href={viewAllHref}
              className="btn-view-all text-caption text-orange-500 hover:text-orange-600 whitespace-nowrap"
            >
              {viewAllLabel}
            </Link>
          ))}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {videos.map((video) => (
          <FacultyVideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
