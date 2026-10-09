import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

function isSvgSource(src: ImageProps["src"]): src is string {
  if (typeof src !== "string") return false;
  const path = src.split(/[?#]/)[0]?.toLowerCase() ?? "";
  return path.endsWith(".svg") || src.startsWith("data:image/svg+xml");
}

/**
 * next/image rejects SVG sources. Raster URLs keep the optimizer;
 * SVG files render with a plain img so local placeholders and CMS icons load.
 */
export function AppImage({ className, ...props }: ImageProps) {
  if (!isSvgSource(props.src)) {
    return <Image className={className} {...props} />;
  }

  const { src, alt, fill, width, height } = props;

  if (fill) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full", className)}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={typeof width === "number" ? width : undefined}
      height={typeof height === "number" ? height : undefined}
      className={className}
    />
  );
}
