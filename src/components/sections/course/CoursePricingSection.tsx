import { Container } from "@/components/layout/Container";
import { PricingPlanCard } from "@/components/cards/PricingPlanCard";
import { SectionHeaderV2 } from "@/components/sections/SectionHeaderV2";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { cn } from "@/lib/utils";
import type { CoursePricingPlan } from "@/lib/types";

interface CoursePricingSectionProps {
  plans: CoursePricingPlan[];
  className?: string;
}

export function CoursePricingSection({
  plans,
  className,
}: CoursePricingSectionProps) {
  if (plans.length === 0) return null;

  const colClass =
    plans.length === 1
      ? "max-w-md mx-auto"
      : plans.length === 2
        ? "sm:grid-cols-2 max-w-3xl mx-auto"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      className={cn(
        "home-section-spacing bg-section-beige home-on-light",
        className
      )}
    >
      <Container>
        <SectionHeaderV2
          badge="PRICING"
          title="Choose Your Plan"
          subtitle="Pick the track that matches your preparation goals. Enrolment completes on Graphy."
          align="center"
          className="mx-auto lg:!mb-10"
        />
        <RevealGroup>
          <div className={cn("grid grid-cols-1 gap-5", colClass)}>
            {plans.map((plan, index) => (
              <div
                key={`${plan.name}-${index}`}
                className={`reveal-child reveal-delay-${(index % 4) + 1} h-full`}
              >
                <PricingPlanCard plan={plan} className="h-full" />
              </div>
            ))}
          </div>
        </RevealGroup>
      </Container>
    </section>
  );
}
