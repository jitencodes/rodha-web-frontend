import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FacultyIcon } from "@/lib/faculty-icons";
import { cn, formatPrice } from "@/lib/utils";
import type { CoursePricingPlan } from "@/lib/types";

interface PricingPlanCardProps {
  plan: CoursePricingPlan;
  className?: string;
}

export function PricingPlanCard({ plan, className }: PricingPlanCardProps) {
  const href = plan.href || "#";
  const isExternal = href.startsWith("http");

  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-[6px] border bg-white p-5 md:p-6 shadow-sm",
        plan.popular
          ? "border-orange-500 shadow-orange-500/15"
          : "border-section-beige shadow-orange-500/5",
        className
      )}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          Most Popular
        </span>
      )}

      <h3 className="text-h4 font-semibold text-neutral-900">{plan.name}</h3>
      <p className="mt-2 text-body-sm text-neutral-600 leading-relaxed">
        {plan.description}
      </p>

      <div className="mt-5 flex flex-wrap items-end gap-2">
        <span className="text-[1.75rem] font-bold leading-none text-neutral-900">
          {plan.price === 0 ? "FREE" : formatPrice(plan.price)}
        </span>
        {plan.originalPrice != null && plan.originalPrice > plan.price && (
          <span className="text-body-sm text-neutral-400 line-through">
            {formatPrice(plan.originalPrice)}
          </span>
        )}
      </div>

      {plan.features.length > 0 && (
        <ul className="mt-5 space-y-2.5 flex-1">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-body-sm text-neutral-700"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                <FacultyIcon name="check" size={11} />
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        {isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-premium premium-border-glow glow-accent-orange inline-flex h-11 w-full items-center justify-center rounded-md bg-orange-500 px-5 text-body font-semibold text-white hover:bg-orange-600"
          >
            {plan.ctaLabel || "Select Plan"}
          </a>
        ) : (
          <Link href={href} className="block">
            <Button fullWidth size="lg">
              {plan.ctaLabel || "Select Plan"}
            </Button>
          </Link>
        )}
      </div>
    </article>
  );
}
