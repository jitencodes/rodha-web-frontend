import Link from "next/link";
import type { ReactNode } from "react";
import { cn, isExternalHref } from "@/lib/utils";

interface BannerImageLinkProps {
  /** CMS banner `redirectUrl`. When empty, children render unwrapped. */
  href?: string | null;
  className?: string;
  children: ReactNode;
}

/**
 * Makes a hero banner image clickable when the CMS sets `redirectUrl`.
 * Internal paths use `next/link`; absolute URLs open in a new tab.
 */
export function BannerImageLink({
  href,
  className,
  children,
}: BannerImageLinkProps) {
  const target = href?.trim();
  if (!target) return <>{children}</>;

  const linkClassName = cn("block cursor-pointer", className);

  if (isExternalHref(target)) {
    return (
      <a
        href={target}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open banner link"
        className={linkClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={target} aria-label="Open banner link" className={linkClassName}>
      {children}
    </Link>
  );
}
