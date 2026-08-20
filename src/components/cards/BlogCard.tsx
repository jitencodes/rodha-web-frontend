import Link from "next/link";
import Image from "next/image";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import type { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  variant?: "overlay" | "article";
  className?: string;
}

const CATEGORY_BADGE: Record<
  string,
  "primary" | "info" | "purple" | "amber" | "success" | "danger"
> = {
  "mba-cat": "primary",
  ipmat: "purple",
  clat: "amber",
  banking: "success",
  ssc: "success",
  "study-tips": "info",
  "career-guidance": "danger",
  "exam-updates": "primary",
  // legacy compat
  CAT: "primary",
  IPMAT: "purple",
  GDPI: "info",
  CLAT: "amber",
  Banking: "success",
  "Skill House": "danger",
};

const CATEGORY_LABEL: Record<string, string> = {
  "mba-cat": "MBA",
  ipmat: "IPMAT",
  clat: "CLAT/Law",
  banking: "Banking",
  ssc: "SSC",
  "study-tips": "Study Tips",
  "career-guidance": "Career Guidance",
  "exam-updates": "Exam Updates",
};

function getCategoryLabel(category: string) {
  return CATEGORY_LABEL[category] ?? category;
}

// ---------------------------------------------------------------------------
// Overlay variant (legacy homepage dark card)
// ---------------------------------------------------------------------------

function OverlayCard({ post, featured, className }: Omit<BlogCardProps, "variant">) {
  const badgeVariant = featured
    ? "primary"
    : CATEGORY_BADGE[post.category] ?? "info";

  const imgSrc =
    post.image || post.thumbnail || "/assets/images/placeholders/blog-thumbnail.svg";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "relative overflow-hidden rounded-[6px] border border-border-default group block card-premium-hover hover-shine h-full min-h-[160px]",
        featured
          ? "min-h-[360px] md:min-h-full"
          : "min-h-[180px] md:min-h-[200px]",
        className
      )}
    >
      <Image
        src={imgSrc}
        alt={post.title}
        fill
        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
        sizes={
          featured
            ? "(max-width: 768px) 100vw, 30vw"
            : "(max-width: 768px) 100vw, 25vw"
        }
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />

      <div className="absolute top-3 left-3 z-10">
        <Badge variant={badgeVariant} size="sm">
          {featured ? "Featured" : getCategoryLabel(post.category)}
        </Badge>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3.5 md:p-4 z-10 text-left">
        <div className="flex items-center gap-2 text-caption text-text-secondary">
          <span>{post.readTime}</span>
          <span>&middot;</span>
          <span>
            {formatDate(post.publishedAt ?? post.publishedDate, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <h3
          className={cn(
            "mt-1.5 font-semibold text-text-primary group-hover:text-orange-400 transition-colors after:content-['→'] after:inline-block after:ml-1.5 after:text-orange-400 after:transition-transform after:duration-300 group-hover:after:translate-x-1",
            featured
              ? "text-h3 md:text-h2 line-clamp-3"
              : "text-body line-clamp-2"
          )}
        >
          {post.title}
        </h3>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Article variant (listing / related cards — light theme)
// ---------------------------------------------------------------------------

function ArticleCard({ post, featured, className }: Omit<BlogCardProps, "variant">) {
  const imgSrc = post.thumbnail || post.image || "/assets/images/placeholders/blog-thumbnail.svg";

  if (featured) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-xl border border-section-beige bg-white shadow-sm hover:shadow-orange-500/20 transition-shadow",
          className
        )}
      >
        <Link
          href={`/blog/${post.slug}`}
          className="relative aspect-[16/10] md:aspect-auto md:min-h-[280px] overflow-hidden group"
        >
          <Image
            src={imgSrc}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </Link>
        <div className="flex flex-col justify-center p-5 md:p-7">
          <Link
            href={`/blog?category=${post.category}`}
            className="inline-flex items-center rounded-full bg-orange-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-600 hover:bg-orange-500/20 transition-colors w-fit"
          >
            {getCategoryLabel(post.category)}
          </Link>
          <Link href={`/blog/${post.slug}`}>
            <h3 className="mt-3 text-h3 md:text-h2 font-semibold text-neutral-900 leading-snug line-clamp-3 hover:text-orange-600 transition-colors">
              {post.title}
            </h3>
          </Link>
          <p className="mt-2 text-body text-neutral-600 line-clamp-2">
            {post.shortDescription || post.excerpt}
          </p>
          <div className="mt-4 flex items-center gap-3 text-body-sm text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <Icon src="/assets/icons/calendar.svg" size={14} className="text-orange-500" />
              {formatDate(post.publishedDate, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon src="/assets/icons/clock.svg" size={14} className="text-orange-500" />
              {post.readTime}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-section-beige bg-white shadow-sm hover:shadow-md hover:shadow-orange-500/20 transition-shadow h-full",
        className
      )}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="relative aspect-[16/10] overflow-hidden"
      >
        <Image
          src={imgSrc}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </Link>
      <div className="flex flex-col flex-1 p-4">
        <Link
          href={`/blog?category=${post.category}`}
          className="inline-flex items-center rounded-full bg-orange-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-orange-600 hover:bg-orange-500/20 transition-colors w-fit"
        >
          {getCategoryLabel(post.category)}
        </Link>
        <Link href={`/blog/${post.slug}`} className="mt-2.5 flex-1">
          <h3 className="text-body font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
            {post.title}
          </h3>
        </Link>
        <div className="mt-3 flex items-center gap-3 text-caption text-neutral-500">
          <span className="inline-flex items-center gap-1">
            <Icon src="/assets/icons/calendar.svg" size={12} className="text-orange-500" />
            {formatDate(post.publishedDate, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon src="/assets/icons/clock.svg" size={12} className="text-orange-500" />
            {post.readTime}
          </span>
        </div>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Public BlogCard
// ---------------------------------------------------------------------------

export function BlogCard({
  post,
  featured = false,
  variant = "overlay",
  className,
}: BlogCardProps) {
  if (variant === "article") {
    return <ArticleCard post={post} featured={featured} className={className} />;
  }
  return <OverlayCard post={post} featured={featured} className={className} />;
}
