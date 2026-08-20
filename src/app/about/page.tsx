import { AboutHeroSection } from "@/components/sections/about/AboutHeroSection";
import { AboutMissionVisionSection } from "@/components/sections/about/AboutMissionVisionSection";
import { AboutJourneyTimeline } from "@/components/sections/about/AboutJourneyTimeline";
import { AboutDifferentiatorsSection } from "@/components/sections/about/AboutDifferentiatorsSection";
import { AboutImpactSection } from "@/components/sections/about/AboutImpactSection";
import { AboutFounderSection } from "@/components/sections/about/AboutTestimonialSection";
import { AboutFinalCtaSection } from "@/components/sections/about/AboutFinalCtaSection";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { LovedTeamSection } from "@/components/sections/LovedTeamSection";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "About Us — Rodha",
  description:
    "Learn about Rodha's mission to democratize competitive exam preparation through expert mentorship, proven strategies, and real results.",
  path: "/about",
});

const aboutBreadcrumb = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(aboutBreadcrumb)) }}
      />
      <AboutHeroSection />
      <AboutMissionVisionSection />
      <AboutJourneyTimeline />
      <AboutDifferentiatorsSection />
      <AboutImpactSection />
      {/* <AboutMentorsSection /> */}
      <LovedTeamSection />
      <AboutFounderSection />
      <AboutFinalCtaSection />
    </>
  );
}
