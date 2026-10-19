import Link from "next/link";
import {
  BookOpen,
  FileText,
  Play,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { AppImage } from "@/components/ui/AppImage";
import {
  RESOURCE_TYPE_LABELS,
  type ResourceType,
  type ResourceViewModel,
} from "@/lib/api/modules/resources/types";
import { cn, isExternalHref } from "@/lib/utils";

const TYPE_STYLE: Record<ResourceType, { icon: LucideIcon; className: string }> = {
  FREE_COURSE: { icon: BookOpen, className: "bg-orange-500 text-white" },
  FREE_TEST_SERIES: { icon: FileText, className: "bg-blue-500 text-white" },
  FREE_TOOL: { icon: Wrench, className: "bg-amber-500 text-white" },
  COMMUNITY_HANDLE: { icon: Users, className: "bg-emerald-500 text-white" },
  DOCUMENT: { icon: FileText, className: "bg-red-500 text-white" },
  YOUTUBE_LINK: { icon: Play, className: "bg-red-600 text-white" },
};

interface ResourceCardProps {
  resource: ResourceViewModel;
  className?: string;
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
  const typeMeta = TYPE_STYLE[resource.type];
  const TypeIcon = typeMeta.icon;
  const external = isExternalHref(resource.href);
  const categoryHref = resource.categorySlug
    ? `/resources?category=${encodeURIComponent(resource.categorySlug)}`
    : undefined;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-section-beige bg-white shadow-sm transition-shadow hover:shadow-md hover:shadow-orange-500/20",
        className
      )}
    >
      <Link
        href={resource.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="relative aspect-[16/10] overflow-hidden"
      >
        <AppImage
          src={resource.thumbnailUrl}
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <span
          className={cn(
            "absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
            typeMeta.className
          )}
        >
          <TypeIcon className="h-3 w-3" aria-hidden />
          {RESOURCE_TYPE_LABELS[resource.type]}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {resource.categoryLabel && categoryHref ? (
          <Link
            href={categoryHref}
            className="inline-flex w-fit items-center rounded-full bg-orange-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-600 transition-colors hover:bg-orange-500/20"
          >
            {resource.categoryLabel}
          </Link>
        ) : null}
        <Link
          href={resource.href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className={cn("flex-1", resource.categoryLabel && "mt-2.5")}
        >
          <h3 className="line-clamp-2 text-body font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-orange-600">
            {resource.title}
          </h3>
          {resource.description ? (
            <p className="mt-2 line-clamp-2 text-caption text-neutral-500">
              {resource.description}
            </p>
          ) : null}
        </Link>
        {resource.cta ? (
          <p className="mt-3 text-caption font-medium text-orange-600">{resource.cta}</p>
        ) : null}
      </div>
    </article>
  );
}
