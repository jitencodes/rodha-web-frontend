"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type ForumAvatarProps = {
  name: string;
  /** Profile picture URL from the API. Falls back to initials when missing or broken. */
  src?: string | null;
  className?: string;
  textClassName?: string;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

/** Profile photo, or an initials circle in Rodha orange (light forum theme). */
export function ForumAvatar({
  name,
  src,
  className,
  textClassName,
}: ForumAvatarProps) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <Image
        src={src}
        alt={name}
        width={64}
        height={64}
        sizes="64px"
        onError={() => setFailed(true)}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  // <span> keeps the fallback valid inside text elements (e.g. a <p> meta line).
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-700 select-none",
        className
      )}
    >
      <span className={cn("leading-none", textClassName)}>{getInitials(name)}</span>
    </span>
  );
}
