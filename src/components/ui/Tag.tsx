import { cn } from "@/lib/utils";

interface TagProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: "dark" | "light";
  type?: "button" | "submit";
}

export function Tag({
  children,
  active,
  onClick,
  className,
  variant = "dark",
  type = "button",
}: TagProps) {
  const Component = onClick ? "button" : "span";

  return (
    <Component
      type={onClick ? type : undefined}
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-body-sm font-medium transition-all whitespace-nowrap",
        variant === "light"
          ? active
            ? "bg-orange-500 text-white border-orange-500"
            : "bg-white text-neutral-600 border-section-beige hover:text-neutral-900 hover:border-orange-300"
          : active
            ? "bg-orange-500/15 text-orange-400 border-orange-500/30"
            : "bg-bg-surface text-text-muted border-border-default hover:border-border-hover hover:text-text-secondary",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </Component>
  );
}
