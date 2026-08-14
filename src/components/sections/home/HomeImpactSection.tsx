"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ImpactGrowthTimeline } from "@/components/sections/home/ImpactGrowthTimeline";
import { ImpactStatsRow } from "@/components/sections/home/ImpactStatsRow";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { Icon } from "@/components/ui/Icon";
import { useInView } from "@/hooks/useInView";
import { IMPACT_STATS } from "@/data/home-impact";

export function HomeImpactSection() {
  const { ref, isInView } = useInView<HTMLDivElement>({ once: true, threshold: 0.15 });
  const [counterValues, setCounterValues] = useState(IMPACT_STATS.map(() => 0));
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (!isInView) return;

    if (reducedMotion) {
      setCounterValues(IMPACT_STATS.map((s) => s.value));
      return;
    }

    const duration = 1500;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCounterValues(IMPACT_STATS.map((s) => Math.round(s.value * eased)));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, reducedMotion]);

  return (
    <section data-home-zone="impact" className="home-section-spacing home-on-light relative">
      <Container>
        <div ref={ref}>
          <RevealGroup>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
              <div className="lg:col-span-5 reveal-child reveal-delay-1">
                <p className="text-body-sm uppercase tracking-wider text-orange-500 font-semibold mb-2">
                  Our Impact
                </p>
                <h2 className="text-h2 md:text-h1 font-bold home-light-heading leading-tight">
                  Two lakh+ students.
                  <br />
                  A decade of
                  <br />
                  <span className="text-orange-500">momentum.</span>
                </h2>
                <p className="mt-3 text-body home-light-body leading-relaxed">
                  From aspirants to achievers — we&apos;ve built a legacy of trust, results,
                  and transformations.
                </p>
                <Link
                  href="/cat#results"
                  className="mt-5 inline-flex items-center gap-2 btn-secondary text-body-sm px-5 py-2.5 rounded-[6px] bg-white border-orange-500/30 text-neutral-900 hover:border-orange-500/60"
                >
                  Explore Our Results
                  <Icon src="/assets/icons/arrow-right.svg" size={14} className="text-orange-500" />
                </Link>

                <ImpactStatsRow stats={IMPACT_STATS} values={counterValues} />
              </div>

              <div className="lg:col-span-7 reveal-child reveal-delay-2 min-h-[280px] sm:min-h-[320px]">
                <ImpactGrowthTimeline />
              </div>
            </div>
          </RevealGroup>
        </div>
      </Container>
    </section>
  );
}
