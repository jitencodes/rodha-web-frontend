import Image from "next/image";
import { cn } from "@/lib/utils";

interface IconProps {
  src: string;
  className?: string;
  size?: number;
  alt?: string;
}

export function Icon({
  src,
  className,
  size = 20,
  alt = "",
}: IconProps) {
  const isSvg =
    src.toLowerCase().split("?")[0].endsWith(".svg") ||
    src.startsWith("data:image/svg+xml");

  if (isSvg) {
    return (
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={cn("shrink-0 object-contain", className)}
        style={{
          filter:
            "brightness(0) saturate(100%) invert(48%) sepia(96%) saturate(1885%) hue-rotate(4deg) brightness(101%) contrast(101%)",
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      sizes={`${size}px`}
    />
  );
}