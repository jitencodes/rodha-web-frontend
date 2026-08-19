import { cn } from "@/lib/utils";
import { FacultyIcon } from "@/lib/faculty-icons";

interface FacultyInfoCardProps {
  title: string;
  children: React.ReactNode;
  variant?: "default" | "quote";
  className?: string;
}

const LIGHT_CARD =
  "rounded-xl border border-section-beige bg-white shadow-sm shadow-orange-500/5";

export function FacultyInfoCard({
  title,
  children,
  variant = "default",
  className,
}: FacultyInfoCardProps) {
  return (
    <div
      className={cn(
        "card-premium-hover hover-shine flex flex-col p-5 md:p-6 h-full min-h-0",
        LIGHT_CARD,
        className
      )}
    >
      <h3 className="text-h4 font-semibold text-neutral-900">{title}</h3>
      <div className="mt-3 flex-1 min-h-0">
        {variant === "quote" ? (
          <div className="relative">
            <FacultyIcon name="quote" size={28} className="text-orange-500 mb-2" />
            <p className="text-body text-neutral-600 italic leading-relaxed">
              {children}
            </p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
