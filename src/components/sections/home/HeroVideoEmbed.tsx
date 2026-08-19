"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const VIDEO_ID = "W1dLmx5-tH4";

interface HeroVideoEmbedProps {
  className?: string;
  videoId?: string;
  thumbnailUrl?: string;
}

export function HeroVideoEmbed({ className, videoId=VIDEO_ID, thumbnailUrl }: HeroVideoEmbedProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const EMBED_URL = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&playsinline=1`;
  const THUMBNAIL = thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div
      className={cn(
        "relative w-full aspect-video rounded-[6px] overflow-hidden border border-white/10 shadow-lg bg-bg-tertiary",
        className
      )}
    >
      {!hasStarted ? (
        <button
          type="button"
          onClick={() => setHasStarted(true)}
          className="absolute inset-0 w-full h-full cursor-pointer group"
          aria-label="Play Rodha promotional video"
        >
          <Image
            src={THUMBNAIL}
            alt="Rodha promotional video thumbnail"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-bg-primary/40 group-hover:bg-bg-primary/30 transition-colors flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-orange-500/90 flex items-center justify-center shadow-orange-lg group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      ) : (
        <iframe
          src={EMBED_URL}
          title="Rodha promotional video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  );
}
