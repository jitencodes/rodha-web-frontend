import Image from "next/image";
import { HeroVideoEmbed } from "@/components/sections/home/HeroVideoEmbed";

interface HeroBannerMediaProps {
  videoId?: string | null;
  videoUrl?: string | null;
  imageUrl?: string | null;
}

/** YouTube, then a direct video file, then an image. */
export function HeroBannerMedia({
  videoId,
  videoUrl,
  imageUrl,
}: HeroBannerMediaProps) {
  if (videoId) {
    return <HeroVideoEmbed videoId={videoId} />;
  }

  if (videoUrl) {
    return (
      <div className="relative w-full aspect-video overflow-hidden rounded-[6px] border border-white/10 bg-bg-tertiary shadow-lg">
        <video
          src={videoUrl}
          controls
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  if (!imageUrl) return null;

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-[6px] border border-white/10 bg-bg-tertiary shadow-lg">
      <Image
        src={imageUrl}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        fetchPriority="high"
      />
    </div>
  );
}
