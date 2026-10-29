"use client";

import { useState } from "react";
import Image from "next/image";

import { ForumAvatar } from "@/components/sections/discussion-forum/ForumAvatar";
import { cn } from "@/lib/utils";

type ForumGroupIconProps = {
  name: string;
  src: string | null;
  className?: string;
};

export function ForumGroupIcon({ name, src, className }: ForumGroupIconProps) {
  const [failed, setFailed] = useState(false);
  const isSvg = Boolean(src && /\.svg($|\?)/i.test(src));

  if (!src || failed) {
    return (
      <ForumAvatar
        name={name}
        className={cn("size-14 rounded-xl", className)}
        textClassName="text-sm"
      />
    );
  }

  return (
    <Image
      src={src}
      alt=""
      width={56}
      height={56}
      unoptimized={isSvg}
      onError={() => setFailed(true)}
      className={cn("size-14 shrink-0 rounded-xl object-cover", className)}
    />
  );
}
