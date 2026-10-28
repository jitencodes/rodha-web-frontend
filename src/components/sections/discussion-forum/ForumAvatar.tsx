import { cn } from "@/lib/utils";

type ForumAvatarProps = {
  name: string;
  className?: string;
  textClassName?: string;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

/** Initials circle using Rodha primary orange (approved forum avatar style). */
export function ForumAvatar({ name, className, textClassName }: ForumAvatarProps) {
  return (
    <div
      role="img"
      aria-label={name}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-orange-500/15 font-semibold text-orange-400 select-none",
        className
      )}
    >
      <span className={cn("leading-none", textClassName)}>{getInitials(name)}</span>
    </div>
  );
}
